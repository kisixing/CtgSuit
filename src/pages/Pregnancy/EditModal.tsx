/**
 * 编辑/新增病人
 */
import { getMomentObj } from "@lianmed/utils";
import { Button, Col, DatePicker, Form, Input, InputNumber, message, Modal, Row, Select } from 'antd';
import React, { useEffect } from 'react';
import store from "store";
const styles = require('./index.less')
const width = '200px';
function EditModal(props) {
  // const [required, setRequired] = useState(false)
  // const [searchValues, setSearchValues] = useState<any>({})
  const { visible, onCancel, dataSource, isOut } = props;
  const [form] = Form.useForm()
  const areaNO = store.get('ward') && store.get('ward').wardId
  const noLabel = isOut ? '卡号' : '住院号'
  const noKey = isOut ? 'cardNO' : 'inpatientNO';
  console.log('data', dataSource)
  useEffect(() => {
    if (dataSource) {
      const {
        name,
        age,
        telephone,
        gravidity,
        parity,
        edd,
        // birth,
        recordstate,
        bedNO,
      } = dataSource;
      const base = {
        [noKey]: dataSource[noKey],
        name,
        age,
        telephone,
        gravidity,
        parity,
        edd: edd ? getMomentObj(edd) : null,
        // birth:moment(birth),
        recordstate,
        bedNO: isOut ? bedNO : undefined
      }

      form.setFieldsValue(base);
      // setRequired(true)
    }
  }, [dataSource])



  const handleOk = () => {
    const { onCreate, onCancel, onUpdate, dataSource } = props;
    form.validateFields().then((values) => {
      if (dataSource) {
        onUpdate({ id: dataSource.id, ...values });
        onCancel();
      } else {
        // ADT操作
        // if (searchValues.id) {
        //   // 修改
        //   onUpdate({ id: searchValues.id, ...values });
        // } else {
        // 新建
        const { name, bedNO } = values;
        // if (!values[noKey]) {
        //   return message.error(`请输入${noLabel}！`);
        // }
        if (!name) {
          return message.error('请输入姓名！');
        }
        if (!bedNO && !isOut) {
          return message.error('请输入床号！');
        }
        onCreate({ areaNO, ...values });
        onCancel();
        // }
      }
    });
  };

  // const handleUpdate = () => {
  //   // 编辑修改
  //   const { onOk, onCancel, dataSource } = props;
  //   const { id } = dataSource;
  //   form.validateFields().then((values) => {
  //     onOk({ id, ...values });
  //     onCancel();
  //   });
  // };

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
      <Form form={form} initialValues={{ recordstate: isOut ? '30' : '10' }} className={styles.modalForm} layout="horizontal" {...formItemLayout}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name={noKey}
              label={noLabel}
              rules={
                [
                  { required: !isOut, message: `请填写${noLabel}!` },
                  { max: 10, message: `${noLabel}的最大长度为10` },
                ]
              }
              getValueFromEvent={event => event.target.value.trim()}
            >
              <Input placeholder={`请输入${noLabel}`} style={{ width }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="name"
              label="姓名"
              rules={
                [
                  { required: true, message: '请填写姓名!' },
                  { max: 12, message: '姓名的最大长度为12' },
                ]
              }
              getValueFromEvent={event => event.target.value.trim()}

            >
              <Input placeholder="输入姓名" style={{ width }} />
            </Form.Item>
          </Col>
          {
            isOut || (
              <Col span={12}>
                <Form.Item
                  getValueFromEvent={event => event.target.value.trim()}
                  name="bedNO"
                  label="床号"
                  rules={
                    [
                      { required: true, message: '请填写床号!' },
                      { max: 6, message: '姓名的最大长度为6' },
                    ]
                  }
                >
                  <Input placeholder="请输入床号..." style={{ width }} />
                </Form.Item>
              </Col>
            )
          }
          {/* <Col span={12}>
                <Form.Item label="出生年月">
                  {getFieldDecorator('birth', {
                    rules: [{ required: false, message: '请填写出生日期!' }],
                  })(<DatePicker placeholder="输入出生日期..." style={{ width }} />)}
                </Form.Item>
              </Col> */}
          <Col span={12}>
            <Form.Item name="age" label="年龄" rules={[{ required: false, message: '请填写年龄!' }]}>
              <InputNumber
                min={1}
                max={99}
                placeholder="输入年龄..."
                style={{ width }}
              />
            </Form.Item>
          </Col>
          {
            (
              <Col span={12} hidden={isOut}>
                <Form.Item label="住院状态"
                  name="recordstate"
                  rules={[{ required: false, message: '请选择住院状态!' }]}
                >
                  <Select allowClear style={{ width }}>
                    <Select.Option value="10">住院中</Select.Option>
                    <Select.Option value="20">已出院</Select.Option>
                    {/* <Select.Option value="30">门诊</Select.Option> */}
                  </Select>
                </Form.Item>
              </Col>
            )
          }
          <Col span={12}>
            <Form.Item label="孕次" name="gravidity"
              rules={[{ required: false, message: '请输入孕次!' }]}

            >
              <InputNumber min={1} max={10} placeholder="请输入孕次..." style={{ width }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="产次" name="parity">

              <InputNumber min={0} max={10} placeholder="请输入产次..." style={{ width }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="预产期" name="edd">
              <DatePicker placeholder="请输入预产期..." style={{ width }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="联系电话" name="telephone"
              rules={
                [
                  { required: false, message: '请填写联系电话!' },
                  { validator: validateTel },
                ]
              }
              getValueFromEvent={event => event.target.value.replace(/\s+/g, '')}

            >
              <Input placeholder="请输入联系电话..." style={{ width }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="居住地址" name="address"
              getValueFromEvent={event => event.target.value.trim()}

            >
              <Input placeholder="输入现居住详细地址" style={{ width }} />
            </Form.Item>
          </Col>
          <Col span={24} className={styles.buttons}>
            <Button onClick={onCancel}>取消</Button>
            {/* {dataSource ? null : <Button onClick={handleSearch}>搜索</Button>} */}
            <Button type="primary" onClick={handleOk}>
              确定
                </Button>
          </Col>
        </Row>
        {/* {dataSource ? null : <div className={styles.tips}>只支持“{noLabel}”、“姓名”搜索</div>} */}
      </Form>
    </Modal >
  );
}



export default EditModal;
