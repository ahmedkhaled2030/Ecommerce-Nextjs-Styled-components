import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handle(req, res) {
  await mongooseConnect();

    const { phrase ,sort } = req.query;
    console.log('phrase' ,phrase)
    const [sortField, sortOrder] = (sort || '_id-desc').split('-')
    
    const productQuery = {}

    if (phrase) {
        productQuery['$or'] = [
            { title: { $regex: phrase, $options: 'i' } },
            {description : {$regex:phrase, $options:'i'}},
        ]
    }

    
  console.log('productQuery' ,productQuery)
    res.json(await Product.find(productQuery, null, {
      sort:{[sortField]:sortOrder ==='asc'? 1 : -1}
  }));
}
 