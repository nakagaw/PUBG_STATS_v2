import React , { PureComponent } from 'react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
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
}

const StatsDataChart = ({
  chartData
}: IProps) => {

  // console.log(chartData);
  const statsData: any = [];
  // 左から右にするために for (let i = 0; i < Object.keys(chartData).length; i++) { ではない
  for (let i = Object.keys(chartData).length - 1; i >= 0; i--) {
    console.log(i)
    let data: any = Object.values(chartData)[i];
    let statsDataObject: any = {};
    statsDataObject.name = data.playedDate;
    statsDataObject.killDeath = data.killDeath;
    statsDataObject.avgDamage = data.avgDamage;
    statsData.push(statsDataObject);
  }
  // console.log(statsData);

  return (
    <React.Fragment>
      <Typography variant="h6" component="h2" noWrap style={{marginTop: "30px"}}>
       Kills/Deathes
      </Typography>
      <div style={{width: "100%", height: "200px"}}>
        <ResponsiveContainer>
          <LineChart data={statsData} margin={{ top: 20, right: 40, left: 0, bottom: 10 }}>
            <YAxis />
            <CartesianGrid stroke="#666" strokeDasharray="2 2" />
            <Line type="linear" dataKey="killDeath" stroke="#79ff79" fill="#79ff79" strokeWidth="2" dot={{ r: 4 }} label={<CustomizedLabel />} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Typography variant="h6" component="h2" noWrap style={{marginTop: "20px"}}>
      Average Damages
      </Typography>
      <div style={{width: "100%", height: "270px"}}>
        <ResponsiveContainer>
          <LineChart data={statsData} margin={{ top: 20, right: 40, left: 0, bottom: 50 }}>
            <XAxis dataKey="name" tick={<CustomizedAxisTick />} />
            <YAxis />
            <CartesianGrid stroke="#666" strokeDasharray="2 2" />
            <Line type="linear" dataKey="avgDamage" stroke="#ac77dc" fill="#ac77dc" strokeWidth="2" dot={{ r: 4 }} label={<CustomizedLabel />} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </React.Fragment>
  );
}

export default StatsDataChart