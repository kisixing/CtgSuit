/**
 * 胎位标记modal窗口
 *
 */
import React, { Component } from 'react';
import { Button, Modal, Form, Radio } from 'antd';
import moment from 'moment';

export class SignModal extends Component {
  componentDidMount() {
    // const { form } = this.props;
    // form.setFieldsValue({
    //   fhr1: '左上',
    //   fhr2: '左下',
    //   fhr3: '右上',
    // });
  }

  handleCreate = () => {
    const { form, onCreate, dataSource } = this.props;
    const { data: { docid, starttime }, unitId } = dataSource;
    const other = {
      unitId: unitId,
      startTime: moment(starttime),
      note: docid,
    };
    form.validateFields((err, values) => {
      const fetalposition = JSON.stringify(values);
      // console.log('8888888888888', values);
      onCreate({ fetalposition, ...other });
    });
  }

  render() {
    const { visible, onCancel, form, dataSource, loading } = this.props;
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

export default Form.create()(SignModal);

const RadioGroup = ({ value, onChange }) => {
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
