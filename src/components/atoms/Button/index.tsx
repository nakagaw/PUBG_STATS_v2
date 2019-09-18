import * as React from 'react';
import styled, { css } from 'styled-components';

interface IProps {
  type?: 'button' | 'submit' | 'reset' | undefined;
  className?: string;
  id?: string;
  children?: string;
  color?: 'primary' | 'secondary';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
  disabled?: boolean;
  href?: string;
  onClick?: () => void;
}


const buttonColorStyles = ({ color }: IProps) => {
  switch (color) {
    case 'primary':
      return css`
        color: white;
        background-color: tomato;
        :hover {
          color: white;
          background-color: rgba(255, 100,71, 0.8);
        }
      `
    case 'secondary':
      return css`
        color: white;
        background-color: deepskyblue;
        :hover {
          color: white;
          background-color: rgba(0,190,255, 0.8);
        }
      `
    default:
      return css`
        background-color: transparent;
        :hover {
          background-color: transparent;
        }
      `
  }
}
const buttonSizeStyles = ({ size }: IProps) => {
  switch (size) {
    case 'xs':
      return css`
        border-radius: 4px;
        padding: 8px .15rem;
        font-size: .14rem;
      `
    case 'sm':
      return css`
        border-radius: 6px;
        padding: .10rem .15rem;
        font-size: .15rem;
      `
    case 'md':
      return css`
        border-radius: 8px;
        padding: .12rem .25rem;
        font-size: .22rem;
      `
    case 'lg':
      return css`
        border-radius: 8px;
        padding: .12rem .28rem;
        font-size: .25rem;
      `
    case 'full':
      return css`
        width: 100%;
        border-radius: 10px;
        padding: .12rem .28rem;
        font-size: .25rem;
      `
    default:
      return null
  }
}
const status = ({ disabled }: IProps) =>
  disabled
    ? css`
        cursor: default;
        pointer-events: none;
        background-color: #ddd;
        opacity: 0.3;
        user-select: none;
      `
    : css`
        cursor: pointer;
      `

const styles = css`
  display: inline-block;
  box-sizing: border-box;
  font-weight: 700;
  line-height: 1.4;
  text-align: center;
  text-decoration: none;
  border: none;
  :hover {
    text-decoration: none;
  }
  ${buttonColorStyles};
  ${buttonSizeStyles};
  ${status};
  :focus {
    outline: solid 2px blue;
    outline-offset: 2px;
  }
`

const Button = ({
  type,
  className,
  id,
  children,
  href,
  onClick,
}: IProps) => {
  if (href) {
    return (
      <a
        href={href}
        id={id}
        className={className}
        onClick={onClick}
        target="_blank"
      >
        {children}
      </a>
    )
  }
  return (
    <button
      type={type}
      id={id}
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

const StyledButton = styled(Button)`
  ${styles};
`
export default StyledButton