import * as React from 'react';
import { Link } from 'react-router-dom';
import styled , { css } from 'styled-components';

const StyledLink= styled(Link)`
  color: white;
  &:hover {
    text-decoration: underline;
  }
  &:first-child {
    margin-right: 10px;
  }
`;

const styles = css`

`
const Navbar = () => {
  return(
    <React.Fragment>
      <StyledLink to="/">HOME</StyledLink>
      <StyledLink to="/Graph">Graph</StyledLink>
    </React.Fragment>
  )
}

const StyledNavbar = styled(Navbar)`
  ${styles};
`
export default StyledNavbar