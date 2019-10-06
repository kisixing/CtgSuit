/*
 * @Description: 网络设置
 * @Author: Zhong Jun
 * @Date: 2019-10-06 14:51:23
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input } from 'antd';
import store from 'store';

import { formItemLayout } from './utils';
import styles from './style.less';

@Form.create()
class Network extends Component {
  componentDidMount() {
    const { form } = this.props;
    const ws_url = store.get('ws_url');
    const rest_url = store.get('rest_url');
    form.setFieldsValue({ rest_url, ws_url });
  }
  render() {
    const {
      id,
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form id={id} layout="horizontal" {...formItemLayout} className={styles.form}>
        <Form.Item>
          <div className={styles.subTitle}>网络设置</div>
        </Form.Item>
        <Form.Item label="web socket">
          {getFieldDecorator('ws_url', {
            rules: [{ required: false, message: '请输入websocket服务地址!' }],
          })(<Input addonBefore="http://" placeholder="请输入web socket服务地址!" />)}
        </Form.Item>
        <Form.Item label="web service">
          {getFieldDecorator('rest_url')(
            <Input addonBefore="http://" placeholder="请输入web service服务地址!" />,
          )}
        </Form.Item>
      </Form>
    );
  }
}

export default connect(({ setting, loading }) => ({
  loading: loading,
}))(Network);
