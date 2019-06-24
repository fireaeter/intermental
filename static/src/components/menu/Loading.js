import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import Fade from '@material-ui/core/Fade';

const styles = {
  root: {
    flexGrow: 1,
  },
};

function Loading(props) {
  const { classes } = props;
  console.log(props.loading)
  return (
    <div className={classes.root}>
        <Fade
          in={props.loading.loading}
          style={{
              transitionDelay: props.loading.loading ? '800ms' : '0ms',
          }}
          unmountOnExit
      >
        <LinearProgress color="secondary"/>
        </Fade>
    </div>
  );
}

Loading.propTypes = {
  classes: PropTypes.object.isRequired,
};



export default connect(
    state => ({
        loading: state.loadingState
    })
)(withStyles(styles)(Loading));