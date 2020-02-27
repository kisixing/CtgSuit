import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { InputNumber, Button, message, Radio } from 'antd';
import store from '@/utils/SettingStore';

import { formItemLayout, tailFormItemLayout } from './utils';
import styles from './style.less';

@Form.create()
class Network extends Component {
  componentDidMount() {
    this.fetchData()

  }
  fetchData = () => {
    const { form } = this.props;
    store.getObj().then(({ print_interval }) => {
      form.setFieldsValue({ print_interval });
    })

  }
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        store.set(Object.keys(values), Object.values(values)).then(status => {
          if (status) {
            message.success('设置成功', 2)
          }
        })
      }
    });
  };
  reset() {
    store.reset(['print_interval']).then(status => {
      if (status) {
        message.success('恢复成功', 2)
        this.fetchData()
      }
    })
  }

  checkboxGroup = () => (
    <Radio.Group>
      <Radio value={"1"}>打开</Radio>
      <Radio value={"0"}>关闭</Radio>
    </Radio.Group>
  )

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="horizontal" {...formItemLayout} className={styles.form}>
        <div className={styles.subTitle}>打印设置</div>
        <Form.Item label="打印时长(分)">
          {getFieldDecorator('print_interval', {
            rules: [{ required: false, message: '请输入打印时长!' }],
          })(<InputNumber placeholder="请输入打印时长!" />)}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" onClick={this.handleSubmit}>
            保存
          </Button>
          <Button
            type="default"
            onClick={this.reset.bind(this)}
            style={{ marginLeft: 10 }}
          >
            恢复默认
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Network
