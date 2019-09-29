import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Row, Col, Input, InputNumber, DatePicker } from 'antd';

import styles from './FieldForm.less';

const { TextArea } = Input;

@Form.create({})
class FieldForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      values: {}
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.values !== prevState.values) {
      return {
        values: nextProps.values,
      };
    }
    return null;
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { values } = this.state;
    return (
      <Form className={styles.form}>
        <Row>
          <Col span={8}>
            <Form.Item label="编号">
              {getFieldDecorator('NO.', {
                initialValue: values['NO.'],
                rules: [{ required: true, message: '请输入编号!' }],
              })(<Input />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="姓名">
              {getFieldDecorator('name', {
                initialValue: values.name,
              })(<Input type="text" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="年龄">
              {getFieldDecorator('age', {
                initialValue: values.age,
              })(<InputNumber min={10} />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="孕周">
              {getFieldDecorator('gestweek', {
                initialValue: values.gestweek,
              })(<Input type="text" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="门诊号">
              {getFieldDecorator('patientNumber', {
                initialValue: values.patientNumber,
              })(<Input type="text" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="住院号">
              {getFieldDecorator('AD', {
                initialValue: values.AD,
              })(<Input type="text" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="床号">
              {getFieldDecorator('bedNumber', {
                initialValue: values.bedNumber,
              })(<Input type="text" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="日期">
              {getFieldDecorator('date', {
                initialValue: moment(values.date),
              })(
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  // disabledDate={disabledDate}
                  // disabledTime={disabledDateTime}
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="G/P">
              {getFieldDecorator('G/P', {
                initialValue: values['G/P'],
              })(<Input type="text" />)}
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item label="备注">
              {getFieldDecorator('comment', {
                initialValue: values.comment,
              })(<TextArea style={{ width: '96%' }} rows={1} />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default connect(({ archives, loading }) => ({
  values: archives.current,
  loading: loading,
}))(FieldForm);