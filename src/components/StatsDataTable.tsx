import * as React from 'react';
import styled from 'styled-components';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';

const StyledTableHead = styled(TableHead)`
  background-color: #383838;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

const StyledTableCell = styled(TableCell)`
    padding: 1px 6px 1px 6px !important;
    font-size: 12px;
`;
const StyledTableCellA = styled(TableCell)`
    background-color: #79ff79;
    color: black !important;
`;
const StyledTableCellB = styled(TableCell)`
    background-color: #ac77dc;
    color: black !important;
`;


interface IProps {
  tableData: any;
}

const StatsDataTable = ({
  tableData
}: IProps) => {

    const playedDate = tableData.playedDate;
    const statsData = tableData.data;
    const totalKills = tableData.totalKills;
    const avgDamage  = tableData.avgDamage;
    const killDeath  = tableData.killDeath;

  return (
    <Table size="small">
      <StyledTableHead>
        <TableRow>
          <TableCell colSpan={2} align="center">{playedDate}</TableCell>
        </TableRow>
      </StyledTableHead>
      <TableBody>
        <TableRow>
          <StyledTableCellA align="center" component="th" colSpan={2}>{killDeath}</StyledTableCellA>
        </TableRow>
        <TableRow>
          <StyledTableCellB align="center" component="th" colSpan={2}>{totalKills} ({avgDamage})</StyledTableCellB>
        </TableRow>
        {statsData.map((value: any, i: number) => (
            <TableRow key={i}>
              <StyledTableCell align="left"><span style={{ color: "#79ff79", fontWeight: "bold"}}>{value.kills}</span> <span style={{ color: "#ac77dc", fontStyle: "italic"}}> - {value.damageDealt}</span></StyledTableCell>
              <StyledTableCell align="right" style={{ color: "#808080", fontSize: "11px"}}>{value.gameMode}</StyledTableCell>
            </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default StatsDataTable