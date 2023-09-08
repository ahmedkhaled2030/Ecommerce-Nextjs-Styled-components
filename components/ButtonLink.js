
import Link from 'next/link';
import { ButtonStyle } from './Button';
import { styled } from 'styled-components';



const StyledButton = styled(Link)`
${ButtonStyle}
`

export const ButtonLink = (props) => {
  return (
    <StyledButton {...props}   />
  )
}
