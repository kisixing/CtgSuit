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
        required: false,
      };
    }

    componentDidMount() {
      const {
        form,
        dataSource: { documentno, pregnancy, data },
      } = this.props;
      const isCreated = pregnancy && pregnancy.id && documentno === data.docid;
      if (isCreated) {
        form.setFieldsValue(pregnancy);
      }
    }

    // modal里面的搜索按钮事件
    handleSearch = () => {
      const { dispatch, form } = this.props;
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
    };

    render() {
      const { visible, onCancel, onCreate, form, dataSource } = this.props;
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
          centered
          destroyOnClose={false}
          width={800}
          visible={visible}
          title={`【${dataSource.index + 1}】 建档（绑定）`}
          footer={null}
          okText="创建"
          cancelText="取消"
          bodyStyle={{ paddingRight: '48px' }}
          onCancel={() => onCancel('visible')}
          onOk={onCreate}
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
                    rules: [{ required: required, message: '请填写孕妇住年龄!' }],
                  })(<InputNumber placeholder="输入孕妇年龄..." />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="联系电话">
                  {getFieldDecorator('telephone', {
                    rules: [{ required: required, message: '请填写孕妇联系电话!' }],
                  })(<Input placeholder="请输入联系电话..." />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="孕次">
                  {getFieldDecorator('gravidity', {
                    rules: [{ required: required, message: '请输入孕次!' }],
                  })(<InputNumber placeholder="请输入孕次..." />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="产次">
                  {getFieldDecorator('parity', {
                    rules: [{ required: required, message: '请输入产次!' }],
                  })(<InputNumber placeholder="请输入产次..." />)}
                </Form.Item>
              </Col>
              <Col span={24} className={styles.buttons}>
                <Button onClick={() => onCancel('visible')}>取消</Button>
                {!dataSource.documentno ? null : <Button onClick={this.handleSearch}>搜索</Button>}
                <Button type="primary" onClick={() => onCreate(dataSource)}>
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
