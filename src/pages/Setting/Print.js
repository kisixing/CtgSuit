import React, { useEffect } from 'react';
import '@ant-design/compatible/assets/index.css';
import { InputNumber, Button, message, Radio, Form } from 'antd';
import store from '@/utils/SettingStore';

import { formItemLayout, tailFormItemLayout } from './utils';
import styles from './style.less';

const Print = ({ isAdmin }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    const fetchData = () => {
      store.getObj().then(({ print_interval }) => {
        form.setFieldsValue({ print_interval });
      })
    }
    fetchData()
  }, [form])
  const handleSubmit = () => {
    form.validateFields((err, values) => {
      if (!err) {
        store.set(Object.keys(values), Object.values(values)).then(status => {
          if (status) {
            message.success('设置成功', 2)
          }
        })
      }
    });
  };
  // const reset = () => {
  //   store.reset(['print_interval']).then(status => {
  //     if (status) {
  //       message.success('恢复成功', 2)
  //       fetchData()
  //     }
  //   })
  // }



  return (
    <Form layout="horizontal" {...formItemLayout} form={form} className={styles.form}>
      <div className={styles.subTitle}>打印设置</div>
      <Form.Item label="打印时长(分)" name="print_interval" rules={[{ required: false, message: '请输入打印时长!' }]}>
        <InputNumber placeholder="请输入打印时长!" />
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" onClick={handleSubmit}>
          保存
          </Button>
        {/* <Button
            type="default"
            onClick={reset.bind(this)}
            style={{ marginLeft: 10 }}
          >
            恢复默认
          </Button> */}
      </Form.Item>
    </Form>
  );
}
Print.displayName = '打印设置'

export default Print
