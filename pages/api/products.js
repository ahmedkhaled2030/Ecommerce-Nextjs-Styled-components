import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handle(req, res) {
  await mongooseConnect();

    const { categories, sort, ...filters } = req.query;
    const [sortField, sortOrder] = sort.split('-')
    const productQuery = {
        category  :categories.split(',')
    }

    if (Object.keys(filters).length > 0) {
        Object.keys(filters).forEach(filterName => {
            productQuery['properties.'+filterName] = filters[filterName]
        })
    }
  console.log('productQuery' ,productQuery)
    res.json(await Product.find(productQuery, null, {
      sort:{[sortField]:sortOrder ==='asc'? 1 : -1}
  }));
}
 