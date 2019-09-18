import * as React from 'react';
import styled from 'styled-components';

interface IProps {
  killDeath?: string;
  avgDamage?: string;
}

const Todays = styled.span`
    padding-right: .24rem;
    color: #f9d300;
`
const DT = styled.dt`
    font-size: .40rem;
    display: inline-block;
    margin-left: 20px;
`
const DD = styled.dd`
    font-size: .50rem;
    display: inline-block;
    margin-left: 10px;
`

const StatsListItem = ({
  killDeath,
  avgDamage,
}: IProps) => {
  if (killDeath) {
    return (
      <React.Fragment>
        <DT><Todays>Today's</Todays>K/D</DT>
        <DD>{killDeath}</DD>
      </React.Fragment>
    )
  }
  return (
    <React.Fragment>
      <DT>Average Damage</DT>
      <DD>{avgDamage}</DD>
    </React.Fragment>
  )
}

export default StatsListItem