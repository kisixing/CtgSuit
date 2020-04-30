/**
 * 建档
 */
import React from 'react';
import moment from 'moment';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, Row, Col, DatePicker, InputNumber } from 'antd';

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
      if (type === 'update' && dataSource.pregnancy) {
        const visitTime = dataSource.visitTime;
        dataSource.visitTime = moment(visitTime);
        form.setFieldsValue({
          visitTime: dataSource.visitTime,
          visitType: dataSource.visitType,
          gestationalWeek: dataSource.gestationalWeek,
          age: dataSource.pregnancy.age,
          bedno: '',
          inpatientNO: dataSource.pregnancy.inpatientNO,
          telephone: dataSource.pregnancy.telephone,
          name: dataSource.pregnancy.name,
        });
      }
    }

    render() {
      const { visible, onCancel, onOk, type, form, dataSource } = this.props;
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
          onOk={() => onOk(dataSource)}
        >
          <Form layout="horizontal" {...formItemLayout}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="创建时间">
                  {getFieldDecorator('visitTime', {
                    rules: [{ required: true, message: '请填写创建时间!' }],
                  })(<DatePicker placeholder="选择时间..." />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="姓名">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请填写姓名!' }],
                  })(<Input placeholder="输入姓名..." />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="检查次数">
                  {getFieldDecorator('visitType', {
                    rules: [{ required: true, message: '请填写检查次数!' }],
                  })(<InputNumber placeholder="输入检查次数..." />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="年龄">
                  {getFieldDecorator('age', {
                    rules: [{ required: true, message: '请填写年龄!' }],
                  })(<InputNumber placeholder="输入年龄..." />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="孕周">
                  {getFieldDecorator('gestationalWeek', {
                    rules: [{ required: true, message: '请填写孕周!' }],
                  })(<Input placeholder="输入孕周..." />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="联系电话">
                  {getFieldDecorator('telephone', {
                    rules: [{ required: true, message: '请填写联系电话!' }],
                  })(<Input placeholder="输入联系电话..." />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="卡号">
                  {getFieldDecorator('outpatientNO', {
                    rules: [{ required: false, message: '请输入卡号!' }],
                  })(<Input placeholder="输入卡号..." />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="住院号">
                  {getFieldDecorator('inpatientNO', {
                    rules: [{ required: false, message: '请输入住院号!' }],
                  })(<Input placeholder="输入住院号..." />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="床号">
                  {getFieldDecorator('bedno', {
                    rules: [{ required: false, message: '请输入床号!' }],
                  })(<Input placeholder="输入床号..." />)}
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
