import { styled } from "styled-components";
import Center from "./Center";
import Button from "./Button";
import { ButtonLink } from "./ButtonLink";
import { CartIcon } from "./icons/CartIcon";
import { useContext } from "react";
import { CartContext } from "./CartContext";

const Bg = styled.div`
  background-color: #222;
  color: #fff;
  padding: 50px 0;
`;

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 40px;

  img {
    max-width: 100%;
  }
`;

const Column = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
  font-weight: normal;
  font-size: 3rem;
`;

const Desc = styled.p`
  color: #aaa;
  font-size: 0.8rem;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 25px;
`;

export default function Featured({ product }) {

  const {addProduct} = useContext(CartContext)

 
 
  return (
    <Bg>
      <Center>
        <ColumnsWrapper>
          <div>
            <Column>
              <div>
                <Title>{product?.title}</Title>
                <Desc>{product?.description}</Desc>
                <ButtonsWrapper>
                  <ButtonLink
                    outline={1}
                    white={1}
                    href={"/products/" + product?._id}
                  >
                    Read More
                  </ButtonLink>
                  <Button white={1} onClick={() => addProduct(product?._id)}>
                    <CartIcon />
                    Add to cart
                  </Button>
                </ButtonsWrapper>
              </div>
            </Column>
          </div>

          <div>
            <img src="https://res.cloudinary.com/dzss1fbkm/image/upload/v1693569276/51wZPnAGo0L.__AC_SX300_SY300_QL70_ML2_-removebg-preview_udsd6n.png" />
          </div>
        </ColumnsWrapper>
      </Center>
    </Bg>
  );
}
