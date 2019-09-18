import * as React from 'react';
import styled, { css }  from 'styled-components';
import StatsListItem from '../../atoms/ListItem/index';

interface IProps {
  className?: string;
  killDeath?: string;
  avgDamage?: string;
}

const styles = css`
    font-family: 'IBM Plex Mono', monospace;
    line-height: 1;
`

const StatsList = ({
  className,
  killDeath,
  avgDamage,
}: IProps) => {
  return (
    <dl className={className}>
      <StatsListItem killDeath={killDeath} />
      <StatsListItem avgDamage={avgDamage} />
    </dl>
  )
}

const StyledStatsList = styled(StatsList)`
  ${styles};
`
export default StyledStatsList