import React, { Fragment } from 'react';
import { connect } from 'dva';
import store from 'store';
import Redirect from 'umi/redirect';
import Loader from '@/components/PageLoading';

const AuthComponent = ({ children, isLogin }) => {
  return (
    <Fragment>
      {isLogin ? null : <Loader />}

      {
        // eslint-disable-next-line
        isLogin && (!!store.get('ward') || __DEV__) ? (
          children
        ) : (
            <Redirect to="/user/login" />
          )}
    </Fragment>
  );
};

export default connect(({ global }) => ({
  isLogin: global.isLogin,
}))(AuthComponent);
