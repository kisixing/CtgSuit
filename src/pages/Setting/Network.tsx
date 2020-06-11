import React, { Component, FunctionComponent, useEffect } from 'react';

import '@ant-design/compatible/assets/index.css';
import { Input, Button, message, Form } from 'antd';
import store from '@/utils/SettingStore';

import { formItemLayout, tailFormItemLayout } from './utils';
const styles = require('./style.less');

const data = [
  {
    name: 'ws_url',
    label: 'ws 地址',
    addonBefore: 'ws://',
  },
  {
    name: 'xhr_url',
    addonBefore: 'http://',
    label: 'web 地址',
  },
  {
    name: 'remote_url',
    addonBefore: 'http://',
    label: '远程地址',
  },
  // {
  //   name: 'stomp_url',
  //   addonBefore: 'http://',
  //   label: 'stomp地址',
  // },
  {
    name: 'public_url',
    addonBefore: 'http://',
    label: 'public_url地址',
  },
]
const Network: FunctionComponent<{ isAdmin: boolean }> = (props) => {
  const { isAdmin } = props
  const [form] = Form.useForm()
  useEffect(() => {

    store.get(data.map(_ => _.name)).then((res: string[]) => {

      const values = data.reduce((v, _, i) => {
        return Object.assign(v, { [_.name]: res[i] })
      }, {})
      console.log(res, values)
      form.setFieldsValue(values);
    })
  }, [])


  const reset = () => {
    store.reset(data.map(_ => _.name)).then(status => {
      if (status) {
        message.success('恢复成功,2s 后重启', 2).then(() => {
          // eslint-disable-next-line no-restricted-globals
          location.reload()
        }, () => { })
      }
    })
  }
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      store.set(Object.keys(values), Object.values(values)).then(status => {
        if (status) {
          message.success('设置成功,2s 后重启', 2).then(() => {
            // eslint-disable-next-line no-restricted-globals
            location.reload()
          }, () => { })
        }
      })
    });
  };
  return (
    <Form form={form} layout="horizontal" {...formItemLayout} className={styles.form}>
      <div className={styles.subTitle}>网络设置</div>


      {
        data.map(_ => (
          <Form.Item label={_.label} name={_.name} key={_.name} required>
            <Input
              addonBefore={_.addonBefore}
              placeholder={`请输入!`}
            />
          </Form.Item>
        ))
      }
      <Form.Item {...tailFormItemLayout} required>
        <Button type="primary" onClick={handleSubmit} disabled={!isAdmin}>
          保存
          </Button>
        <Button
          type="default"
          onClick={reset}
          style={{ marginLeft: 10 }}
          disabled={!isAdmin}
        >
          恢复默认
          </Button>
      </Form.Item>
    </Form>
  );
}
Network.displayName = '服务器设置'
export default Network
