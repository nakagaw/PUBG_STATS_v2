import * as React from 'react';
import styled from 'styled-components';
import { keyframes } from 'styled-components'

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
  Close,
  ArrowDownward,
  ArrowUpward
} from '@material-ui/icons';

const StyledTableHead = styled(TableHead)`
  background-color: #383838;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

const showTable = keyframes`
  from {
    opacity: .2;
  }
  to {
    opacity: 1;
  }
`;

const StyledTable = styled(Table)`
  animation: ${showTable} .25s linear;
`;

const StyledTableRow = styled(TableRow)`
  cursor: crosshair;
  position: relative;
  ul {
    visibility: hidden;
    opacity: 0;
    transition-timing-function: ease-in-out;
    transition-duration: .15s;
    transition-property: transform,visibility,opacity;
  }
  &:hover {
    ul {
      visibility: visible;
      opacity: 1;
    }
    background-color: #2b272f;
  }
`;

const StyledTableCell = styled(TableCell)`
  padding: 1px 6px 1px 6px !important;
  font-size: 12px;
  white-space: nowrap;
`;
const StyledTableCellA = styled(TableCell)`
  padding: 4px 8px 4px 8px !important;
  background-color: #79ff79;
  color: black !important;
  white-space: nowrap;
`;
const StyledTableCellB = styled(TableCell)`
  padding: 4px 8px 4px 8px !important;
  background-color: #ac77dc;
  color: black !important;
  white-space: nowrap;
`;

const FightLogList = (data: any) => {
  const listData: any = Object.values(data)[0];
  const myAvgKD =  localStorage.getItem('_pubgTotalAvgKD')!;
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
        padding: '6px 12px 6px 8px', 
        left: '115px', 
        marginTop: '-24px',
        zIndex: 9999,
      }}>
      {listData.map((item:any, x: number)  => (
      <li key={x} style={{listStyle: 'none'}}>
        {item.win ?
          (
            <span>
              <FiberManualRecord style={{ verticalAlign: "bottom", color: "rgb(36, 236, 96)", width: "16px", height: "16px", marginRight: "4px"}} />
              <a href={'https://pubg.op.gg/user/' + item.win} target="_blank" rel="noopener noreferrer" style={{color: "rgb(36, 236, 96)"}}>{item.win}</a>
              {item.kd ? <span style={{ marginLeft: "5px", color: "#808080"}}>(K/D {item.kd})</span> : null}
              {myAvgKD < item.kd ? <ArrowUpward style={{ verticalAlign: "text-bottom", color: "rgb(255, 99, 113)", width: "14px", height: "14px", marginLeft: "3px"}} /> : <ArrowDownward style={{ verticalAlign: "text-bottom", color: "rgb(36, 236, 96)", width: "14px", height: "14px", marginLeft: "3px"}} /> }
            </span>
          ) : (
            <span>
              <Close style={{ verticalAlign: "bottom", color: "rgb(255, 99, 113)", width: "16px", height: "16px", marginRight: "4px"}} />
              {(() => {
                if (item.lose === "SelfKill") {
                  return "自死"
                } else if (item.lose === "BlueZone") {
                  return "安置死"
                } else {
                  return <a href={'https://pubg.op.gg/user/' + item.lose} target="_blank" rel="noopener noreferrer" style={{color: "rgb(255, 99, 113)"}}>{item.lose}</a>
                }
              })()}
              {item.kd ? <span style={{ marginLeft: "5px", color: "#808080"}}>(K/D {item.kd})</span> : null}
              {myAvgKD < item.kd ? <ArrowUpward style={{ verticalAlign: "text-bottom", color: "rgb(255, 99, 113)", width: "14px", height: "14px", marginLeft: "3px"}} /> : <ArrowDownward style={{ verticalAlign: "text-bottom", color: "rgb(36, 236, 96)", width: "14px", height: "14px", marginLeft: "3px"}} /> }
            </span>
          )
        }
      </li>
      ))}
    </ul>
  )
}


interface IProps {
  tableData: any;
  filterGameMode?: 'all' | 'solo-fpp' | 'duo-fpp' | 'squad-fpp';
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

  // killers KD rate
  const filteredKillersKD = filteredData.map((row: any) => { // kdをもってるkillerだけのリストに
    if(row.fightLog !== undefined) {
      let killer = row.fightLog.filter((item:any) => {
        if(item.lose) {
          if(item.kd) {
            return true;
          }
        }
        return false;
      });
      return killer;
    }
    return null;
  }).map((item: any) => { // さらに KD を抽出する
    if(item) {
      if(item[0]) {
        if(item[0].kd && item[0].kd !== "Infinity") {
          // console.log(item[0].kd);
          return item[0].kd;
        }
      }
    }
    return null;
  }).map(Number);
  const killersKD = (filteredKillersKD.reduce((current: any, items: any) => current+=items, 0)/filteredKillersKD.length).toFixed(2);

  // avg damages
  const filteredDamageDealt = filteredData.map((row: any) => {
    return row.damageDealt;
  });
  const avgDamage = (filteredDamageDealt.reduce((current: any, items: any) => current+=items, 0)/filteredData.length).toFixed(1);

  const playedDate = tableData.playedDate;
  const statsData  = filteredData;

  return (
    <StyledTable size="small">
      <StyledTableHead>
        <TableRow>
          <TableCell colSpan={2} align="center">{playedDate}</TableCell>
        </TableRow>
      </StyledTableHead>
      <TableBody>
        <TableRow>
          <StyledTableCellA align="center" component="th" colSpan={2}>
          <span style={{ fontSize: "10px"}}>K/D</span> {killDeath} <span style={{ fontSize: "10px"}}>vs {(() => {
            if (killersKD === "0.00") {
              return <span style={{ fontSize: "11px", fontStyle: "italic"}}>NaN</span>
            } else {
              return <span style={{ fontSize: "11px", fontStyle: "italic"}}>{killersKD}</span>
            }
          })()}</span>
          </StyledTableCellA>
        </TableRow>
        <TableRow>
          <StyledTableCellB align="center" component="th" colSpan={2}>{totalKills} <span style={{ fontSize: "10px"}}>kills</span> <span style={{ fontSize: "10px", fontStyle: "italic"}}>(AvgDmg <span style={{ fontSize: "11px" }}>{avgDamage}</span>)</span></StyledTableCellB>
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
                    return <span style={{ marginLeft: "3px" }}><LooksOne style={{ verticalAlign: "text-top", color: "#d1d426", width: "16px", height: "16px"}} /></span>
                  } else if (value.winPlace === 2) {
                    return <span style={{ marginLeft: "3px" }}><LooksTwo style={{ verticalAlign: "text-top", color: "#58b194", width: "16px", height: "16px"}} /></span>
                  } else if (value.winPlace === 3) {
                    return <span style={{ marginLeft: "3px" }}><Looks3 style={{ verticalAlign: "text-top", color: "#a5a5a5", width: "16px", height: "16px"}} /></span>
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
    </StyledTable>
  );
}

export default StatsDataTable