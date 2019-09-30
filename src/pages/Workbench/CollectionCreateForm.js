import React from 'react';
import { Button, Modal, Form, Input, Row, Col, Select, DatePicker, InputNumber } from 'antd';

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form, dataSource } = this.props;
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
          width={800}
          visible={visible}
          title={`【${dataSource.index + 1}】 建档（绑定）`}
          okText="创建"
          cancelText="取消"
          onCancel={onCancel}
          onOk={onCreate}
          bodyStyle={{ paddingRight: '48px' }}
        >
          <Form layout="horizontal" {...formItemLayout}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="住院号">
                  {getFieldDecorator('inpatientNO', {
                    rules: [{ required: true, message: '请填写孕妇住院号!' }],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="孕妇姓名">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请填写孕妇姓名!' }],
                  })(<Input type="text" />)}
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
                <Form.Item label="联系电话">
                  {getFieldDecorator('mobile', {
                    rules: [{ required: true, message: '请填写孕妇联系电话!' }],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="孕次">
                  {getFieldDecorator('gravidity', {
                    rules: [{ required: true, message: '请输入孕次!' }],
                  })(<InputNumber />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="产次">
                  {getFieldDecorator('parity', {
                    rules: [{ required: true, message: '请输入产次!' }],
                  })(<InputNumber />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    }
  },
);

export default CollectionCreateForm;
