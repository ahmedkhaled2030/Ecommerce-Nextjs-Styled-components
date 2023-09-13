import { useState } from "react";
import styled from "styled-components";

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
`;
const BigImage = styled.img`
  max-width: 100%;
  max-height: 250px;
`;
const ImageButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
  justify-content: center;
  flex-grow: 0;
`;

const ImageButton = styled.div`
  border: 2px solid #ccc;
  ${props => props.active ? `
      border-color: #ccc;
    ` : `
      border-color: transparent;
    `}
  height: 60px;
  padding: 2px;
  cursor: pointer;
  border-radius: 5px;
`;


const BigImageWrapper = styled.div`

text-align: center;
`
export default function ProductImages({ images }) {
  const [activeImage, setActiveImage] = useState(images?.[0]);
  console.log("images", images);
  return (
      <>
          <BigImageWrapper>
          <BigImage src={activeImage} alt="" />
          </BigImageWrapper>
  
      <ImageButtons>
        {images.map((image) => (
          <ImageButton key={image} active={image === activeImage} onClick={() => setActiveImage(image)} >
            <Image src={image} alt="" />
          </ImageButton>
        ))}
      </ImageButtons>
    </>
  );
}
