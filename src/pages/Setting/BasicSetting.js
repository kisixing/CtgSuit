import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';
import { ipcRenderer } from 'electron';

import { formItemLayout, tailFormItemLayout } from './utils';
import styles from './style.less';

@Form.create()
class BasicSetting extends Component {
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form {...formItemLayout} layout="horizontal" className={styles.form}>
        <Form.Item>
          <div className={styles.subTitle}>维护设置</div>
        </Form.Item>
        <Form.Item label="开发者工具">
          <Button onClick={() => ipcRenderer.send('openDevTools')}>开发者工具</Button>
        </Form.Item>
        <Form.Item label="检查更新">
          <Button>检查更新</Button>
        </Form.Item>
      </Form>
    );
  }
}

export default connect(({ setting, loading }) => ({
  loading: loading
}))(BasicSetting);