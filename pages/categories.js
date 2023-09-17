import Center from "@/components/Center";
import Header from "@/components/Header";
import { ProductBox } from "@/components/ProductBox";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import Link from "next/link";
import styled from "styled-components";

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const CategoryTitle = styled.div`
  display: flex;
  margin-top: 10px;
  margin-bottom: 0;
  align-items: center;
  gap: 10px;
  h2 {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  a {
    color: #555;
    display: inline-block;
  }
`;

const CategoryWrapper = styled.div`
  margin-bottom: 40px;
`;

const ShowAllSquare = styled(Link)`
  background-color: #ddd;
  height: 160px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  text-decoration: none;
`;

export default function CategoriesPage({ mainCategories, categoriesProducts }) {
  return (
    <>
      <Header />
      <Center>
        {mainCategories?.map((cat) => (
          <CategoryWrapper key={cat._id}>
            <CategoryTitle>
              <h2>{cat.name}</h2>
              <div>
                <Link href={"category/" + cat._id}>Show all</Link>
              </div>
            </CategoryTitle>
            <CategoryGrid>
              {categoriesProducts[cat._id].map((p) => (
                <ProductBox key={p._id} {...p} />
              ))}

              <ShowAllSquare href={"category/" + cat._id}>
                Show all &rarr;
              </ShowAllSquare>
            </CategoryGrid>
          </CategoryWrapper>
        ))}
      </Center>
    </>
  );
}

export async function getServerSideProps() {
  const categories = await Category.find();

  const mainCategories = categories.filter((c) => !c.parent);

  const categoriesProducts = {};

  for (const mainCat of mainCategories) {
    const mainCatId = mainCat._id.toString();
    const childCatIds = categories
      .filter((c) => c?.parent?.toString() === mainCatId)
      .map((c) => c._id.toString());

    const categoriesIds = [mainCatId, ...childCatIds];

    const products = await Product.find({ category: categoriesIds }, null, {
      limit: 3,
      sort: { _id: -1 },
    });
    categoriesProducts[mainCat._id] = products;
    console.log("categoriesProducts", categoriesProducts);
    //HINT: '65041a1b3fab4ec28fcfb673': [
    // {
    //     _id: new ObjectId("65041b613fab4ec28fcfb6a2"),
    //     title: '14-DQ2089WM Laptop',
    //     description: 'Laptop With 14-Inch HD Display, 11th Gen Core i3-1115G4 Processor/8GB',
    //     price: 450,
    //     images: [Array],
    //     category: new ObjectId("65041a263fab4ec28fcfb677"),
    //     properties: [Object],
    //     createdAt: 2023-09-15T08:52:49.572Z,
    //     updatedAt: 2023-09-15T08:52:49.572Z,
    //     __v: 0
    //   },
    //   {
    //     _id: new ObjectId("65041b1d3fab4ec28fcfb69a"),
    //     title: 'MacBook Air',
    //     description: 'MacBook Air MGN93 With 13.3-Inch Display, M1 Chip With 8-Core CPU And 7-Core GPU/8GB RAM/256GB SSD/ English Keyboard Silver',
    //     price: 800,
    //     images: [Array],
    //     category: new ObjectId("65041a333fab4ec28fcfb67b"),
    //     properties: [Object],
    //     createdAt: 2023-09-15T08:51:41.351Z,
    //     updatedAt: 2023-09-15T08:51:41.351Z,
    //     __v: 0
    //   }
    // ]
  }

  return {
    props: {
      mainCategories: JSON.parse(JSON.stringify(mainCategories)),
      categoriesProducts: JSON.parse(JSON.stringify(categoriesProducts)),
    },
  };
}
