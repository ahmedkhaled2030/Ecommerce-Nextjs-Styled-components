import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ProductsGrid from "@/components/ProductsGrid";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";

const SearchInput = styled(Input)`
  margin: 30px 0 30px;
  padding: 5px 10px;
  font-size: 1.4rem;
  border-radius: 5px;
`;

export default function SearchPage() {
  const [phrase, setPhrase] = useState("");
  const [products, setProducts] = useState([]);
  useEffect(() => {
    if (phrase.length > 0) {
      axios
        .get("/api/search?phrase=" + encodeURIComponent(phrase))
        .then((res) => {
          setProducts(res.data);
        });
    }
  }, [phrase]);
  return (
    <>
      <Header />
      <Center>
        <SearchInput
          autoFocus
          placeholder="Search for Products"
          value={phrase}
          onChange={(ev) => setPhrase(ev.target.value)}
        />
        <ProductsGrid products={products} />
      </Center>
    </>
  );
}
