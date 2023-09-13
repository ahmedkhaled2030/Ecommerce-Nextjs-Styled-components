import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
const stripe = require("stripe")(process.env.STRIPE_SK);
import { buffer } from 'micro'



const endpointSecret = "whsec_1913c68061ea6101cd861c1233d2dfb40e36cfcd32c6dd6cd35a685cf1fadcef";


export default async function handler(req, res) { 

    await mongooseConnect();
    const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(await buffer(req), sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.succeeded':
          const data = event.data.object;
          const orderId = data.metadata.orderId
          const paid = data.payment.status === 'paid'
          
          if (orderId && paid) {
              await Order.findByIdAndUpdate(orderId, {
                  paid:true
              })
          }
          
      
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }
res.status(200).send('ok') 
}

export const config = {
    api: {bodyParser:false}
}

//liked-joyous-mighty-soft
//acct_1MIyuMDg5GhZyHS6