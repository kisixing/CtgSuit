/**
 * 建档
 */
import React from 'react';
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

const width = '200px';

const EditModal = Form.create({
  name: 'editor_form',
})(
  // eslint-disable-next-line
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        required: false,
        searchValues: {},
      };
    }

    componentDidMount() {
      const { form, dataSource } = this.props;
      if (dataSource) {
        const {
          inpatientNO,
          name,
          age,
          telephone,
          gravidity,
          parity,
          recordstate,
          bedNO,
        } = dataSource;
        form.setFieldsValue({
          inpatientNO,
          name,
          age,
          telephone,
          gravidity,
          parity,
          bedNO,
          recordstate,
        });
        this.setState({ required: true });
      }
    }

    handleSearch = () => {
      const { form, dispatch } = this.props;
      form.validateFields((err, values) => {
        if (!err) {
          const { inpatientNO, name } = values;
          dispatch({
            type: 'pregnancy/fetchPregnancies',
            payload: {
              'inpatientNO.equals': inpatientNO,
              'name.equals': name,
            },
            callback: res => {
              const data = res[0];
              if (data && data.id) {
                form.setFieldsValue({ ...data });
                this.setState({ searchValues: data });
              }
            },
          });
        }
      });
    };

    handleOk = () => {
      const { searchValues } = this.state;
      const { form, onCreate, onCancel, onUpdate, dataSource } = this.props;
      form.validateFields((err, values) => {
        if (!err) {
          if (dataSource) {
            onUpdate({ id: dataSource.id, ...values });
            onCancel();
          } else {
            // ADT
            if (searchValues.id) {
              // 修改
              onUpdate({ id: searchValues.id, ...values });
            } else {
              // 新建
              const { inpatientNO, name, bedNO } = values;
              if (!inpatientNO) {
                return message.error('请输入住院号！');
              }
              if (!name) {
                return message.error('请输入姓名！');
              }
              if (!bedNO) {
                return message.error('请输入床号！');
              }
              onCreate(values);
              onCancel();
            }
          }
        }
      });
    };

    handleUpdate = () => {
      // 编辑修改
      const { form, onOk, onCancel, dataSource } = this.props;
      const { id } = dataSource;
      form.validateFields((err, values) => {
        if (!err) {
          onOk({ id, ...values });
          onCancel();
        }
      });
    };

    // 手机号码验证
    validateTel = (rule, value, callback) => {
      const reg = /^1[3456789]\d{9}$/;
      if (value && value.length !== 11) {
        callback('手机号码位数不正确');
      } else if (value && !reg.test(value)) {
        callback('手机号码不合法');
      } else {
        callback();
      }
    };

    render() {
      const { required } = this.state;
      const { visible, onCancel, form, dataSource } = this.props;
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
          width={800}
          visible={visible}
          title={dataSource ? '修改孕册' : 'ADT(建档/修改)'}
          footer={null}
          okText="创建"
          cancelText="取消"
          bodyStyle={{ paddingRight: '48px' }}
          onCancel={onCancel}
        >
          <Form className={styles.modalForm} layout="horizontal" {...formItemLayout}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={required ? <span>住院号</span> : <span className="required">住院号</span>}
                >
                  {getFieldDecorator('inpatientNO', {
                    rules: [
                      { required: required, message: '请填写孕妇住院号!' },
                      { max: 10, message: '住院号的最大长度为10' },
                    ],
                    getValueFromEvent: event => event.target.value.trim(),
                  })(<Input placeholder="输入住院号" style={{ width }} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    required ? <span>孕妇姓名</span> : <span className="required">孕妇姓名</span>
                  }
                >
                  {getFieldDecorator('name', {
                    rules: [
                      { required: required, message: '请填写孕妇姓名!' },
                      { max: 12, message: '姓名的最大长度为12' },
                    ],
                    getValueFromEvent: event => event.target.value.trim(),
                  })(<Input placeholder="输入孕妇姓名" style={{ width }} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={required ? <span>床号</span> : <span className="required">床号</span>}
                >
                  {getFieldDecorator('bedNO', {
                    rules: [
                      { required: required, message: '请填写孕妇床号!' },
                      { max: 6, message: '姓名的最大长度为6' },
                    ],
                    getValueFromEvent: event => event.target.value.trim(),
                  })(<Input placeholder="请输入床号..." style={{ width }} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="出生年月">
                  {getFieldDecorator('birth', {
                    rules: [{ required: false, message: '请填写孕妇出生日期!' }],
                  })(<DatePicker placeholder="输入孕妇出生日期..." style={{ width }} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="孕妇年龄">
                  {getFieldDecorator('age', {
                    rules: [{ required: false, message: '请填写孕妇年龄!' }],
                  })(
                    <InputNumber
                      min={1}
                      max={99}
                      placeholder="输入孕妇年龄..."
                      style={{ width }}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="住院状态">
                  {getFieldDecorator('recordstate', {
                    initialValue: '10',
                    rules: [{ required: false, message: '请选择住院状态!' }],
                  })(
                    <Select allowClear style={{ width }}>
                      <Select.Option value="10">住院中</Select.Option>
                      <Select.Option value="11">已出院</Select.Option>
                    </Select>,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="孕次">
                  {getFieldDecorator('gravidity', {
                    rules: [{ required: false, message: '请输入孕次!' }],
                  })(
                    <InputNumber min={1} max={10} placeholder="请输入孕次..." style={{ width }} />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="产次">
                  {getFieldDecorator('parity', {
                    rules: [{ required: false, message: '请输入产次!' }],
                  })(
                    <InputNumber min={0} max={10} placeholder="请输入产次..." style={{ width }} />,
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="联系电话">
                  {getFieldDecorator('telephone', {
                    rules: [
                      { required: false, message: '请填写孕妇联系电话!' },
                      { validator: this.validateTel },
                    ],
                    getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                  })(<Input placeholder="请输入联系电话..." style={{ width }} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="居住地址">
                  {getFieldDecorator('address', {
                    rules: [{ required: false, message: '请填写现居住详细地址!' }],
                    getValueFromEvent: event => event.target.value.trim(),
                  })(<Input placeholder="输入现居住详细地址" style={{ width }} />)}
                </Form.Item>
              </Col>
              <Col span={24} className={styles.buttons}>
                <Button onClick={onCancel}>取消</Button>
                {dataSource ? null : <Button onClick={this.handleSearch}>搜索</Button>}
                <Button type="primary" onClick={this.handleOk}>
                  确定
                </Button>
              </Col>
            </Row>
            {dataSource ? null : <div className={styles.tips}>只支持“住院号”、“姓名”搜索</div>}
          </Form>
        </Modal>
      );
    }
  },
);

export default EditModal;
