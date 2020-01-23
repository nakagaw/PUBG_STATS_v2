import React , { PureComponent } from 'react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  // Brush
} from 'recharts';

// Material UI
import {
  Typography,
} from '@material-ui/core';

interface CustomizedLabelProps {
  x: number,
  y: number,
  value?: number,
  payload?: any,
}

class CustomizedLabel extends PureComponent<Partial<CustomizedLabelProps>> {
  render() {
    const {
      x, y, value,
    } = this.props;
    return <text x={x} y={y} dy={-10} fill="#fff" fontSize={12} textAnchor="middle">{value}</text>;
  }
}

class CustomizedAxisTick extends PureComponent<Partial<CustomizedLabelProps>> {
  render() {
    const {
      x, y, payload,
    } = this.props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#666" fontSize={12} transform="rotate(-35)">{payload.value}</text>
      </g>
    );
  }
}

interface IProps {
  chartData: any;
  filterGameMode?: 'all' | 'solo-fpp' | 'squad-fpp';
}

const StatsDataChart = ({
  chartData,
  filterGameMode,
}: IProps) => {

  console.log(chartData);

  const statsData: any = [];
  let avgKD: number = 0;
  let avgDMG: number = 0;
  // 左から右にするために for (let i = 0; i < Object.keys(chartData).length; i++) { ではない
  for (let i = Object.keys(chartData).length - 1; i >= 0; i--) {
    let data: any = Object.values(chartData)[i];
    let statsDataObject: any = {}

    // ゲームモードのフィルター
    const filteredData = data.data.filter((item: any, index: number) => {
      // all だったらそのまま返す
      if ( filterGameMode === "all" ) {
        return item
      // gameMode state があれば該当するものだけ返す
      } else if ( filterGameMode === item.gameMode ) {
        return item
      }
      return null;
    })

    // KD & totalKills 計算
    const filteredKills = filteredData.map((row: any) => {
      return row.kills;
    });
    statsDataObject.killDeath = (filteredKills.reduce((current: any, items: any) => current+=items, 0)/filteredData.length).toFixed(2);
    avgKD += Number(statsDataObject.killDeath);

    // avg damages 計算
    const filteredDamageDealt = filteredData.map((row: any) => {
      return row.damageDealt;
    });
    statsDataObject.avgDamage = (filteredDamageDealt.reduce((current: any, items: any) => current+=items, 0)/filteredData.length).toFixed(1);
    avgDMG += Number(statsDataObject.avgDamage);

    statsDataObject.name = data.playedDate;
    statsData.push(statsDataObject);
  }
  const totalAvgKD = (avgKD/Object.keys(chartData).length).toFixed(2);
  const totalAvgDMG = (avgDMG/Object.keys(chartData).length).toFixed(1);
  localStorage.setItem('_pubgTotalAvgKD', totalAvgKD);
  localStorage.setItem('_pubgTotalAvgDMG', totalAvgDMG);
  // console.log(totalAvgKD );
  // console.log(totalAvgDMG );
  // console.log(statsData);

  return (
    <React.Fragment>
      <Typography variant="h6" component="h2" noWrap style={{marginTop: "30px"}}>
       Kills/Deathes : <span style={{color: "#79ff79"}}>Avg. {totalAvgKD}</span> ({filterGameMode})
      </Typography>
      <div style={{width: "100%", height: "200px"}}>
        <ResponsiveContainer>
          <LineChart data={statsData} margin={{ top: 20, right: 40, left: 0, bottom: 10 }}>
            <YAxis />
            <CartesianGrid stroke="#666" strokeDasharray="2 2" />
            <Line type="linear" dataKey="killDeath" stroke="#79ff79" fill="#79ff79" strokeWidth="2" dot={{ r: 4 }} label={<CustomizedLabel />} />
            <ReferenceLine y={totalAvgKD} stroke="yellow" strokeDasharray="3 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Typography variant="h6" component="h2" noWrap style={{marginTop: "20px"}}>
      Average Damages : <span style={{color: "#ac77dc"}}>Avg. {totalAvgDMG}</span> ({filterGameMode})
      </Typography>
      <div style={{width: "100%", height: "270px"}}>
        <ResponsiveContainer>
          <LineChart data={statsData} margin={{ top: 20, right: 40, left: 0, bottom: 50 }}>
            <XAxis dataKey="name" tick={<CustomizedAxisTick />} interval={0} />
            <YAxis />
            <CartesianGrid stroke="#666" strokeDasharray="2 2" />
            <Line type="linear" dataKey="avgDamage" stroke="#ac77dc" fill="#ac77dc" strokeWidth="2" dot={{ r: 4 }} label={<CustomizedLabel />} />
            <ReferenceLine y={totalAvgDMG} stroke="yellow" strokeDasharray="3 3" />
            {/* <Brush /> */}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </React.Fragment>
  );
}

export default StatsDataChart