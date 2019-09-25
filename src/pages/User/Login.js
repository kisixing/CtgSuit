/**
 * 登录界面
 * Created by ADMIN on 2019/7/18
 */

import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Form, Input, Icon, Alert } from 'antd';
import config from '@/utils/config';
import styles from './Login.less';

const FormItem = Form.Item;

@connect(({ loading, login }) => ({
  loading,
  error: login.error,
}))
@Form.create()
class Login extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { validateFields } = form;
    validateFields((errors, values) => {
      if (errors) {
        return;
      }
      dispatch({ type: 'login/login', payload: values });
    });
  };

  render() {
    const { loading, error, form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <>
        <div className={styles.container}>
          <div className={styles.logo}>
            <img alt="logo" src={config.logoPath} />
            <h1>{config.siteName}</h1>
          </div>
          <Form onSubmit={this.handleSubmit}>
            <FormItem hasFeedback>
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: '请输入用户名！',
                  },
                ],
              })(
                <Input
                  placeholder="用户名"
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  onPressEnter={this.handleSubmit}
                />,
              )}
            </FormItem>
            <FormItem hasFeedback>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '请输入用户密码！',
                  },
                ],
              })(
                <Input
                  type="password"
                  placeholder="密码"
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  onPressEnter={this.handleSubmit}
                />,
              )}
            </FormItem>
            <Row>
              <Button type="primary" htmlType="submit" loading={loading.effects['login/login']}>
                登陆
              </Button>
              <p>
                <span>username：admin</span>
                <span>password：123456</span>
              </p>
            </Row>
            {error.status ? <Alert message={error.desc} type="error" closable /> : null}
          </Form>
        </div>
        {/* footer */}
        <div className={styles.footer}>
          <Fragment>
            Copyright <Icon type="copyright" /> {config.copyright}
          </Fragment>
        </div>
      </>
    );
  }
}

export default Login;
