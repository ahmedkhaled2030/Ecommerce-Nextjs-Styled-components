import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ProductsGrid from "@/components/ProductsGrid";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

const SearchInput = styled(Input)`
 
  padding: 5px 10px;
  font-size: 1.4rem;
  border-radius: 5px;
`;

const InputWrapper = styled.div`
position: sticky;
top:70px;
margin:25px 0;
padding: 5px 0;
background-color: #eeeeeeaa;
`

export default function SearchPage() {
  const [phrase, setPhrase] = useState("");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearch = useCallback(debounce(searchProducts, 500), []);
  useEffect(() => {
    if (phrase.length > 0) {
      setIsLoading(true);
      debouncedSearch(phrase);
    } else {
      setProducts([]);
    }
  }, [phrase]);

  function searchProducts(phrase) {
    axios
      .get("/api/search?phrase=" + encodeURIComponent(phrase))
      .then((res) => {
        setProducts(res.data);
        setIsLoading(false);
      });
  }

  return (
    <>
      <Header />
          <Center>
              <InputWrapper>
              <SearchInput
          autoFocus
          placeholder="Search for Products"
          value={phrase}
          onChange={(ev) => setPhrase(ev.target.value)}
        />
              </InputWrapper>
        
        {!isLoading && phrase !== "" && products.length === 0 && (
          <h2>No products found for query "{phrase}"</h2>
        )}
        {isLoading && <Spinner fullWidth={true} />}
        {!isLoading && phrase !== "" && products.length > 0 && (
          <ProductsGrid products={products} />
        )}
      </Center>
    </>
  );
}
