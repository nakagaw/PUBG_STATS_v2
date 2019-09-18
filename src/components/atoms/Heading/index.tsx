import * as React from 'react';
import styled, { css }  from 'styled-components';

interface IProps {
  className?: string;
  level?: string | undefined;
  visualLevel?: string | undefined;
  children?:  string;
}

const headingStyles = ({ level, visualLevel }: IProps) => {
  visualLevel = (visualLevel !== undefined) ? visualLevel : level;
  switch (visualLevel) {
    case "V1":
      return css`
        color: tomato;
        font-size: .64rem;
      `
    case "V2":
      return css`
        color: deepskyblue;
        font-size: .48rem;
      `
    case "V3":
      return css`
        color: yellowgreen;
        font-size: .32rem;
      `
    default:
      return css`
        font-size: .48rem;
      `
  }
}

const styles = css`
  font-weight: 700;
  line-height: 1.4;
  margin-top: 0;
  margin-bottom: 0;
  ${headingStyles};
`

const Heading = ({
  className,
  level,
  children
}: IProps) => {
  switch (level) {
    case "H1":
      return (
        <h1 className={className}>
          {children}
        </h1>
      )
    case "H2":
      return (
        <h2 className={className}>
          {children}
        </h2>
      )
    case "H3":
      return (
        <h3 className={className}>
          {children}
        </h3>
      )
    default:
      return (
        <h2 className={className}>
          {children}
        </h2>
      )
  }
}

const StyledHeading = styled(Heading)`
  ${styles};
`
export default StyledHeading