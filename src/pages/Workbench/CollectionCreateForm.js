/**
 * 建档
 */
import React from 'react';
import moment from 'moment';
import { Button, Modal, Form, Input, Row, Col, Select, DatePicker, InputNumber } from 'antd';
import styles from './index.less';

const CollectionCreateForm = Form.create({
  name: 'create_form',
})(
  // eslint-disable-next-line
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        required: true,
      };
    }

    componentDidMount() {
      const {
        form,
        dataSource: { documentno, pregnancy, data },
      } = this.props;
      const isCreated = pregnancy && data && pregnancy.id && documentno === data.docid;
      if (isCreated) {
        form.setFieldsValue(pregnancy);
      }
    }

    reset = () => {
      const { form } = this.props;
      form.resetFields();
    }

    // modal里面的搜索按钮事件
    handleSearch = () => {
      const { dispatch, form } = this.props;
      this.setState({ required: false }, () => {
        form.validateFields((err, values) => {
          if (err) {
            return;
          }
          // 获取孕册信息
          let obj = {};
          Object.keys(values).forEach(function(key) {
            const k = `${key}.contains`;
            const value = values[key];
            obj[k] = value;
          });
          dispatch({
            type: 'list/fetchPregnancy',
            payload: obj,
            callback: res => {
              form.setFieldsValue(res);
            },
          });
        });
      });
    };

    handleCreate = (dataSource) => {
      // 建档/确定action
      const { onCreate } = this.props;
      this.setState({ required: true }, () => {
        onCreate(dataSource);
      });

    };

    render() {
      const { visible, onCancel, form, dataSource } = this.props;
      const { getFieldDecorator } = form;
      const { required } = this.state;

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
          title={`【${dataSource.bedname}】 建档`}
          footer={null}
          okText="创建"
          cancelText="取消"
          bodyStyle={{ paddingRight: '48px' }}
          onCancel={() => onCancel('visible')}
        >
          <Form layout="horizontal" {...formItemLayout}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="住院号">
                  {getFieldDecorator('inpatientNO', {
                    rules: [{ required: required, message: '请填写孕妇住院号!' }],
                  })(<Input placeholder="输入住院号..." />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="孕妇姓名">
                  {getFieldDecorator('name', {
                    rules: [{ required: required, message: '请填写孕妇姓名!' }],
                  })(<Input placeholder="输入孕妇姓名..." />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="孕妇年龄">
                  {getFieldDecorator('age', {
                    rules: [{ required: false, message: '请填写孕妇住年龄!' }],
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
                <Button onClick={() => onCancel('visible')}>取消</Button>
                <Button onClick={this.reset}>重置</Button>
                {!dataSource.documentno ? null : <Button onClick={this.handleSearch}>搜索</Button>}
                <Button type="primary" onClick={() => this.handleCreate(dataSource)}>
                  确定
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal>
      );
    }
  },
);

export default CollectionCreateForm;
