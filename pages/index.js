import Featured from "@/components/Featured";
import Header from "@/components/Header";
import NewProducts from "@/components/NewProducts";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { WishedProduct } from "@/models/WishedProduct";

export default function HomePage({ featuredProduct, newProducts , wishedProducts }) {
  return (
    <div>
      <Header />
      <Featured product={featuredProduct} />
      <NewProducts products={newProducts} wishedProducts ={wishedProducts} />
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const featuredProductId = "65041b1d3fab4ec28fcfb69a";
  await mongooseConnect();

  const featuredProduct = await Product.findById(featuredProductId);
  const newProducts = await Product.find({}, null, {
    sort: { _id: -1 },
    limit: 10,
  });
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const wishedProducts = session?.user ? await WishedProduct.find({
    userEmail: session?.user.email,
    product: newProducts.map((p) => p._id.toString()),
  }) : [];

  
  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      wishedProducts: wishedProducts.map(i => i.product.toString()),
    },
  };
}
