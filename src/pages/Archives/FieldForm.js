import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Row, Col, Input, InputNumber, DatePicker, Button } from 'antd';

import styles from './FieldForm.less';

const { TextArea } = Input;

@Form.create()
class FieldForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {},
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline" className={styles.form} onSubmit={this.handleSubmit}>
        <p>搜索条件</p>
        <Row>
          <Col span={4}>
            <Form.Item label="姓名">{getFieldDecorator('name')(<Input type="text" />)}</Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="门诊号">
              {getFieldDecorator('patientNumber')(<Input type="text" />)}
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="住院号">{getFieldDecorator('AD')(<Input type="text" />)}</Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="床号">
              {getFieldDecorator('bedNumber')(<Input type="text" />)}
            </Form.Item>
          </Col>
          <Col span={4}>
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
          <Col span={4}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
              <Button onClick={this.handleReset}>重置</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default connect(({ loading }) => ({
  loading: loading,
}))(FieldForm);

// mapPropsToFields ({ values }) {
//   return values && values['NO']
//     ? {
//         NO: Form.createFormField({
//           value: values.NO,
//         }),
//         name: Form.createFormField({
//           value: values.name,
//         }),
//         age: Form.createFormField({
//           value: values.age,
//         }),
//         gestweek: Form.createFormField({
//           value: values.gestweek,
//         }),
//         patientNumber: Form.createFormField({
//           value: values.patientNumber,
//         }),
//         AD: Form.createFormField({
//           value: values.AD,
//         }),
//         bedNumber: Form.createFormField({
//           value: values.bedNumber,
//         }),
//         date: Form.createFormField({
//           value: moment(values.date),
//         }),
//         GP: Form.createFormField({
//           value: values.GP,
//         }),
//         comment: Form.createFormField({
//           value: values.comment,
//         }),
//       }
//     : {};
// }