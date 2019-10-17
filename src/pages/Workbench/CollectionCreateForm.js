/**
 * 建档
 */
import React from 'react';
import { Button, Modal, Form, Input, Row, Col, InputNumber, message } from 'antd';
import styles from './index.less';

const width = '200px';

const CollectionCreateForm = Form.create({
  name: 'create_form',
})(
  // eslint-disable-next-line
  class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        required: true,
        errorText: '',
      };
    }

    componentDidMount() {}

    reset = () => {
      const { form } = this.props;
      form.resetFields();
    };

    // modal里面的搜索按钮事件
    handleSearch = () => {
      const { dispatch, form } = this.props;
      this.setState({ required: false }, () => {
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
                this.setState({ errorText: '没有这个孕册，请新建孕册。' });
              }
              form.setFieldsValue(res);
            },
          }).then(() => {
            this.setState({ required: true });
          });
        });
      });
    };

    handleCreate = dataSource => {
      // 建档/确定action
      const { onCreate } = this.props;
      this.setState({ required: true }, () => {
        onCreate(dataSource);
      });
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
        callback('请输入不小于0的整数')
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

    render() {
      const { visible, onCancel, form, dataSource, loading } = this.props;
      const { getFieldDecorator } = form;
      const { required, errorText } = this.state;

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
          <Form layout="horizontal" {...formItemLayout}>
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
                      { max: 10, message: '床号的最大长度为10' },
                      { validator: this.validateNoChinese },
                    ],
                  })(<Input placeholder="输入床号..." style={{ width }} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="孕妇姓名">
                  {getFieldDecorator('name', {
                    rules: [{ required: false, message: '请填写孕妇姓名!' }],
                  })(<Input placeholder="输入孕妇姓名..." style={{ width }} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="住院号">
                  {getFieldDecorator('inpatientNO', {
                    rules: [
                      { required: false, message: '请填写孕妇住院号!' },
                      { validator: this.validateNoChinese },
                    ],
                  })(<Input placeholder="输入住院号..." style={{ width }} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="孕妇年龄">
                  {getFieldDecorator('age', {
                    rules: [{ required: false, message: '请填写孕妇住年龄!' }],
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
                <Form.Item label="孕次">
                  {getFieldDecorator('gravidity', {
                    rules: [
                      { required: false, message: '请输入孕次!' },
                      { validator: this.validateMaxMin },
                    ],
                  })(
                    <InputNumber min={1} max={99} placeholder="请输入孕次..." style={{ width }} />,
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
                    <InputNumber min={0} max={99} placeholder="请输入产次..." style={{ width }} />,
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
  },
);

export default CollectionCreateForm;
