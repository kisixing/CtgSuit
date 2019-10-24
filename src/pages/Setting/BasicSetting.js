import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, message } from 'antd';
import { ipcRenderer } from 'electron';

import { formItemLayout, tailFormItemLayout } from './utils';
import styles from './style.less';

@Form.create()
class BasicSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
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
      this.setState({ loading: false });
      message.info('暂无更新...')
    }, 2000);

  }

  render() {
    const { loading } = this.state;
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
          <Button loading={loading} onClick={this.checkUpdate}>
            检查更新
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default connect(({ setting, loading }) => ({
  loading: loading
}))(BasicSetting);