import styled from "styled-components";

const StyledInput = styled.textarea`
  width: 100%;
  border-radius: 5px;
  padding: 5px;
  border: 1px solid #ccc;
  margin-bottom: 5px;
  box-sizing: border-box;
  font-family: inherit;
`;

export default function Textarea(props) {
  return <StyledInput {...props} />;
}
