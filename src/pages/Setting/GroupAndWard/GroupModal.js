import React, { Component } from 'react';
import { Form, Modal, Input, Select, Button } from 'antd';

class GroupModal extends Component {
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
          <Form.Item label="用户组名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入用户组名称!' }],
            })(<Input placeholder="请输入病区名称" />)}
          </Form.Item>
          <Form.Item label="用户组昵称">
            {getFieldDecorator('nickname', {
              rules: [{ required: true, message: '请输入用户组昵称!' }],
            })(<Input placeholder="请输入病区中文名称" />)}
          </Form.Item>
          <Form.Item label="权限">
            {getFieldDecorator('authorities', {
              rules: [{ required: false, message: '请选择用户组权限!' }],
            })(
              <Select mode="multiple" placeholder="请输入病区类型">
                {/* <Select.Option value="in">住院</Select.Option>
                <Select.Option value="out">门诊</Select.Option> */}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="说明">
            {getFieldDecorator('groupdesc', {
              rules: [{ required: false, message: '请输入用户组说明!' }],
            })(<Input.TextArea placeholder="请输入用户组说明" />)}
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

export default Form.create()(GroupModal);
