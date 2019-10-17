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
  padding: 4px 8px 4px 8px !important;
  background-color: #79ff79;
  color: black !important;
`;
const StyledTableCellB = styled(TableCell)`
  padding: 4px 8px 4px 8px !important;
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
          <StyledTableCellB align="center" component="th" colSpan={2}>{totalKills} (<span style={{ fontStyle: "italic"}}>{avgDamage}</span>)</StyledTableCellB>
        </TableRow>
        {statsData.map((value: any, i: number) => (
            <TableRow key={i}>
              <StyledTableCell align="left" style={{whiteSpace: "nowrap"}}>
                {(() => {
                  if (value.kills >= 7) {
                    return <span style={{ color: "#ff000c"}}>{value.kills}</span>
                  } else if (value.kills >= 5) {
                    return <span style={{ color: "#ff00c8"}}>{value.kills}</span>
                  } else if (value.kills >= 4) {
                    return <span style={{ color: "#ff00f8"}}>{value.kills}</span>
                  } else if (value.kills >= 3) {
                    return <span style={{ color: "#d24aff"}}>{value.kills}</span>
                  } else if (value.kills >= 2) {
                    return <span style={{ color: "#ac77dc"}}>{value.kills}</span>
                  } else if (value.kills >= 1) {
                    return <span style={{ color: "#ac77dc"}}>{value.kills}</span>
                  } else {
                    return <span style={{ color: "#4c4c4c"}}>{value.kills}</span>
                  }
                })()}
                {value.damageDealt > 0 ?
                  (
                    <span style={{ color:  "#ac77dc", fontStyle: "italic"}}> - {value.damageDealt}</span>
                  ) : (
                    <span style={{ color:  "#4c4c4c"}}> - {value.damageDealt}</span>
                  )
                }
              </StyledTableCell>
              <StyledTableCell align="right" style={{ color: "#808080", fontSize: "11px", whiteSpace: "nowrap"}}>{value.gameMode}</StyledTableCell>
            </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default StatsDataTable