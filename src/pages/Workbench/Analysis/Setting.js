import React, { Component } from 'react';
import { Form, Button, Row, Col, Radio, Divider } from 'antd';
import styles from './Setting.less';

@Form.create()
class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.wrapper}>
  

 
        <div className={styles.form}>
          <div>
              &nbsp;
          </div>
          <Form>
            <Form.Item label="NST">
              {getFieldDecorator('variation', {
                rules: [{ required: true, message: 'Please input your phone number!' }],
              })(
                <Radio.Group>
                  <Radio value={1}>有反应</Radio>
                  <Radio value={2}>无反应</Radio>
                  <Radio value={3}>正弦型</Radio>
                  <Radio value={4}>不满意</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="CST/OCT">
              {getFieldDecorator('variation', {
                rules: [{ required: true, message: 'Please input your phone number!' }],
              })(
                <Radio.Group>
                  <Radio value={1}>阴性</Radio>
                  <Radio value={2}>阳性</Radio>
                  <Radio value={3}>可以</Radio>
                  <Radio value={4}>不满意</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
            <Form.Item label="短变异（毫秒）">
              {getFieldDecorator('variation', {
                rules: [{ required: true, message: 'Please input your phone number!' }],
              })(
                <Radio.Group>
                  <Radio value={1}>平滑</Radio>
                  <Radio value={2}>小波浪</Radio>
                  <Radio value={3}>中波浪</Radio>
                  <Radio value={4}>大波浪</Radio>
                  <Radio value={5}>正弦型</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default Setting;