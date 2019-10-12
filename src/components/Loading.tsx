import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
// import CircularProgress from '@material-ui/core/CircularProgress';

interface State {
  state: boolean;
}

const StyledLinearProgress = withStyles({
  root: {
    height: 2,
  },
})(LinearProgress);

const Loading = ({
  state
}: State) => {
  
  // const [completed, setCompleted] = React.useState(0);
  // React.useEffect(() => {
  //   function progress() {
  //     // reset when reaching 100%
  //     setCompleted(oldCompleted => (oldCompleted >= 100 ? 0 : oldCompleted + 1));
  //   }

  //   const timer = setInterval(progress, 20);
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  return (
    <div style={{ height: '2px' }}>
      {state && <StyledLinearProgress color="secondary" />}
      {/* {state && <CircularProgress size={24} thickness={4} variant="determinate" value={completed} />} */}
    </div>
  );
}

export default Loading