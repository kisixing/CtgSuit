
import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Modal, Radio } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { Suit } from '@lianmed/lmg/lib/Ctg/Suit';
// import { request } from '@lianmed/utils';
import request from '@/utils/request';

interface IProps {
  form: WrappedFormUtils
  startTime: string
  bedname: string
  docid: string
  visible: boolean
  onCancel: () => void
  suit: Suit
}

export const SignModal = (props: IProps) => {
  const { form, startTime, bedname, docid, visible, onCancel, suit } = props;
  const handleCreate = () => {
    form.validateFields(async (err, values) => {
      setTimeout(onCancel, 600);
      await request.put(`/ctg-exams-note`, {
        data: {
          fetalposition: JSON.stringify(values),
          note: docid,
          endTime: '',
        }
      });
      const position = { ...values }; // JSON.parse(values.fetalposition);
      suit.setfetalposition(position.fhr1, position.fhr2, position.fhr3);
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
      getContainer={false}
      centered
      destroyOnClose
      visible={visible}
      title={`【${bedname}】 胎位标记`}
      footer={null}
      okText="创建"
      cancelText="取消"
      bodyStyle={{ paddingRight: '48px' }}
      onCancel={onCancel}
    >
      <Form {...formItemLayout} layout="horizontal">
        <Form.Item label="FHR1">
          {getFieldDecorator('fhr1', {
            rules: [{ max: 2, message: '最大长度为2' }],
          })(<RadioGroup />)}
        </Form.Item>
        <Form.Item label="FHR2">
          {getFieldDecorator('fhr2', {
            rules: [{ max: 2, message: '最大长度为2' }],
          })(<RadioGroup />)}
        </Form.Item>
        <Form.Item label="FHR3">
          {getFieldDecorator('fhr3', {
            rules: [{ max: 2, message: '最大长度为2' }],
          })(<RadioGroup />)}
        </Form.Item>
        {/* <div>
            <Button block type="dashed" icon="plus">
              增加
            </Button>
          </div> */}
        <div style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            onClick={handleCreate}
          >
            确认
            </Button>
          <Button style={{ marginLeft: '24px' }} onClick={onCancel}>
            取消
            </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default Form.create<any>()(SignModal);

const RadioGroup = ({ value = "", onChange = () => { } }) => {
  const itemStyle = {
    width: '76px',
    height: '40px',
    paddingLeft: '12px'
  };
  const borderStyle = '1px solid #ddd';
  return (
    <Radio.Group
      name="radiogroup"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        width: '160px',
        height: '80px',
        marginLeft: '24px',
      }}
      value={value}
      onChange={onChange}
    >
      <div style={{ ...itemStyle, borderBottom: borderStyle, borderRight: borderStyle }}>
        <Radio value={'左上'}>左上</Radio>
      </div>
      <div style={{ ...itemStyle, borderBottom: borderStyle }}>
        <Radio value={'右上'}>右上</Radio>
      </div>
      <div style={{ ...itemStyle, borderRight: borderStyle }}>
        <Radio value={'左下'}>左下</Radio>
      </div>
      <div style={{ ...itemStyle }}>
        <Radio value={'右下'}>右下</Radio>
      </div>
    </Radio.Group>
  );
}
