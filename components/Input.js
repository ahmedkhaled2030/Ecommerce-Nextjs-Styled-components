import { styled } from "styled-components";

const StyledInput = styled.input`
  width: 100%;
  border-radius: 5px;
  padding: 5px;
  border: 1px solid #ccc;
  margin-bottom: 5px;
  box-sizing: border-box;
  color: #000;
`;

const Input = (props) => {
  return <StyledInput {...props} />
};

export default Input;
