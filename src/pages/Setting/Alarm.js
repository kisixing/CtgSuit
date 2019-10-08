/*
 * @Description: 网络设置
 * @Author: Zhong Jun
 * @Date: 2019-10-06 14:51:23
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, InputNumber, Button, message, Radio } from 'antd';
import store from '@/utils/SettingStore';

import { formItemLayout, tailFormItemLayout } from './utils';
import styles from './style.less';

@Form.create()
class Network extends Component {
  componentDidMount() {
    const { form } = this.props;

    store.get(['alarm_high', 'alarm_low', 'alarm_on_window', 'alarm_on_sound']).then(([alarm_high, alarm_low, alarm_on_window, alarm_on_sound]) => {
      form.setFieldsValue({ alarm_high, alarm_low, alarm_on_window:alarm_on_window.trim(), alarm_on_sound:alarm_on_sound.trim() });
    })
    // console.log('store',store)

  }

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        store.set(Object.keys(values), Object.values(values)).then(status => {
          if (status) {
            message.success('设置成功,2s 后重启', 2).then(() => {
              // eslint-disable-next-line no-restricted-globals
              location.reload()
            })
          }
        })
      }
    });
  };
  reset() {
    store.reset(['ws_url', 'xhr_url']).then(status => {
      if (status) {
        message.success('恢复成功,2s 后重启', 2).then(() => {
          // eslint-disable-next-line no-restricted-globals
          location.reload()
        })
      }
    })
  }

  checkboxGroup = ()=>(
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
        <Form.Item>
          <div className={styles.subTitle}>报警设置</div>
        </Form.Item>
        <Form.Item label="胎心率上限">
          {getFieldDecorator('alarm_high', {
            rules: [{ required: false, message: '请输入胎心率上限!' }],
          })(<InputNumber placeholder="请输入胎心率上限!" />)}
        </Form.Item>
        <Form.Item label="胎心率下限">
          {getFieldDecorator('alarm_low', {
            rules: [{ required: false, message: '请输入胎心率下限!' }],
          })(<InputNumber placeholder="请输入胎心率下限!" />)}
        </Form.Item>
        <Form.Item label="报警高亮">
          {getFieldDecorator('alarm_on_window', {
            rules: [{ required: false, message: '请输入报警高亮!' }],
          })(<Radio.Group>
            <Radio value={"1"}>打开</Radio>
            <Radio value={"0"}>关闭</Radio>
          </Radio.Group>)}
        </Form.Item>
        <Form.Item label="报警声音">
          {getFieldDecorator('alarm_on_sound', {
            rules: [{ required: false, message: '请输入报警声音!' }],
          })(<Radio.Group>
            <Radio value={"1"}>打开</Radio>
            <Radio value={"0"}>关闭</Radio>
          </Radio.Group>)}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" onClick={this.handleSubmit}>
            保存
          </Button>
          <Button type="default" onClick={this.reset} style={{ marginLeft: 10 }}>
            恢复默认
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default connect(({ setting, loading }) => ({
  loading: loading,
}))(Network);