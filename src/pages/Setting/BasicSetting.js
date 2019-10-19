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
          <div className={styles.subTitle}>基本设置</div>
        </Form.Item>
        <Form.Item label="Open Developer Tool">
          <Button onClick={() => ipcRenderer.send('openDevTools')}>开发者工具</Button>
        </Form.Item>
        <Form.Item label="Title">
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'Please input the title of collection!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Description">
          {getFieldDecorator('description')(<Input type="textarea" />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" onClick={this.handleSubmit}>
            保存
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default connect(({ setting, loading }) => ({
  loading: loading
}))(BasicSetting);