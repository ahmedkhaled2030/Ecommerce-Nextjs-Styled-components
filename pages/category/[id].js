import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import Spinner from "@/components/Spinner";
import Title from "@/components/Title";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  h1 {
    font-size: 1.5rem;
  }
`;

const FilterWrapper = styled.div`
  display: flex;
  gap: 15px;
`;

const Filter = styled.div`
  background-color: #ddd;
  padding: 5px 10px;
  border-radius: 5px;
  display: flex;
  gap: 5px;
  color: #444;
  select {
    background-color: transparent;
    border: 0;
    /* font-size: inherit; */
    color: #444;
  }
`;


const ProductsWrapper = styled.div`
margin-top:2rem
`

const CategoryPage = ({
  category,
  subCategories,
  products: originalProducts,
}) => {
  const defaultSorting = "_id-desc";
  const defaultFilterValues = category.properties.map((p) => ({
    name: p.name,
    value: "all",
  }));
  const [products, setProducts] = useState(originalProducts);
  const [filterValues, setFilterValues] = useState(defaultFilterValues);
  const [sort, setSort] = useState(defaultSorting);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [filtersChanged, setFiltersChanged] = useState(false);
  const handleFilterChange = (filterName, filterValue) => {
    setFilterValues((prev) => {
      return prev.map((p) => ({
        name: p.name,
        value: p.name === filterName ? filterValue : p.value,
      }));
    });
    setFiltersChanged(true);
  };

  useEffect(() => {
    if (!filtersChanged) {
      return;
    }
    setLoadingProducts(true);
    const catIds = [category._id, ...(subCategories?.map((c) => c._id) || [])];
    const params = new URLSearchParams();
    //HINT: \api\products?categories=650416a73fab4ec28fcfb616%2C650417a23fab4ec28fcfb61d%2C650418503fab4ec28fcfb64
    //HINT: IN ORDER to make that
    params.set("categories", catIds.join(","));
    params.set("categories", catIds.join(","));
    params.set("sort", sort);
    filterValues.forEach((f) => {
      if (f.value !== "all") {
        params.set(f.name, f.value);
      }
    });
    const url = "/api/products?" + params.toString();
    axios.get(url).then((res) => {
      setProducts(res.data);
      setLoadingProducts(false);
    });
  }, [filterValues, sort, filtersChanged]);

  return (
    <>
      <Header />
      <Center>
        <CategoryHeader>
          <h1>{category.name}</h1>
          <FilterWrapper>
            {category.properties.map((prop) => (
              <Filter key={prop.name}>
                <span>{prop.name}:</span>

                <select
                  onChange={(ev) =>
                    handleFilterChange(prop.name, ev.target.value)
                  }
                  value={filterValues.find((f) => f.name === prop.name).value}
                >
                  <option value="all">All</option>
                  {prop.values.map((val) => (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  ))}
                </select>
              </Filter>
            ))}

            <Filter>
              <span>Sort:</span>
              <select
                value={sort}
                onChange={(ev) => {
                  setSort(ev.target.value);
                  setFiltersChanged(true);
                }}
              >
                <option value="price-asc">price, lowest first</option>
                <option value="price-desc">price, highest first</option>
                <option value="_id-desc">Newest first</option>
                <option value="_id-asc">oldest first</option>
              </select>
            </Filter>
          </FilterWrapper>
        </CategoryHeader>
        {loadingProducts && <Spinner fullWidth />}

        {!loadingProducts && (
          <ProductsWrapper>
            {products.length > 0 && <ProductsGrid products={products} />}

            {products.length === 0 && <div>Sorry , no products found</div>}
          </ProductsWrapper>
        )}
      </Center>
    </>
  );
};

export default CategoryPage;

export async function getServerSideProps(ctx) {
  const category = await Category.findById(ctx.query.id);
  const subCategories = await Category.find({ parent: category._id });

  const catIds = [
    category._id.toString(),
    ...subCategories.map((c) => c._id.toString()),
  ];
  const products = await Product.find({ category: catIds });
  console.log("catIds", catIds);
  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
      subCategories: JSON.parse(JSON.stringify(subCategories)),
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
