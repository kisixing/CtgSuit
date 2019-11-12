import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, message } from 'antd';
import { ipcRenderer } from 'electron';
import { request } from '@lianmed/utils';

import { formItemLayout, tailFormItemLayout } from './utils';
import styles from './style.less';

const config = require('../../../package.json');

@Form.create()
class BasicSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isNew: false,
      version: config.version,
    };
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  checkUpdate = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      request.get('/');
      this.setState({ loading: false });
      message.info('暂无更新...')
    }, 2000);
  }

  download = () => {

  }

  render() {
    const { loading, isNew } = this.state;
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
          <Button disabled={isNew} loading={loading} onClick={this.checkUpdate}>
              {isNew ? '有版本更新' : '检查更新'}
          </Button>
          {isNew ? (
            <Button onClick={this.download}>
              下载更新
            </Button>
          ) : null}
        </Form.Item>
      </Form>
    );
  }
}

export default connect(({ setting, loading }) => ({
  loading: loading
}))(BasicSetting);