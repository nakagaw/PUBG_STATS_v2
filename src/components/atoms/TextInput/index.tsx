import * as React from 'react';
import styled, { css }  from 'styled-components';

interface IProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
  type?: string;
  id?: string;
  disabled?: boolean;
  error?: boolean;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: any;
}

const borderStyles = ({ error }: IProps) =>
  error
    ? css`
        border-color: red;
        :focus {
          border-color: red;
        }
      `
    : css`
        border-color: #bbb;
        :focus {
          border-color: blue;
        }
      `

const inputSizeStyles = ({ size }: IProps) => {
  switch (size) {
    case 'xs':
      return css`
        width: 200px;
      `
    case 'sm':
      return css`
        width: 200px;
      `
    case 'md':
      return css`
        width: 400px;
      `
    case 'lg':
      return css`
        width: 600px;
      `
    case 'full':
      return css`
        width: 100%;
      `
    default:
      return null
  }
}

const styles = css`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid transparent;
  padding: .10rem .15rem;
  border-radius: 8px;
  margin-bottom: 0;
  font-family: inherit;
  line-height: 1.6;
  -webkit-appearance: none;
  transition: border-color .1s linear 0s;

  :focus {
    outline: none;
  }

  ${borderStyles};
  ${inputSizeStyles};

  &::placeholder {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
    *::-ms-backdrop, & {
      min-height: 50px;
    }
  }
`

const TextImput = ({
  className,
  type,
  id,
  disabled,
  name,
  placeholder,
  value,
  onChange
}: IProps) => {
  if (type === 'textarea') {
    return (
      <textarea
        className={className}
        disabled={disabled}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    )
  }
  return (
    <input
      className={className}
      disabled={disabled}
      id={id}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  )
}

const StyledTextImput = styled(TextImput)`
  ${styles};
`
export default StyledTextImput