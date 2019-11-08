/**
 * 建档/绑定弹窗
 */
import React from 'react';
import { Button, Modal, Form, Input, Row, Col, InputNumber } from 'antd';
import styles from './index.less';

const width = '200px';

class CollectionCreateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      errorText: '',
    };
  }

  reset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  // modal里面的搜索按钮事件、调入
  handleSearch = () => {
    const _this = this;
    const { dispatch, form } = _this.props;
    _this.setState({ errorText: '' });
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      // 获取孕册信息,只做床号检索
      dispatch({
        type: 'list/fetchPregnancy',
        payload: {
          'recordstate.equals': '10', // 住院中
          'areaNO.equals': '01', // 默认病区
          'bedNO.equals': values.bedNO, // 床号
        },
        callback: res => {
          if (!res.length) {
            _this.setState({ errorText: '没有这个孕册，请新建孕册。' });
          }
          form.setFieldsValue(res[0]);
        },
      }).then(() => {
        _this.setState({ required: true });
      });
    });
  };

  handleCreate = dataSource => {
    // 建档/确定action
    const { onCreate } = this.props;
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      onCreate(dataSource, values);
    })
  };

  // 不能输入非汉字效验  效验不能输入非空字符串
  validateNoChinese = (rule, value, callback) => {
    const reg = /^[^\u4e00-\u9fa5]+$/g;
    const regEmpty = /^\s*$/g;
    if (value && !reg.test(value)) {
      callback('书写格式错误，床号不能为中文');
    } else if (value && regEmpty.test(value)) {
      callback('床号不能为空');
    } else {
      callback();
    }
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

  // 孕次 产次合理性检验
  validateMaxMin = (rule, value, callback) => {
    const reg = /^99$|^(\d|[1-9]\d)$/;
    const { field } = rule;
    const { form } = this.props;
    if (value && !reg.test(value)) {
      callback('请输入不小于0的整数');
    }
    if (field === 'gravidity') {
      // 孕次
      const target = form.getFieldValue('parity');
      if (value < target && target) {
        callback('孕次小于产次，请检查数据合理性');
      }
    }
    if (field === 'parity') {
      // 产次
      const target = form.getFieldValue('gravidity');
      if (value > target && target) {
        callback('产次大于孕次，请检查数据合理性');
      }
    }
    callback();
  };

  // 年龄校验
  validateAge = (rule, value, callback) => {
    // 大于0 小于100
    // const reg = /^99$|^(\d|[1-9]\d)$/;
    if (value > 60) {
      callback('该孕妇年龄高于60！');
    }
    if (value < 13) {
      callback('该孕妇年龄低于13！');
    }
    callback();
  };

  // 前后空格消除
  trim = event => event.target.value.trim();

  // 所有空格消除
  replace = event => event.target.value.replace(/\s+/g, '');

  render() {
    const { visible, onCancel, form, dataSource, loading } = this.props;
    const { getFieldDecorator } = form;
    const { disabled, errorText } = this.state;

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
        width={760}
        visible={visible}
        title={`【${dataSource.bedname}】 建档`}
        footer={null}
        okText="创建"
        cancelText="取消"
        bodyStyle={{ paddingRight: '48px' }}
        onCancel={() => onCancel('visible')}
      >
        <Form id="Modal_Message_Container" layout="horizontal" {...formItemLayout}>
          <Row gutter={24}>
            <Col span={0}>
              <Form.Item label="">
                {getFieldDecorator('id', {
                  rules: [{ required: false }],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="床号">
                {getFieldDecorator('bedNO', {
                  rules: [
                    { required: true, message: '请填写孕妇床号!' },
                    { max: 6, message: '床号的最大长度为6' },
                    { validator: this.validateNoChinese },
                  ],
                  getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                })(
                  <Input
                    autoFocus
                    disabled={disabled}
                    placeholder="输入床号..."
                    style={{ width }}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span className="required">姓名</span>}>
                {getFieldDecorator('name', {
                  rules: [
                    { required: false, message: '请填写孕妇姓名!' },
                    { max: 12, message: '姓名的最大长度为12' },
                  ],
                  getValueFromEvent: event => event.target.value.trim(),
                })(<Input disabled={disabled} placeholder="输入孕妇姓名..." style={{ width }} />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<span className="required">住院号</span>}>
                {getFieldDecorator('inpatientNO', {
                  rules: [
                    { required: false, message: '请填写孕妇住院号!' },
                    { max: 10, message: '住院号的最大长度为12' },
                    { validator: this.validateNoChinese },
                  ],
                  getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                })(<Input disabled={disabled} placeholder="输入住院号..." style={{ width }} />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="孕妇年龄">
                {getFieldDecorator('age', {
                  rules: [
                    { required: false, message: '请填写孕妇住年龄!' },
                    { validator: this.validateAge },
                  ],
                })(
                  <InputNumber
                    min={1}
                    max={99}
                    disabled={disabled}
                    placeholder="输入孕妇年龄..."
                    style={{ width }}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="孕次">
                {getFieldDecorator('gravidity', {
                  rules: [
                    { required: false, message: '请输入孕次!' },
                    { validator: this.validateMaxMin },
                  ],
                })(
                  <InputNumber
                    min={1}
                    max={99}
                    disabled={disabled}
                    placeholder="请输入孕次..."
                    style={{ width }}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="产次">
                {getFieldDecorator('parity', {
                  rules: [
                    { required: false, message: '请输入产次!' },
                    { validator: this.validateMaxMin },
                  ],
                })(
                  <InputNumber
                    min={0}
                    max={99}
                    disabled={disabled}
                    placeholder="请输入产次..."
                    style={{ width }}
                  />,
                )}
              </Form.Item>
            </Col>
            {/* <Col span={12}>
              <Form.Item label="联系电话">
                {getFieldDecorator('telephone', {
                  rules: [
                    { required: false, message: '请填写孕妇联系电话!' },
                    { validator: this.validateTel },
                  ],
                })(<Input placeholder="请输入联系电话..." />)}
              </Form.Item>
            </Col> */}
          </Row>
          <Row>
            <Col span={24} className={styles.buttons}>
              {/* <Button onClick={this.reset}>重置</Button> */}
              <Button onClick={() => onCancel('visible')}>取消</Button>
              {/* 建档后，不支持再次修改信息 */}
              <Button
                type="primary"
                loading={loading.effects['list/fetchPregnancy']}
                onClick={this.handleSearch}
              >
                调入
              </Button>
              <Button
                type="primary"
                loading={loading.effects['archives/create']}
                onClick={() => this.handleCreate(dataSource)}
              >
                确认
              </Button>
            </Col>
            <Col span={24} className={styles.tips}>
              <span className={styles.error}>{errorText}</span>
              提示：调入孕产妇信息时，输入床号即可。
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(CollectionCreateForm);
