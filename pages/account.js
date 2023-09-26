import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import WhiteBox from "@/components/WhiteBox";
import { useSession, signIn, signOut } from "next-auth/react";
import { RevealWrapper } from "next-reveal";
import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/router";
import { ProductBox } from "@/components/ProductBox";
import Tabs from "@/components/Tabs";
import SingleOrder from "@/components/SingleOrder";
const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 40px;
  margin: 40px 0;
  p {
    margin: 5px;
  }
`;

const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;

const WishedProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
`;

export default function AccountPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [country, setCountry] = useState("");
  const [addressLoaded, setAddressLoaded] = useState(true);
  const [wishListLoaded, setWishListLoaded] = useState(true);
  const [orderLoaded, setOrderLoaded] = useState(true);
  const [wishedProducts, setWishedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("Orders");
  const [orders, setOrders] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();

  const logout = async () => {
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    });
  };
  const login = async () => {
    await signIn("google");
  };

  const saveAddress = () => {
    const data = { name, email, city, postalCode, streetAddress, country };

    axios.put("/api/address", data);
  };

  useEffect(() => {
    if (!session) {
      return;
    }
    setAddressLoaded(false);
    setWishListLoaded(false);
    setOrderLoaded(false);
    axios.get("/api/address").then((res) => {
      if (res.data) {
        setName(res.data.name);
        setEmail(res.data.email);
        setCity(res.data.city);
        setPostalCode(res.data.postalCode);
        setStreetAddress(res.data.streetAddress);
        setCountry(res.data.country);
        setAddressLoaded(true);
      }
    });
    axios.get("/api/wishlist").then((res) => {
      setWishedProducts(res.data.map((wp) => wp.product));

      setWishListLoaded(true);
    });

    axios.get("/api/orders").then((res) => {
      console.log(res.data)
      setOrders(res.data);
      setOrderLoaded(true);
    });
  }, [session]);

  const productRemovedFromWishList = (idToRemove) => {
    setWishedProducts((prev) => {
      return [...prev.filter((p) => p._id.toString() !== idToRemove)];
    });
  };
  return (
    <>
      <Header />
      <Center>
        <ColsWrapper>
          <div>
            <RevealWrapper delay={0}>
              <WhiteBox>
                <Tabs
                  tabs={["Orders", "WishList"]}
                  active={activeTab}
                  onChange={setActiveTab}
                />
                {activeTab === 'Orders' && (
                  <>
                    {!orderLoaded && (
                      <Spinner fullWidth={true} />
                    )}
                    {orderLoaded && session && (
                      <div>
                        {orders.length === 0 && (
                          <p>No Orders yet !</p>
                        )}
                        {orders.length > 0 && orders.map(o => (
                         <SingleOrder {...o} key={o._id}  /> 
                       ))}
                      </div>
                    )}
                    {!session && (
                      <p>Login to see your orders ! </p>
                    )}
                  </>
                )}
                {activeTab === "WishList" && (
                  <>
                    {!wishListLoaded && <Spinner fullWidth={true} />}

                    {wishListLoaded && (
                      <>
                        {wishedProducts.length > 0 && (
                          <WishedProductsGrid>
                            {wishedProducts.length > 0 &&
                              wishedProducts.map((wp) => (
                                <ProductBox
                                  key={wp._id}
                                  {...wp}
                                  wished={true}
                                  onRemoveFromWishList={
                                    productRemovedFromWishList
                                  }
                                />
                              ))}
                          </WishedProductsGrid>
                        )}

                        {wishedProducts.length === 0 && (
                          <>
                            {session && <p>Your wishlist is empty</p>}
                            {!session && (
                              <p>Login to add products to tour wishlist  ! </p>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </WhiteBox>
            </RevealWrapper>
          </div>
          <div>
            <RevealWrapper delay={100}>
              <WhiteBox>
                <h2>{session ? "Account details" : "Login"}</h2>
                {!addressLoaded && <Spinner fullWidth={true} />}
                {addressLoaded && session && (
                  <>
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
                    <Button block black onClick={saveAddress}>
                      Save
                    </Button>
                    <hr />
                  </>
                )}

                {session && (
                  <Button primary onClick={logout}>
                    Logout
                  </Button>
                )}
                {!session && (
                  <Button primary onClick={login}>
                    Login
                  </Button>
                )}
              </WhiteBox>
            </RevealWrapper>
          </div>
        </ColsWrapper>
      </Center>
    </>
  );
}
