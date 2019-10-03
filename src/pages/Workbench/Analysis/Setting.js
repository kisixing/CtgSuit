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
        <div className={styles.buttons}>
          <Button.Group>
            <Button>刷新CTG图</Button>
            <Button>取消定制</Button>
          </Button.Group>
          <input type="button" value={`心悸：${168};  压力：${18}`} />
        </div>

        <Row className={styles.lists}>
          <Col span={12}>
            黄色面积：<span></span>
          </Col>
          <Col span={12}>
            减速时间：<span></span>
          </Col>
          <Col span={12}>
            红色面积：<span></span>
          </Col>
          <Col span={12}>
            减速幅度：<span></span>
          </Col>
          <Col span={12}>
            绿色面积：<span></span>
          </Col>
          <Col span={12}>
            面积比值（黄:红）<span></span>
          </Col>
        </Row>
        <div className={styles.form}>
          <div>
            <Radio.Group onChange={this.onChange}>
              <Radio value={1}>原来结果</Radio>
              <Radio value={2}>新的分析</Radio>
            </Radio.Group>
            <Divider type="vertical" />
            <Radio.Group onChange={this.onChange}>
              <Radio value={3}>更新结果</Radio>
              <Radio value={4}>不更新结果</Radio>
            </Radio.Group>
          </div>
          <Form>
            <fieldset>
              <legend>类型</legend>
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
            </fieldset>
            <fieldset>
              <legend>波型</legend>
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
            </fieldset>
          </Form>
        </div>
      </div>
    );
  }
}

export default Setting;