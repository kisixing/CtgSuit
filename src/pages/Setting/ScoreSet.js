/*
 * @Description: 评分设置
 * @Author: Zhong Jun
 * @Date: 2019-10-06 14:51:23
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button } from 'antd';

import { formItemLayout, tailFormItemLayout } from './utils';
import styles from './style.less';

@Form.create()
class ScoreSet extends Component {
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
      <Form layout="horizontal" {...formItemLayout} className={styles.form}>
        <Form.Item>
          <div className={styles.subTitle}>评分设置</div>
        </Form.Item>
        <Form.Item label="评分">
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'Please input the title of collection!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="标准">
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
  loading: loading,
}))(ScoreSet);
