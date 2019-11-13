/**
 * 胎位标记modal窗口
 *
 */
import React, { Component } from 'react';
import { Button, Modal, Form, Input } from 'antd';

export class SignModal extends Component {
  handleCreate = () => {
    const { form, onCreate, dataSource } = this.props;
    const { data: { docid, starttime }, unitId } = dataSource;
    const other = {
      unitId: unitId,
      startTime: starttime,
      note: docid,
    };
    form.validateFields((err, values) => {
      const fetalposition = JSON.stringify(values);
      onCreate({ fetalposition, ...other });
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
              rules: [{ max: 2, message: '最大长度为2' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="FHR2">
            {getFieldDecorator('fhr2', {
              rules: [{ max: 2, message: '最大长度为2' }],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="FHR3">
            {getFieldDecorator('fhr3', {
              rules: [{ max: 2, message: '最大长度为2' }],
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
