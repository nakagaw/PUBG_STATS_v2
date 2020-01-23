import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';

interface State {
  type: 'linear' | 'circular'; 
  state: boolean;
}

const StyledLinearProgress = withStyles({
  root: {
    height: 2,
  },
})(LinearProgress);

const Loading = ({
  type,
  state
}: State) => {
  switch (type) {
    case "linear":
      return (
        <div style={{ height: '2px' }}>
          {state && <StyledLinearProgress color="secondary" />}
        </div>
      )
    case "circular":
      return (
        <React.Fragment>
        {state &&
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0 }}>
            <CircularProgress size={120} thickness={2} />
          </div>
        }
        </React.Fragment>
      )
  }
}

export default Loading