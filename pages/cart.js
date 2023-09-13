import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Table from "@/components/Table";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { styled } from "styled-components";
import { useRouter } from "next/router";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  margin-top: 40px;

  @media screen and (min-width: 768px) {
    rid-template-columns: 1.2fr 0.8fr;
  }
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
`;

const ProductImageBox = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  img {
    max-width: 100px;
    max-height: 100px;
  }

  @media screen and (min-width: 768px) {
    padding: 10px;
    
  }
`;

const QuantityLabel = styled.span`
display:block;
  padding: 0 15px;
  margin: 5px 0;
  @media screen and (min-width: 768px) {
    display:inline-block;
  padding: 0 10px;
  }
`;

const Total = styled.td`
  padding-top: 10px;
  font-weight: bold;
`;

const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;

export default function CartPage() {
  const { cartProducts, addProduct, removeProduct,clearCart } = useContext(CartContext);
  const router = useRouter();
  const currentUrl = router.asPath;
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [country, setCountry] = useState("");
  const [isSuccess,setIsSuccess] = useState(false);
 



  useEffect(() => {
    if (cartProducts.length > 0) {
      axios.post('/api/cart', {ids:cartProducts})
        .then(response => {
          setProducts(response.data);
        })
    } else {
      setProducts([]);
    }
  }, [cartProducts]);
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (window?.location.href.includes('success')) {
      setIsSuccess(true);
      clearCart();
    }
    
  }, []);

  const moreOfThisProduct = (id) => {
    addProduct(id);
  };

  const lessOfThisProduct = (id) => {
    removeProduct(id);
  };

  const goToPayment = async () => {
    const response = await axios.post("/api/checkout", {
      name,
      email,
      city,
      postalCode,
      streetAddress,
      country,
      cartProducts,
    });

    if (response.data.url) {
      router.push(response.data.url);
    }
  };

  let total = 0;
  for (const productId of cartProducts) {
    const price = products.find((p) => p._id === productId)?.price || 0;
    total += price;
  }

  if (isSuccess) {
    return (
      <>
        <Header />
        <Center>
          <ColumnsWrapper>
            <Box>
              <h1>Thanks for your order!</h1>
              <p>We will email you when your order will be sent.</p>
            </Box>
          </ColumnsWrapper>
        </Center>
      </>
    );
  }
  return (
    <>
      <Header />
      <Center>
        <ColumnsWrapper>
          <Box>
           
          <h2>Cart</h2>
              {!cartProducts?.length && (
                <div>Your cart is empty</div>
              )}
            {products.length > 0 && (
             
              <Table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <ProductInfoCell>
                        <ProductImageBox>
                          <img src={product.images[0]} alt="" />
                        </ProductImageBox>
                        {product.title}
                      </ProductInfoCell>
                      <td>
                        <Button onClick={() => lessOfThisProduct(product._id)}>
                          -
                        </Button>
                        <QuantityLabel>
                          {
                            cartProducts.filter((id) => id === product._id)
                              .length
                          }
                        </QuantityLabel>

                        <Button onClick={() => moreOfThisProduct(product._id)}>
                          +
                        </Button>
                      </td>
                      <td>
                        $
                        {cartProducts.filter((id) => id === product._id)
                          .length * product.price}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    <td></td>
                    <Total>${total}</Total>
                  </tr>
                </tbody>
              </Table>
            )}
          </Box>
          {!!cartProducts?.length && (
            <Box>
              <h2>Order Information</h2>

              <Input
                placeholder="Name"
                type="text"
                value={name}
                name="name"
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                placeholder="Email"
                type="text"
                value={email}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <CityHolder>
                <Input
                  placeholder="City"
                  type="text"
                  value={city}
                  name="city"
                  onChange={(e) => setCity(e.target.value)}
                />
                <Input
                  placeholder="Postal Code"
                  type="text"
                  value={postalCode}
                  name="postalCode"
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </CityHolder>

              <Input
                placeholder="Street Address"
                type="text"
                value={streetAddress}
                name="streetAddress"
                onChange={(e) => setStreetAddress(e.target.value)}
              />
              <Input
                placeholder="Country"
                type="text"
                value={country}
                name="country"
                onChange={(e) => setCountry(e.target.value)}
              />
              <Button block black onClick={goToPayment}>
                Continue to payment
              </Button>
            </Box>
          )}
        </ColumnsWrapper>
      </Center>
    </>
  );
}
