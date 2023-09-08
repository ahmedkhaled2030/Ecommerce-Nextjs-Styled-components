import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
const stripe = require('stripe')(process.env.STRIPE_SK)

export default async function handle(req, res) {

    console.log('req.body' , req.body)
    await mongooseConnect();
    const ids = req.body.ids;
    res.json(await Product.find({_id:ids}))
}