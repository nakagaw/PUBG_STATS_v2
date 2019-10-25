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
        <React.Fragment>
          {state && <StyledLinearProgress color="secondary" />}
        </React.Fragment>
      )
    case "circular":
      return (
        <React.Fragment>
          {state && <CircularProgress size={120} thickness={1} />}
        </React.Fragment>
      )
  }
}

export default Loading