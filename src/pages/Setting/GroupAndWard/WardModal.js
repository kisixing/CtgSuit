import React, { Component } from 'react';
import { Form, Modal, Input, Select, Button } from 'antd';

class WardModal extends Component {
  render() {
    const { title, visible, onCancel, onOk, form, loading } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
    };
    return (
      <Modal
        centered
        destroyOnClose
        title={title}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        footer={null}
        maskClosable={false}
      >
        <Form {...formItemLayout}>
          <Form.Item label="病区编号">
            {getFieldDecorator('wardId', {
              rules: [{ required: true, message: '请输入病区编号!' }],
            })(<Input placeholder="请输入病区编号" />)}
          </Form.Item>
          <Form.Item label="病区名称">
            {getFieldDecorator('wardName', {
              rules: [{ required: true, message: '请输入病区名称!' }],
            })(<Input placeholder="请输入病区名称" />)}
          </Form.Item>
          <Form.Item label="病区中文名称">
            {getFieldDecorator('wardNamezh', {
              rules: [{ required: true, message: '请输入病区中文名称!' }],
            })(<Input placeholder="请输入病区中文名称" />)}
          </Form.Item>
          <Form.Item label="病区类型">
            {getFieldDecorator('wardType', {
              rules: [{ required: true, message: '请输入病区类型!' }],
            })(
              <Select placeholder="请输入病区类型">
                <Select.Option value="in">住院</Select.Option>
                <Select.Option value="out">门诊</Select.Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="订阅列表">
            {getFieldDecorator('note', {
              rules: [{ required: false, message: '请选择订阅列表!' }],
            })(
              <Select mode="multiple" placeholder="请选择订阅列表" disabled>
                {/* <Select.Option value="in">住院</Select.Option>
                <Select.Option value="out">门诊</Select.Option> */}
              </Select>,
            )}
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Button style={{ marginRight: '12px' }} onClick={onCancel}>
              取消
            </Button>
            <Button type="primary" loading={loading} onClick={onOk}>
              确定
            </Button>
          </div>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(WardModal);