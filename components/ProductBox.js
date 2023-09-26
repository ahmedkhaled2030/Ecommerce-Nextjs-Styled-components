import { styled } from "styled-components";
import Button from "./Button";
import Link from "next/link";
import { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import HeartOutlineIcon from "./icons/HeartOutlineIcon";
import HeartSolidIcon from "./icons/HeartSolidIcon";
import axios from "axios";
import { useSession } from "next-auth/react";

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
  position: relative;
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
    font-weight: 600;
  }
`;

const WishListButton = styled.button`
  border: none;
  width: 40px;
  height: 40px;
  padding: 10px;
  position: absolute;
  top: 0;
  right: 0;
  background: transparent;
  ${props => props.wished ? `
  color:red;
  ` : `
  color:black;
  `}
  cursor: pointer;
  svg {
    width: 20px;
  }
`;

export const ProductBox = ({ _id, title, description, price, images ,wished = false ,onRemoveFromWishList=() => {} }) => {
  const url = "/product/" + _id;
  const { addProduct } = useContext(CartContext);
  const [isWished, setIsWished] = useState(wished);
  const { data: session } = useSession();
  const addToWishList = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();

    const nextValue = !isWished;
    if (nextValue == false && onRemoveFromWishList) {
      onRemoveFromWishList(_id)
    }
    axios.post('/api/wishlist', {
      product: _id
    }).then(() => {});
    setIsWished(nextValue)   
  };
  return (
    <ProductWrapper>
      <WhiteBox href={url}>
        <div>
          {session && (
            <WishListButton wished={isWished} onClick={addToWishList}>
            {isWished ? <HeartSolidIcon /> : <HeartOutlineIcon />}
          </WishListButton>
          )}
          
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
