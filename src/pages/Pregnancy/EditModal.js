/**
 * 建档
 */
import React from 'react';
import moment from 'moment';
import {
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  Select,
  DatePicker,
  InputNumber,
  message,
} from 'antd';
import styles from './index.less';

const EditModal = Form.create({
  name: 'editor_form',
})(
  // eslint-disable-next-line
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
    }

    componentDidMount() {
      const { form, dataSource } = this.props;
      const { inpatientNO, name, age, telephone, gravidity, parity } = dataSource;
      form.setFieldsValue({
        inpatientNO,
        name,
        age,
        telephone,
        gravidity,
        parity,
      });
    }

    handleUpdate = () => {
      // 编辑修改
      const { form, onOk, onCancel, dataSource } = this.props;
      const { id } = dataSource;
      form.validateFields((err, values) => {
        if (!err) {
          onOk({ id, ...values });
        }
      });
      onCancel();
    };

    render() {
      const { visible, onCancel, form } = this.props;
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
          getContainer={false}
          centered
          destroyOnClose
          width={860}
          visible={visible}
          title="修改孕册"
          footer={null}
          okText="创建"
          cancelText="取消"
          bodyStyle={{ paddingRight: '48px' }}
          onCancel={onCancel}
        >
          <Form className={styles.modalForm} layout="horizontal" {...formItemLayout}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="住院号">
                  {getFieldDecorator('inpatientNO', {
                    rules: [{ required: true, message: '请填写孕妇住院号!' }],
                  })(<Input disabled placeholder="输入住院号" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="孕妇姓名">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请填写孕妇姓名!' }],
                  })(<Input placeholder="输入孕妇姓名" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="出生年月">
                  {getFieldDecorator('birth', {
                    rules: [{ required: false, message: '请填写孕妇出生日期!' }],
                  })(<DatePicker placeholder="输入孕妇出生日期..." />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="孕妇年龄">
                  {getFieldDecorator('age', {
                    rules: [{ required: false, message: '请填写孕妇年龄!' }],
                  })(<InputNumber min={1} max={99} placeholder="输入孕妇年龄..." />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="联系电话">
                  {getFieldDecorator('telephone', {
                    rules: [{ required: false, message: '请填写孕妇联系电话!' }],
                  })(<Input placeholder="请输入联系电话..." />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="孕次">
                  {getFieldDecorator('gravidity', {
                    rules: [{ required: false, message: '请输入孕次!' }],
                  })(<InputNumber min={1} max={10} placeholder="请输入孕次..." />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="产次">
                  {getFieldDecorator('parity', {
                    rules: [{ required: false, message: '请输入产次!' }],
                  })(<InputNumber min={0} max={10} placeholder="请输入产次..." />)}
                </Form.Item>
              </Col>
              <Col span={24} className={styles.buttons}>
                <Button onClick={onCancel}>取消</Button>
                <Button type="primary" onClick={this.handleUpdate}>
                  确定
                </Button>
              </Col>
              <Col span={24}>
                <Form.Item label="居住地址">
                  {getFieldDecorator('address', {
                    rules: [{ required: true, message: '请填写现居住详细地址!' }],
                  })(<Input placeholder="输入现居住详细地址" />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    }
  },
);

export default EditModal;
