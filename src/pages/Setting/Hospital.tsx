import React, { useEffect } from 'react';
import { Form } from 'antd';
import { Button, Input, message, Select, Switch } from 'antd';
import { formItemLayout, tailFormItemLayout } from './utils';
import SettingStore from '@/utils/SettingStore';
import { remote } from "electron";
// import { getDisplaySize } from '@/utils/utils';
import styles from './style.less';
import { connect } from 'dva';
import store from 'store'
import { get } from "@lianmed/request";
// var config = require("../../../package.json");
function Hospital(props) {
  const [form] = Form.useForm()
  useEffect(() => {
    // 获取显示器尺寸
    // const { w, h } = getDisplaySize();

    // // 设置版本信息
    // form.setFieldsValue({
    //   // version_number: config.version,
    //   // build_date: config.author.date,
    //   display_size: `${w.toFixed(2)} * ${h.toFixed(2)} cm`
    // })
    const { fullscreen } = SettingStore.getObjSync()
    get('/organizations').then(({ name }) => {
      form.setFieldsValue({
        wardName: store.get('ward') && store.get('ward').wardName,
        wardType: store.get('ward') && store.get('ward').wardType,
        hospital_name: name,
        fullscreen
      });

    })
  }, [])

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const { fullscreen, } = values
      console.log('set', fullscreen)
      SettingStore.set('fullscreen', fullscreen).then(status => {
        if (status) {
          message.success('设置成功', 1).then(() => {
            // eslint-disable-next-line no-restricted-globals
            location.reload()
          }, () => { })
          props.dispatch({ type: 'list/getlist' })
        }
      });
    });
  };

  return (
    <Form form={form} layout="horizontal" {...formItemLayout} className={styles.form}>
      <div className={styles.subTitle}>医院信息</div>
      <Form.Item label="医院名称" name="hospital_name">
        <Input disabled />
      </Form.Item>
      <Form.Item label="病区类型" name="wardType">
        <Select  disabled>
          <Select.Option value="in">住院</Select.Option>
          <Select.Option value="out">门诊</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="病区" name="wardName">
        <Input disabled />
      </Form.Item>
      <Form.Item valuePropName="checked" label="默认全屏" name="fullscreen">
        <Switch />
      </Form.Item>
      {/* <Form.Item label="版本时间">
          {getFieldDecorator('build_date', {
            rules: [{ required: false, message: '请输入版本时间!' }],
          })(<Input disabled placeholder="请输入请输入版本时间!" />)}
        </Form.Item> */}
      {/* <Form.Item label="设备尺寸">
          {getFieldDecorator('display_size')(<Input disabled />)}
        </Form.Item> */}
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" onClick={handleSubmit}>
          保存
          </Button>
      </Form.Item>
    </Form>
  );
}

const H = connect()(Hospital);

H.displayName = '医院信息'
export default H