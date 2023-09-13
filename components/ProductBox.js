import { styled } from "styled-components";
import Button from "./Button";
import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "./CartContext";

const ProductWrapper = styled.div``;

const WhiteBox = styled(Link)`
  background-color: #fff;
  padding: 20px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 10px;
  img {
    max-width: 100%;
    max-width: 110px;
  }
`;

const Title = styled(Link)`
  font-weight: 400;
  font-size: 0.9rem;
  margin: 0;
  color: inherit;
  text-decoration: none;
`;

const ProductInfoBox = styled.div`
  margin-top: 5px;
`;

const PriceRow = styled.div`
  display: block;
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;

  @media screen and (min-width: 768px) {
    display: flex;
    gap: 5px;
  }
`;

const Price = styled.div`
  font-size: 1rem;
  font-weight: 400;
  text-align: right;
  margin: 5px 0;
  @media screen and (min-width: 768px) {
    font-size: 1.2rem;
    text-align: left;
    font-weight:600;
  }
`; 

export const ProductBox = ({ _id, title, description, price, images }) => {
  const url = "/product/" + _id;
  const { addProduct } = useContext(CartContext);
  return (
    <ProductWrapper>
      <WhiteBox href={url}>
        <div>
          <img src={images[0]} alt="" />
        </div>
      </WhiteBox>
      <ProductInfoBox>
        <Title href={url}>{title}</Title>
        <PriceRow>
          <Price>${price}</Price>
          <Button block primary outline onClick={() => addProduct(_id)}>
            Add to cart
          </Button>
        </PriceRow>
      </ProductInfoBox>
    </ProductWrapper>
  );
};
