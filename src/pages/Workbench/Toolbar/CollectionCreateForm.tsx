/**
 * 胎监主页PDA建档/绑定弹窗
 */
import React, { useState, memo, useEffect } from 'react';
import { Button, Modal, Input, Row, Col, InputNumber, message, Table, Form } from 'antd';
import _ from 'lodash';
import moment from 'moment';
// import { request } from '@lianmed/utils';
import request from '@/utils/request';
import { stringify } from 'qs';
import { IWard } from "@/types";


import store from "store";
interface IProps {
  starttime: string
  docid: string
  isTodo: boolean
  bedname: string
  visible: boolean
  onCancel: () => void
  onCreated: any,
  isStopMonitorWhenCreated: boolean
}
const CollectionCreateForm = (props: IProps) => {

  const ward: IWard = store.get('ward') || {}

  const width = '200px';
  const isRealIn = ward.wardType === 'in'
  const [isIn, setIsIn] = useState(isRealIn)
  const noLabel = isIn ? '住院号' : '卡号'
  const noKey = isIn ? 'inpatientNO' : 'cardNO';
  const columns: any = [
    isIn && {
      title: '床号',
      dataIndex: 'bedNO',
      key: 'bedNO',
      align: 'center',
      width: '33.33%',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: '33.33%',
    },
    {
      title: noLabel,
      dataIndex: noKey,
      key: noKey,
      align: 'center',
      width: '33.33%',
    },
  ].filter(_ => !!_);
  const [form] = Form.useForm()
  const {
    starttime,
    docid,
    isTodo,
    bedname,
    visible,
    onCancel,
    onCreated,
    isStopMonitorWhenCreated,
  } = props;


  // 搜索值
  const [selectedPregnancy, setSelectedPregnancy] = useState({});
  const [pregnancyList, setPregnancyList] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);
  // 低龄产妇、高龄产妇标记
  const [ageWarning, setAgeWarning] = useState<{ status: any, help: any }>({ status: '', help: '' });

  // 获取病区好
  const areaNO = ward.wardId;

  const reset = () => {
    // 清空form表单数据、输入框状态变为可输入状态
    form.resetFields();
    setDisabled(false)
    setAgeWarning({ status: '', help: '' });

  };

  const onCreate = async (values, oldValues) => {
    // 新建孕册 后台会自动检验孕册是否已经存在
    // ture -> 提示孕册已经存在
    const pregnancyId = values.id;

    if (!docid) {
      return message.warn('离线状态，无法建档！');
    }
    const d = {
      visitType: values.visitTime,
      // visitTime: moment(values.values).format('YYYY-MM-DD HH:mm:ss'),
      visitTime: new Date(),
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
      // 如果更改了调入的孕产数据，静默提交保存(比较两个对象) age,gravidity,parity,gestationalWeek
      const old = {
        id: oldValues.id,
        bedNO: oldValues.bedNO,
        name: oldValues.name,
        [noKey]: oldValues.bedNO,
        age: oldValues.age,
        gravidity: oldValues.gravidity,
        parity: oldValues.parity,
        gestationalWeek: oldValues.gestationalWeek,
      };
      const isEqual = _.isEqual(values, old);
      if (!isEqual) {
        return request.put(`/pregnancies`, {
          data: { ...values },
        }).then(res => {
          if (res && res.id) {
            // 孕册信息修改成功
            // ctg建档
            newArchive(data);
          } else {
            message.error('建档异常，请稍后再试...');
          }
        });
      }
      // ctg建档
      newArchive(data);
    } else {
      // 无孕册pregnancyId 新建孕册获并获取到pregnancyId
      // 新建孕册
      const res = await request
        .post('/pregnancies', {
          data: {
            ...values,
            areaNO: isIn ? areaNO : undefined,
            recordstate: isIn ? '10' : '30',
          },
        })
        .catch(({ data }) => {
          data.then(({ title }) => {
            message.info(title);
          });
        });
      if (res && res.id) {
        // 新建孕册成功
        const data = { ...d, pregnancy: { id: res.id } };
        // 新建（绑定）档案
        newArchive(data);
      } else {
        // 孕册存在，取到孕册信息
        message.info('新建孕册失败！');
      }
    }
  };

  const newArchive = async params => {
    setLoading(true);
    const res = await request.post(`/prenatal-visits`, {
      data: params,
    })
      .catch(({ data }) =>

        data.then(e => {
          setLoading(false);
          message.error(e.title);
        }),
      );
    if (res && res.id) {
      if (isStopMonitorWhenCreated) {
        setTimeout(() => {
          onCreated(res);
          setLoading(false);
          handleCancel();
          message.success('建档成功！');
        }, 3000);
      } else {
        setLoading(false);
        handleCancel();
        onCreated(res);
      }
    } else {
      message.error('建档异常，请稍后再试！', 3);
    }
  };

  // modal里面的搜索按钮事件、调入
  const handleSearch = () => {
    setErrorText('');
    // 判断门诊，住院
    form.validateFields().then(async (values) => {

      const res = await request.get(
        `/pregnancies?${stringify({
          // TODO
          // 默认病区 、默认住院状态
          'recordstate.equals': isIn ? '10' : '30', // 住院中10, 门诊30
          'areaNO.equals': isIn ? areaNO : undefined, // 默认病区, 门诊时不需要传病区号
          'bedNO.equals': values.bedNO ? values.bedNO : undefined, // 床号
          [`${noKey}.equals`]: values[noKey] ? values[noKey] : undefined, // 住院号or卡号
          'name.equals': values.name ? values.name : undefined,
        })}`,
      );
      // 成功调入孕妇信息后，禁止修改。
      // 重新选择调入、新建孕妇信息 --> '取消'后再重复操作
      if (!res.length) {
        setErrorText(values[noKey] ? `没有${noLabel}为 ${values[noKey]} 的孕册，请新建孕册。` : '没有找到相关孕册，请新建孕册。');
        setPregnancyList([])
      } else if (res.length === 1) {
        // 搜索结果只有一个，默认赋值
        setDisabled(true);
        const current = res[0];
        setSelectedPregnancy(current);
        form.setFieldsValue(current);
        // 年龄检验判断
        const age = current.age;
        validateAge(age);
      } else {
        setPregnancyList(res);
        // setDisabled(true)
        // form.setFieldsValue(res[0]); // TODO 12.02前的方案，自动赋值
      }
    });
  };

  const selectRow = (record: object) => {
    form.setFieldsValue(record);
    setSelectedPregnancy(record);
    setDisabled(true);
  };

  const handleCreate = () => {
    form.validateFields().then((values: any) => {
      const gravidity = form.getFieldValue('gravidity');
      const parity = form.getFieldValue('parity');

      if (gravidity < parity) {
        return message.error('产次大于孕次！');
      }
      if (!values.bedNO && isIn) {
        return message.error('请输入患者床号！');
      }
      if (!values.name) {
        return message.error('请输入患者姓名！');
      }
      if (!values[noKey] && isIn) {
        return message.error(`请输入患${noLabel}！`);
      }
      const old = selectedPregnancy;
      return onCreate(values, old);
    })
  };

  // 关闭窗口是，重置disabled
  const handleCancel = () => {
    setDisabled(false);
    setPregnancyList([]);
    setAgeWarning({ status: '', help: '' });
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

    // if (field === 'gravidity') {
    //   // 孕次
    //   const target = form.getFieldValue('parity');
    //   if (value < target && target) {
    //     callback('孕次小于产次，请检查数据合理性');
    //   }
    // }
    // if (field === 'parity') {
    //   // 产次
    //   const target = form.getFieldValue('gravidity');
    //   if (value > target && target) {
    //     callback('产次大于孕次，请检查数据合理性');
    //   }
    // }
    callback();
  };

  // 年龄校验
  const validateAge = (value: number) => {
    setAgeWarning({ status: 'success', help: '' });
    if (!value) {
      setAgeWarning({ status: 'warning', help: '请输入年龄...' });
    }
    if (value >= 35) {
      setAgeWarning({ status: 'warning', help: '年龄偏大...' });
    }
    if (value < 18) {
      setAgeWarning({ status: 'warning', help: '年龄偏小...' });
    }
  };

  // 前后空格消除
  const trim = event => event.target.value.trim();

  // 所有空格消除
  const replace = event => event.target.value.replace(/\s+/g, '');

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  useEffect(() => {
    if (!visible) {
      setErrorText('')
    }
  }, [visible])
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
      bodyStyle={{}}
      onCancel={handleCancel}
    >
      <Form
        id="Modal_Message_Container"
        layout="horizontal"
        {...formItemLayout}
        form={form}
      >
        <Row gutter={24}>
          <Col span={0}>
            <Form.Item label="" name="id">
              <Input />
            </Form.Item>
          </Col>
          {isIn && (
            <Col span={12}>
              <Form.Item name="bedNO" label={<span className="required">床号</span>}
                rules={[
                  { required: false, message: '请填写床号!' },
                  { max: 15, message: '床号的最大长度为15个字节' },
                  // { validator: validateBedNo },
                ]}
                getValueFromEvent={event => event.target.value.replace(/\s+/g, '')}
              >
                <Input
                  autoFocus
                  disabled={disabled}
                  placeholder="输入床号..."
                  style={{ width }}
                />
              </Form.Item>
            </Col>
          )}
          <Col span={12}>
            <Form.Item name="name" label={<span className="required">姓名</span>}
              rules={[
                { required: false, message: '请填写姓名!' },
                { max: 32, message: '姓名的最大长度为32' },
              ]}
              getValueFromEvent={event => event.target.value.trim()}
            >

              <Input
                disabled={disabled}
                placeholder="输入姓名..."
                style={{ width }}
              />

            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={noKey} label={<span className={isIn ? 'required' : ''}>{noLabel}</span>}
              rules={
                [
                  { required: false, message: `请填写${noLabel}!` },
                  { max: 15, message: `${noLabel}的最大长度为15` },
                  { validator: validateNoChinese },
                ]
              }
              getValueFromEvent={event => event.target.value.replace(/\s+/g, '')}
            >

              <Input
                disabled={disabled}
                placeholder={`输入${noLabel}...`}
                style={{ width }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              hasFeedback
              label="年龄"
              validateStatus={ageWarning.status} // "warning"
              // help={ageWarning.help} // "年龄偏小..."
              name="age"
            >

              <InputNumber
                min={1}
                max={99}
                // disabled={disabled}
                placeholder="输入年龄..."
                style={{ width }}
                onChange={validateAge}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="孕次" name="gravidity"
              rules={
                [
                  { required: false, message: '请输入孕次!' },
                  { validator: validateMaxMin },
                ]
              }
            >
              <InputNumber
                min={1}
                max={99}
                // disabled={disabled}
                placeholder="请输入孕次..."
                style={{ width }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="产次" name="parity"
              rules={
                [
                  { required: false, message: '请输入产次!' },
                  { validator: validateMaxMin },
                ]
              }
            >

              <InputNumber
                min={0}
                max={99}
                // disabled={disabled}
                placeholder="请输入产次..."
                style={{ width }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="孕周" name="gestationalWeek" rules={[{ required: false, message: '请填写孕周!' }]}>
              <Input style={{ width }} placeholder="请输入孕周..." />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ marginBottom: 12, textAlign: 'center' }}>
            {/* 清空form数据 */}
            <Button onClick={reset}>重置</Button>
            {/* 建档后，不支持再次修改信息 */}
            <Button
              style={{ margin: '0 20px' }}
              type="primary"
              onClick={handleSearch}
            >
              调入
            </Button>
            <Button type="primary" onClick={handleCreate} loading={loading}>
              确认
            </Button>
            {isRealIn && (
              <Button
                type="primary"
                style={{ margin: '0 20px' }}
                onClick={() => {
                  setIsIn(!isIn);
                }}
              >
                {isIn ? `急诊` : `返回`}
              </Button>
            )}
          </Col>
          <Col
            span={24}
            style={{
              position: 'relative',
              marginBottom: '12px',
              color: '#999',
              textAlign: 'center',
            }}
          >
            {/* <span
              style={{
                position: 'absolute',
                left: 18,
                bottom: 42,
                color: '#f00',
              }}
            >
              {errorText}
            </span> */}
            {errorText ? (
              <div style={{ color: '#f00' }}>{errorText}</div>
            ) : null}
            {`提示：调入孕产妇信息时，输入${isIn ? '床号' : '卡号'}即可。调入档案后，如需要更改，请先点击'重置'按钮，再进行操作。`}
          </Col>
        </Row>
      </Form>
      {pregnancyList.length > 1 && (
        <div>
          {/* <p>请选择孕册信息</p> */}
          <Table
            bordered
            size="small"
            scroll={{ y: 228 }}
            pagination={false}
            columns={columns}
            dataSource={pregnancyList}
            onRow={record => {
              return {
                onClick: event => selectRow(record), // 点击行
              };
            }}
          />
        </div>
      )}
    </Modal>
  );
}

export default memo(CollectionCreateForm)
