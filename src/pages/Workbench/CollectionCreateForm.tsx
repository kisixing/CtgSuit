/**
 * 胎监主页PDA建档/绑定弹窗
 */
import React, { useState } from 'react';
import { Button, Modal, Form, Input, Row, Col, InputNumber, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import moment from 'moment';
import { request } from '@lianmed/utils';
import { stringify } from 'qs';

const width = '200px';
interface IProps {
  form: WrappedFormUtils
  starttime: string
  docid: string
  isTodo: boolean
  bedname: string
  visible: boolean
  onCancel: () => void
  onCreated: any
}
const CollectionCreateForm = (props: IProps) => {

  const { starttime, docid, isTodo, bedname, visible, onCancel, form, onCreated } = props

  const { getFieldDecorator } = form;

  const [disabled, setDisabled] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [loading, setLoading] = useState(false)

  const reset = () => {
    // 清空form表单数据、输入框状态变为可输入状态
    props.form.resetFields();
    setDisabled(false)
  };

  const onCreate = async (values) => {
    // 新建孕册 后台会自动检验孕册是否已经存在
    // ture -> 提示孕册已经存在
    const pregnancyId = values.id;

    if (!docid) {
      return message.warn('离线状态，无法建档！');
    }
    const d = {
      visitType: values.visitTime,
      visitTime: moment(values.values).format(),
      gestationalWeek: values.gestationalWeek,
      pregnancy: {
        id: '',
      },
      ctgexam: {
        startTime: moment(starttime),
        endTime: null,
        result: isTodo ? '1' : null,
        note: docid, // docid
        diagnosis: null,
        report: null,
      },
    };
    if (pregnancyId) {
      // 调入孕册信息后获取的 有孕册pregnancyId
      const data = { ...d, pregnancy: { id: pregnancyId } };
      newArchive(data);
    } else {
      // 无孕册pregnancyId 新建孕册获并获取到pregnancyId
      // 新建孕册
      const res = await request.post('/pregnancies', { data: { ...values, areaNO: '01', recordstate: '10' } }).catch(({ data }) => {
        data.then(({ title }) => {
          message.info(title);
        })
      })
      if (res && res.id) {
        // message.success('孕册创建成功！');
        if (res && res.id) {
          // 新建孕册成功
          const data = { ...d, pregnancy: { id: res.id } };
          // 新建（绑定）档案
          newArchive(data);
        } else {
          // 孕册存在，取到孕册信息
          message.info('该患者信息已存在！');
        }
      }

    }
  };

  const newArchive = async (params) => {
    const res = await request.post(`/prenatal-visits`, {
      data: params,
    }).catch(({ data }) => data.then(e => { message.error(e.title); }))
    if (res && res.id) {
      setLoading(true)
      setTimeout(() => {
        message.success('建档成功！')
        onCreated(res)
        setLoading(false)
        onCancel();
      }, 3000);
    } else {
      message.error('建档异常，请稍后再试！', 3);
    }
  };

  // modal里面的搜索按钮事件、调入
  const handleSearch = () => {
    setErrorText('')
    form.validateFields(async (err, values) => {
      if (err) {
        return;
      }
      const res = await request.get(`/pregnanciespage?${stringify({
        // TODO
        // 默认病区 、默认住院状态
        'recordstate.equals': '10', // 住院中
        'areaNO.equals': '01', // 默认病区
        'bedNO.equals': values.bedNO, // 床号
      })}`)
      // 成功调入孕妇信息后，禁止修改。
      // 重新选择调入、新建孕妇信息 --> '取消'后再重复操作
      if (!res.length) {
        setErrorText('没有这个孕册，请新建孕册。')
      } else {
        setDisabled(true)
        form.setFieldsValue(res[0]);
      }
    });
  };

  const handleCreate = () => {
    form.validateFields((err, values) => {
      if (err) {
        return 0
      } else {
        if (!values.bedNO) {
          return message.error('请输入患者床号！');
        }
        if (!values.name) {
          return message.error('请输入患者姓名！');
        }
        if (!values.inpatientNO) {
          return message.error('请输入患者住院号！');
        }
        return onCreate(values);
      }
    })
  };

  // 关闭窗口是，重置disabled
  const handleCancel = () => {
    setDisabled(false);
    onCancel();
  }

  // 不能输入非汉字效验  效验不能输入非空字符串
  const validateNoChinese = (rule, value, callback) => {
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
  const validateTel = (rule, value, callback) => {
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
  const validateMaxMin = (rule, value, callback) => {
    const reg = /^99$|^(\d|[1-9]\d)$/;
    const { field } = rule;

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
  const validateAge = (rule, value, callback) => {
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
  const trim = event => event.target.value.trim();

  // 所有空格消除
  const replace = event => event.target.value.replace(/\s+/g, '');

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
      title={`【${bedname}】 建档`}
      footer={null}
      okText="创建"
      cancelText="取消"
      bodyStyle={{ paddingRight: '48px' }}
      onCancel={handleCancel}
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
                  { validator: validateNoChinese },
                ],
                getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
              })(
                <Input autoFocus disabled={disabled} placeholder="输入床号..." style={{ width }} />,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={<span className="required">姓名</span>}>
              {getFieldDecorator('name', {
                rules: [
                  { required: false, message: '请填写孕妇姓名!' },
                  { max: 32, message: '姓名的最大长度为32' },
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
                  { max: 12, message: '住院号的最大长度为12' },
                  { validator: validateNoChinese },
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
                  // { validator: validateAge },
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
                rules: [{ required: false, message: '请输入孕次!' }, { validator: validateMaxMin }],
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
                rules: [{ required: false, message: '请输入产次!' }, { validator: validateMaxMin }],
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
                    { validator: validateTel },
                  ],
                })(<Input placeholder="请输入联系电话..." />)}
              </Form.Item>
            </Col> */}
        </Row>
        <Row>
          <Col span={24} style={{ marginBottom: 24, textAlign: 'center' }}>
            {/* 清空form数据 */}
            <Button onClick={reset}>重置</Button>
            {/* 建档后，不支持再次修改信息 */}
            <Button style={{ margin: '0 20px' }} type="primary" onClick={handleSearch}>
              调入
              </Button>
            <Button
              type="primary"
              onClick={handleCreate}
              loading={loading}
            >
              确认
            </Button>
          </Col>
          <Col
            span={24}
            style={{
              position: 'relative',
              color: '#999',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                position: 'absolute',
                left: 18,
                bottom: 42,
                color: '#f00',
              }}
            >
              {errorText}
            </span>
            提示：调入孕产妇信息时，输入床号即可。调入档案后，如需要更改，请先点击'重置'按钮，再进行操作。
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default Form.create<IProps>()(CollectionCreateForm);
