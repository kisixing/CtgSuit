/*
 * @Description: 医院设置
 * @Author: Zhong Jun
 * @Date: 2019-10-17 10:45:04
 */

import React, { PureComponent } from 'react';
import { Form, Button, Input, message } from 'antd';
import { formItemLayout, tailFormItemLayout } from './utils';
import store from '@/utils/SettingStore';
import styles from './style.less';

var config = require("../../../package.json");

@Form.create()
class Hospital extends PureComponent {
  componentDidMount() {
    const { form } = this.props;
    store.getObj().then(({ hospital_name, version_number, build_date }) => {
      form.setFieldsValue({
        hospital_name,
      });
    });
    // 设置版本信息
    form.setFieldsValue({
      version_number: config.version,
      build_date: config.author.date
    })
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        store.set(Object.keys(values), Object.values(values)).then(status => {
          if (status) {
            message.success('设置成功', 2);
          }
        });
      }
    });
  };
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="horizontal" {...formItemLayout} className={styles.form}>
        <Form.Item>
          <div className={styles.subTitle}>医院信息</div>
        </Form.Item>
        <Form.Item label="医院名称">
          {getFieldDecorator('hospital_name', {
            rules: [{ required: false, message: '请输入医院名称!' }],
          })(<Input placeholder="请输入医院名称!" />)}
        </Form.Item>
        <Form.Item label="系统信息">
          {getFieldDecorator('version_number', {
            rules: [{ required: false, message: '请输入系统信息!' }],
          })(<Input disabled placeholder="请输入系统信息!" />)}
        </Form.Item>
        <Form.Item label="版本时间">
          {getFieldDecorator('build_date', {
            rules: [{ required: false, message: '请输入版本时间!' }],
          })(<Input disabled placeholder="请输入请输入版本时间!" />)}
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

export default Hospital;