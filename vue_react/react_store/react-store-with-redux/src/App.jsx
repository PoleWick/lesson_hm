import React from 'react';
import { connect } from 'react-redux';
import { add, minus } from './store/count';

const App = (props) => {
  const { count } = props;
  return (
    <div>
      <button onClick={() => props.add(1)}>增加</button>
      <button onClick={() => props.minus(1)}>减少</button>
      计数：{count}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    count: state.counter.count,
  };
};

const mapActionToProps = (dispatch) => {
  return {
    add: (payload) => {
      dispatch(add(payload));
    },
    minus: (payload) => {
      dispatch(minus(payload));
    }
  };
};

export default connect(
  mapStateToProps,
  mapActionToProps
)(App);