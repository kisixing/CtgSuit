/**
 * 胎位标记modal窗口
 *
 */
import React, { Component } from 'react';
import { Button, Modal, Form, Input, Row, Col, InputNumber, message } from 'antd';
import styles from './index.less';

export class SignModal extends Component {
  handleCreate = () => {
    const { form, onCreate } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        onCreate(values);
      }
    });
  }
  render() {
    const { visible, onCancel, form, dataSource, loading } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <Modal
        getContainer={false}
        centered
        destroyOnClose
        visible={visible}
        title={`【${dataSource.bedname}】 胎位标记`}
        footer={null}
        okText="创建"
        cancelText="取消"
        bodyStyle={{ paddingRight: '48px' }}
        onCancel={() => onCancel('signVisible')}
      >
        <Form {...formItemLayout} layout="horizontal">
          <Form.Item label="FHR1">
            {getFieldDecorator('fhr1', {
              rules: [{ required: true, message: '请输入fhr1' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="FHR2">
            {getFieldDecorator('fhr2', {
              rules: [{ required: true, message: '请输入fhr2' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="FHR3">
            {getFieldDecorator('fhr3', {
              rules: [{ required: true, message: '请输入fhr3' }],
            })(<Input />)}
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              loading={loading.effects['item/sign']}
              onClick={() => this.handleCreate(dataSource)}
            >
              确认
            </Button>
            <Button style={{ marginLeft: '24px' }} onClick={() => onCancel('signVisible')}>
              取消
            </Button>
          </div>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(SignModal)
