/*
 * @Description: 医院设置
 * @Author: Zhong Jun
 * @Date: 2019-10-17 10:45:04
 */

import React, { PureComponent } from 'react';
import { Form, Button, Input, message } from 'antd';
import { formItemLayout, tailFormItemLayout } from './utils';
import store from '@/utils/SettingStore';
import { getDisplaySize } from '@/utils/utils';
import styles from './style.less';
import { connect } from 'dva';

var config = require("../../../package.json");

@Form.create()
class Hospital extends PureComponent {
  componentDidMount() {
    const { form } = this.props;
    // 获取显示器尺寸
    const { w, h } = getDisplaySize();
    store.getObj().then(({ hospital_name, areano, version_number, build_date }) => {
      form.setFieldsValue({
        hospital_name,
        areano
      });
    });
    // 设置版本信息
    form.setFieldsValue({
      version_number: config.version,
      build_date: config.author.date,
      display_size: `${w.toFixed(2)} * ${h.toFixed(2)} cm`
    })
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        store.set(Object.keys(values), Object.values(values)).then(status => {
          if (status) {
            message.success('设置成功', 2);
            this.props.dispatch({ type: 'list/getlist' })
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
        <Form.Item label="病区号">
          {getFieldDecorator('areano', {
            rules: [{ required: false, message: '请输入区号!' }],
          })(<Input placeholder="请输入区号!" />)}
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
        <Form.Item label="设备尺寸">
          {getFieldDecorator('display_size')(<Input disabled />)}
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

export default connect()(Hospital);