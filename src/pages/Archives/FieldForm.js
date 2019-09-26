import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Row, Col, Input, InputNumber, DatePicker } from 'antd';

import styles from './FieldForm.less';

const { TextArea } = Input;

@Form.create({
  mapPropsToFields ({ values }) {
    return values && values['NO']
      ? {
          NO: Form.createFormField({
            value: values.NO,
          }),
          name: Form.createFormField({
            value: values.name,
          }),
          age: Form.createFormField({
            value: values.age,
          }),
          gestweek: Form.createFormField({
            value: values.gestweek,
          }),
          patientNumber: Form.createFormField({
            value: values.patientNumber,
          }),
          AD: Form.createFormField({
            value: values.AD,
          }),
          bedNumber: Form.createFormField({
            value: values.bedNumber,
          }),
          date: Form.createFormField({
            value: moment(values.date),
          }),
          GP: Form.createFormField({
            value: values.GP,
          }),
          comment: Form.createFormField({
            value: values.comment,
          }),
        }
      : {};
  }
})
class FieldForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      values: {}
    }
  }

  render() {
    const {
      current,
      form: { getFieldDecorator },
    } = this.props;
    console.log('current  item', current);
    return (
      <Form className={styles.form}>
        <Row>
          <Col span={8}>
            <Form.Item label="编号">
              {getFieldDecorator('NO', {
                rules: [{ required: false, message: '请输入编号!' }],
              })(<Input disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="姓名">{getFieldDecorator('name')(<Input type="text" />)}</Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="年龄">{getFieldDecorator('age')(<InputNumber min={10} />)}</Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="孕周">
              {getFieldDecorator('gestweek')(<Input type="text" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="门诊号">
              {getFieldDecorator('patientNumber')(<Input type="text" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="住院号">{getFieldDecorator('AD')(<Input type="text" />)}</Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="床号">
              {getFieldDecorator('bedNumber')(<Input type="text" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="日期">
              {getFieldDecorator('date')(
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择日期"
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="G/P">{getFieldDecorator('G/P')(<Input type="text" />)}</Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item label="备注">
              {getFieldDecorator('comment')(<TextArea style={{ width: '96%' }} rows={1} />)}
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