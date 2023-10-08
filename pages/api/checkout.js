import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { Setting } from "@/models/Setting";

const stripe = require("stripe")(process.env.STRIPE_SK);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.json("should be a POST request");
    return;
  }

  const {
    name,
    email,
    city,
    postalCode,
    streetAddress,
    country,
    cartProducts,
  } = req.body;

  await mongooseConnect();
  //HINT: ProductIds = cartProducts: ['64f431f0b003d928f9cbb5eb','64f4323db003d928f9cbb5f3','64f431f0b003d928f9cbb5eb']
  const productsIds = cartProducts;
  //HINT: Set(ProductIds) = {'64f431f0b003d928f9cbb5eb','64f4323db003d928f9cbb5f3'}
  const uniqueIds = [...new Set(productsIds)];
  //HINT: uniqueIds = ['64f431f0b003d928f9cbb5eb','64f4323db003d928f9cbb5f3']
  const productsInfos = await Product.find({ _id: uniqueIds });

  let line_items = [];

  for (const productId of uniqueIds) {
    //HINT: to insure that the ids come from the cart is already in the database
    //HINT: p._id.toString() to insure that the id is string not object
    const productInfo = productsInfos.find(
      (p) => p._id.toString() === productId
    );

    const quantity = productsIds.filter((id) => id === productId)?.length || 0;
    console.log("quantity", quantity);

    if (quantity > 0 && productInfo) {
      console.log("productInfo", productInfo);
      line_items.push({
        quantity,
        price_data: {
          currency: "USD",
          product_data: { name: productInfo.title },
          unit_amount: productInfo.price * 100,
        },
      });
    }
  }

  const session = await getServerSession(req, res, authOptions);

  const orderDoc = await Order.create({
    line_items,
    name,
    email,
    city,
    postalCode,
    streetAddress,
    country,
    paid: false,
    userEmail: session?.user?.email,
  });

  const shippingFeeSettings = await Setting.findOne({ name: "shippingFee" });
  const shippingFeeCents = parseInt(shippingFeeSettings.value || "0") * 100;
  const stripeSession = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    customer_email: email,
    success_url: process.env.PUBLIC_URL + "/cart?success=1",
    cancel_url: process.env.PUBLIC_URL + "/cart?canceled=1",
    metadata: { orderId: orderDoc._id.toString() },
    allow_promotion_codes:true,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "shipping fee",
          type: "fixed_amount",
          fixed_amount: { amount: shippingFeeCents, currency: "USD" },
        },
      },
    ],
  });

  res.json({
    url: stripeSession.url,
  });
}
