import React from 'react';
import { Button, Modal, Form, Radio, Input, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { Suit } from '@lianmed/lmg/lib/Ctg/Suit';
import request from '@/utils/request';

interface IProps {
    form: WrappedFormUtils

    visible: boolean
    onCancel: () => void
}

export const SignModal = (props: IProps) => {
    const { form, visible, onCancel } = props;
    const handleCreate = () => {
        form.validateFields(async (err, { currentPassword, newPassword, newPasswordAgain }) => {
            if (err) return
            if (newPassword !== newPasswordAgain) {
                return message.warning('新密码不一致')
            }
            request.post(`/account/change-password`, {
                data: {
                    currentPassword, newPassword,
                }
            })
                .then(res => {
                    message.success('密码修改成功')
                    onCancel()
                })
                .catch(err => {
                    message.warning('旧密码错误')
                })

        });
    };

    const { getFieldDecorator } = form;
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 12 },
        },
    };
    return (
        <Modal
            centered
            destroyOnClose
            visible={visible}
            title={`密码修改`}
            footer={null}
            okText="创建"
            cancelText="取消"
            onCancel={onCancel}
        >
            <Form {...formItemLayout} layout="horizontal">

                <Form.Item label="旧密码">
                    {getFieldDecorator('currentPassword', {
                        rules: [{ required: true, message: '请输入旧密码' }],
                    })(<Input.Password />)}
                </Form.Item>

                <Form.Item label="新密码">
                    {getFieldDecorator('newPassword', {
                        rules: [{ required: true, message: '请输入新密码' }],
                    })(<Input.Password />)}
                </Form.Item>

                <Form.Item label="再次输入新密码">
                    {getFieldDecorator('newPasswordAgain', {
                        rules: [{ required: true, message: '请再次输入新密码' }],
                    })(<Input.Password />)}
                </Form.Item>

                <div style={{ textAlign: 'center' }}>
                    <Button
                        type="primary"
                        onClick={handleCreate}
                    >
                        <span>确认</span>
                    </Button>
                    <Button style={{ marginLeft: '24px' }} onClick={onCancel}>
                        <span>取消</span>
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}

export default Form.create<IProps>()(SignModal);

