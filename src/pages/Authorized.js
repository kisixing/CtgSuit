import React, { Fragment } from 'react';
import { connect } from 'dva';
import store from 'store';
import Redirect from 'umi/redirect';
import Loader from '@/components/PageLoading';

const AuthComponent = ({ children, isLogin }) => {
  return (
    <Fragment>
      {isLogin ? null : <Loader />}
      {isLogin && !!store.get('ward') ? (
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
