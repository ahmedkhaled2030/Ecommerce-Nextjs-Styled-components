import { useState } from "react";
import styled from "styled-components";
import StarSolid from "./icons/StarSolid";
import StarOutline from "./icons/StarOutline";
import { primary } from "@/lib/colors";

const StarsWrapper = styled.div`
  display: inline-flex;
  gap: 1px;
  align-items: center;
`;

const StarWrapper = styled.button`
  ${(props) =>
    props.size === "md" &&
    `
 height: 1.4rem;
  width: 1.4rem;
`}
  ${(props) =>
    props.size === "sm" &&
    `
    height: 1rem;
  width: 1rem;
`}

${(props) =>
    !props.disabled &&
    `
  cursor: pointer;
`}
 
  background-color: transparent;
  padding: 0;
  border: 0;
  display: inline-block;
  color: ${primary};
`;

export default function StarsRating({
  defaultHowMany = 0,
  size = "md",
  disabled,
  onChange ,
}) {
  const [howMany, setHowMany] = useState(defaultHowMany);
  const five = [1, 2, 3, 4, 5];
  function handleStarClick(n) {
    if (disabled) {
      return;
    }
    setHowMany(n);
    onChange(n);
  }
  return (
    <StarsWrapper>
      {five.map((n) => (
        <>
          <StarWrapper
            size={size}
            disabled={disabled}
            onClick={() => handleStarClick(n)}
          >
            {howMany >= n ? <StarSolid /> : <StarOutline />}
          </StarWrapper>
        </>
      ))}
    </StarsWrapper>
  );
}
