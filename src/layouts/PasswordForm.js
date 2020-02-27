import React, { useState } from 'react';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, Button, message } from 'antd';
import store from 'store';
import { router } from 'umi';
import { updatePassword } from '../services/api';

function PasswordForm({
  visible,
  onCancel,
  onOk,
  account = {},
  signout,
  form: { getFieldDecorator, validateFields },
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorText, setErrorText] = useState('');

  const onEnsure = e => {
    e.preventDefault();
    setLoading(true);
    validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        onOk({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });
        updatePassword(values)
          .then(res => {
            setLoading(false);
            setSuccess(true);
            message.success('密码修改成功！');
          })
          .catch(err => {
            setLoading(false);
            if (err.status === 400) {
              setErrorText('400');
              return message.success('原密码错误,请输入正确的原密码！');
            }
            message.success('密码修改失败，请稍后再试！');
          });
      }
    });
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
    },
  };

  return (
    <Modal
      getContainer={false}
      maskClosable={false}
      closable={!success}
      centered
      destroyOnClose
      width={560}
      visible={visible}
      title="密码设置"
      footer={null}
      okText="创建"
      cancelText="取消"
      bodyStyle={{}}
      onCancel={onCancel}
    >
      {success ? (
        <div style={{ textAlign: 'center ' }}>
          <LegacyIcon
            style={{
              marginBottom: '24px',
              fontSize: '72px',
              lineHeight: '72px',
              color: '#52c41a',
            }}
            type="check-circle"
            theme="filled"
          />
          <p style={{ fontSize: '21px', fontWeight: '600' }}>修改密码成功！</p>
          <Button type="primary" onClick={signout}>
            请重新登录
          </Button>
        </div>
      ) : (
        <Form {...formItemLayout}>
          <Form.Item label="用户名">
            {getFieldDecorator('username', {
              initialValue: account.login,
              rules: [{ required: true, message: '请输入用户名!' }],
            })(<Input disabled placeholder="请输入用户名" />)}
          </Form.Item>
          <Form.Item
            label="原密码"
            // hasFeedback
            // validateStatus={errorText ? 'error' : null}
            // help={errorText ? '原密码错误，请输入正确的原密码' : ''}
          >
            {getFieldDecorator('currentPassword', {
              rules: [{ required: true, message: '请输入原密码!' }],
            })(<Input placeholder="请输入原密码" />)}
          </Form.Item>
          <Form.Item label="新密码">
            {getFieldDecorator('newPassword', {
              rules: [{ required: true, message: '请输入新的密码!' }],
            })(<Input placeholder="请输入新的密码" />)}
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Button style={{ margin: '0 8px' }} onClick={onCancel}>
              取消
            </Button>
            <Button
              loading={loading}
              style={{ margin: '0 8px' }}
              type="primary"
              onClick={onEnsure}
            >
              确定
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  );
}


export default Form.create()(PasswordForm);
