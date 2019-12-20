import * as React from 'react';
import styled from 'styled-components';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';


import {
  LooksOne,
  LooksTwo,
  Looks3,
  FiberManualRecord,
  Close
} from '@material-ui/icons';
import zIndex from '@material-ui/core/styles/zIndex';

const StyledTableHead = styled(TableHead)`
  background-color: #383838;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

const StyledTableRow = styled(TableRow)`
  cursor: crosshair;
  position: relative;
  ul {
    display: none;
  }
  &:hover {
    ul {
      display: block;
    }
    background-color: #2b272f;
  }
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

const FightLogList = (data: any) => {
  const listData: any = Object.values(data)[0];
  // console.log(listData);
  if (!listData) { // データないときはなし
    return null;
  }
  return (
    <ul style={{ 
        textAlign: 'left', 
        position: 'absolute', 
        backgroundColor: 'rgba(0, 0, 0, .8)', 
        boxShadow: 'rgba(163, 0, 255, 0.28) 5px 5px 0px 0px', 
        fontSize: '11px', 
        padding: '6px 10px 6px', 
        left: '80px', 
        marginTop: '-24px',
        zIndex: 9999,
      }}>
      {listData.map((item:any, x: number)  => (
      <li key={x} style={{listStyle: 'none'}}>
        {item.win ?
          (
            <span style={{color: "#20ff00"}}><FiberManualRecord style={{ verticalAlign: "middle", color: "#20ff00", width: "16px", height: "16px", marginRight: "7px"}} />{item.win}</span>
          ) : (
            <span style={{color: "rgb(255, 0, 24)"}}><Close style={{ verticalAlign: "middle", color: "rgb(255, 0, 24)", width: "16px", height: "16px", marginRight: "7px"}} />{item.lose}</span>
          )
        }
      </li>
      ))}
    </ul>
  )
}


interface IProps {
  tableData: any;
  filterGameMode?: 'all' | 'solo-fpp' | 'squad-fpp';
}

const StatsDataTable = ({
  tableData,
  filterGameMode,
}: IProps) => {

  // filter stats data
  if(!tableData){
    console.log("なんかしらテーブル作成データが破損してるゼ！！");
    return null;
  }

  const filteredData = tableData.data.filter((item: any, index: number) => {
    if ( filterGameMode === "all" ) {
      return item
    } else if ( filterGameMode === item.gameMode ) {
      return item
    }
    return null;
  })
  // console.log(filteredData)

  // KD & totalKills
  const filteredKills = filteredData.map((row: any) => {
    return row.kills;
  });
  const killDeath = (filteredKills.reduce((current: any, items: any) => current+=items, 0)/filteredData.length).toFixed(2);
  const totalKills = filteredKills.reduce((current: any, items: any) => current+=items, 0);

  // avg damages
  const filteredDamageDealt = filteredData.map((row: any) => {
    return row.damageDealt;
  });
  const avgDamage = (filteredDamageDealt.reduce((current: any, items: any) => current+=items, 0)/filteredData.length).toFixed(1);

  // fightLog
  // const fightLog = filteredData.map((row: any) => {
  //   return row.fightLog;
  // });

  const playedDate = tableData.playedDate;
  const statsData  = filteredData;

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
            <StyledTableRow key={i}>
              <StyledTableCell align="left" style={{whiteSpace: "nowrap"}}>
                {(() => {
                  if (value.kills >= 7) {
                    return <span style={{ color: "#faff00"}}>{value.kills}</span>
                  } else if (value.kills >= 5) {
                    return <span style={{ color: "#ff3c00"}}>{value.kills}</span>
                  } else if (value.kills >= 4) {
                    return <span style={{ color: "#ff00c8"}}>{value.kills}</span>
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
                    <span style={{ color:  "#8f63b7", fontStyle: "italic"}}> ({value.damageDealt})</span>
                  ) : (
                    <span style={{ color:  "#4c4c4c"}}> ({value.damageDealt})</span>
                  )
                }
                {(() => {
                  if (value.winPlace === 1) {
                    return <span style={{ marginLeft: "3px" }}><LooksOne style={{ verticalAlign: "middle", color: "#d1d426", width: "16px", height: "16px"}} /></span>
                  } else if (value.winPlace === 2) {
                    return <span style={{ marginLeft: "3px" }}><LooksTwo style={{ verticalAlign: "middle", color: "#58b194", width: "16px", height: "16px"}} /></span>
                  } else if (value.winPlace === 3) {
                    return <span style={{ marginLeft: "3px" }}><Looks3 style={{ verticalAlign: "middle", color: "#a5a5a5", width: "16px", height: "16px"}} /></span>
                  }
                })()}
              </StyledTableCell>
              <StyledTableCell align="right" style={{ color: "#808080", fontSize: "11px", whiteSpace: "nowrap"}}>
                {value.gameMode}
                <FightLogList data={value.fightLog} />
              </StyledTableCell>
            </StyledTableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default StatsDataTable