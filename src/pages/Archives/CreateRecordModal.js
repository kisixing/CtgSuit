/**
 * 建档
 */
import React from 'react';
import moment from 'moment';
import { Modal, Form, Input, Row, Col, DatePicker, InputNumber } from 'antd';

const CreateRecordModal = Form.create({
  name: 'create_form',
})(
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
    }

    componentDidMount() {
      const { form, type, dataSource } = this.props;
      if (type === 'detail') {
        form.setFieldsValue(dataSource);
      }
    }

    render() {
      const { visible, onCancel, onCreate, type, form } = this.props;
      const { getFieldDecorator } = form;

      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      };

      return (
        <Modal
          centered
          destroyOnClose
          width={800}
          visible={visible}
          title={type === 'create' ? '新建' : '详情'}
          okText="创建"
          cancelText="取消"
          bodyStyle={{ paddingRight: '48px' }}
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="horizontal" {...formItemLayout}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="创建时间">
                  {getFieldDecorator('visitTime', {
                    rules: [{ required: true, message: '请填写创建时间!' }],
                  })(<DatePicker />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="孕妇姓名">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请填写孕妇姓名!visitTime' }],
                  })(<Input type="text" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="检查次数">
                  {getFieldDecorator('visitType', {
                    rules: [{ required: true, message: '请填写检查次数!' }],
                  })(<InputNumber />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="孕妇年龄">
                  {getFieldDecorator('age', {
                    rules: [{ required: true, message: '请填写孕妇住年龄!' }],
                  })(<InputNumber />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="孕周">
                  {getFieldDecorator('gestationalWeek', {
                    rules: [{ required: true, message: '请填写孕妇联系电话!' }],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="联系电话">
                  {getFieldDecorator('mobile', {
                    rules: [{ required: true, message: '请填写孕妇联系电话!' }],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="门诊号">
                  {getFieldDecorator('outpatientNO', {
                    rules: [{ required: true, message: '请输入门诊号!' }],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="住院号">
                  {getFieldDecorator('inpatientNO', {
                    rules: [{ required: true, message: '请输入住院号!' }],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="床号">
                  {getFieldDecorator('bedno', {
                    rules: [{ required: true, message: '请输入床号!' }],
                  })(<Input />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    }
  },
);

export default CreateRecordModal;
