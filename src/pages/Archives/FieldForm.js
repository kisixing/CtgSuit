import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Row, Col, Input, DatePicker, Button } from 'antd';

import styles from './FieldForm.less';

@Form.create()
class FieldForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {},
    };
  }

  // 检索
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.dispatch({
          type: 'archives/fetchRecords',
          payload: {

          },
        });
      }
    });
  };

  // 重置表单
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
          <Col span={5}>
            <Form.Item label="档案号">{getFieldDecorator('docid')(<Input type="text" />)}</Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="开始时间">
              {getFieldDecorator('startTime')(
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择日期"
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="结束时间">
              {getFieldDecorator('endTime')(
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择日期"
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={5}>
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