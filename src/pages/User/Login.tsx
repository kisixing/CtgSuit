import React, { useEffect, useState, useRef, forwardRef } from 'react';
import { connect } from 'dva';
import { UserOutlined, SettingOutlined, LockOutlined } from '@ant-design/icons';
import { Form, Button, Row, Input, Alert, Select, message, notification, Popconfirm } from 'antd';
import config from '@/utils/config';
import { IWard } from "@/types";
import request from '@/utils/request';
// import { TOKEN } from '@/utils/constant';
import SettingStore from '@/utils/SettingStore';
import store from "store";
declare var __DEV__: boolean;

const styles = require('./Login.less');
const FormItem = Form.Item;

interface IProps {
  [x: string]: any
}
const Login = (props: IProps) => {
  // 清除缓存
  // store.remove(TOKEN);
  const { loading, error, dispatch } = props;
  const [areaList, setAreaList] = useState<IWard[]>([]);
  const [form] = Form.useForm()
  const dateRef = useRef<typeof form>();
  useEffect(() => {
    props.dispatch({ type: 'list/clean' })
    return () => {

    };
  }, [])
  // useEffect(() => {
  //   // 病区保存在ward对象
  //   const old = SettingStore.getSync('ward')
  //   if (old) {
  //     setAreaList([old])
  //     form.setFieldsValue({ wardId: old.id + '' })
  //   }
  // }, []);

  const handleSubmit = () => {
    const { validateFields } = form;
    validateFields().then(({ id, username, password }) => {
      dispatch({ type: 'login/login', payload: { username, password } })
        .then(() => {
          // areano未旧的病区号
          store.set('ward', areaList.find(_ => _.id == id));
          form.resetFields();
          store.set('username', username)
        })
    });
  };

  const onDropdownVisible = () => {
    const username = form.getFieldValue('username');
    if (!username) {
      return message.error('请先输入用户名...');;
    }
    return request
      .get(`/users/${username}`)
      .then(({ wards }) => {
        wards && setAreaList(wards);
      })
      .catch(error => {
        const url = error.url;
        const pos = url && url.indexOf("api");
        const api = pos && url.slice(pos);
        notification.warning({
          message: `Network Error 请求错误 ${error.status}`,
          description: `${api}, ${error.errortext}`,
        });
      });
  }

  function onConfirm() {
    message.info('Clicked on Yes.');
    dateRef.current.validateFields().then((values) => {

      SettingStore.set(Object.keys(values), Object.values(values)).then(status => {
        if (status) {
          message.success('设置成功，2s 后重启！', 1).then(() => {
            // eslint-disable-next-line no-restricted-globals
            location.reload();
          }, () => { });
        }
      });
      // console.log('Received values of form: ', values);
    });;
  }


  return <>
    <div className={styles.container}>
      <div className={styles.logo}>
        <img alt="logo" src={config.logoPath} />
        <h1>{config.siteName}</h1>
      </div>
      <Form form={form} onFinish={handleSubmit} initialValues={{
        password:__DEV__ ? 'admin':'',
        username:store.get('username')
      }} >
        <FormItem hasFeedback name="username" >

          <Input
            allowClear
            autoFocus
            placeholder="工号"
            prefix={
              <UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />
            }
            onPressEnter={handleSubmit}
          />
        </FormItem>
        <FormItem hasFeedback name="password" rules={[
          {
            required: true,
            message: '请输入用户密码！',
          }
        ]}>

          <Input
            allowClear
            type="password"
            placeholder="密码"
            autoComplete="new-password"
            prefix={
              <LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />
            }
            onPressEnter={handleSubmit}
          />
        </FormItem>
        <FormItem hasFeedback name="id" rules={[
          {
            required: !__DEV__,
            message: '请选择病区！',
          }
        ]}>

          <Select
            placeholder="选择病区"
            className={styles.select}
            onDropdownVisibleChange={_ => _ && onDropdownVisible()}
          >
            {areaList.map(({ id, wardName }) => {
              return (
                <Select.Option key={id} value={id}>
                  {wardName}
                </Select.Option>
              );
            })}
          </Select>
        </FormItem>
        <Row>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading.effects['login/login']}
          >
            <span>登录</span>
          </Button>
        </Row>
        {error && error.status === '401' ? (
          <Alert message={error.message} type="error" closable />
        ) : null}
      </Form>
    </div>
    {/* footer */}
    <div className={styles.footer}>
      <>
        <span>{config.copyright}</span>
        <Popconfirm
          placement="topRight"
          trigger="click"
          title={<NetWork ref={dateRef} />}
          onConfirm={onConfirm}
          okText="确定"
          cancelText="取消"
        >
          <SettingOutlined
            style={{ float: 'right', margin: '6px 12px' }}
          />
        </Popconfirm>
      </>
    </div>
  </>;
}

const NetWork = forwardRef(
  (props, ref: any) => {
    const [form] = Form.useForm()
    useEffect(() => {
      SettingStore.get(['ws_url', 'xhr_url']).then(([ws_url, xhr_url]) => {
        form.setFieldsValue({ xhr_url, ws_url });
      });
    }, [form])
    return (
      <Form ref={ref} form={form} layout="inline" className={styles.netWork}>
        <div style={{ marginBottom: '12px' }}>网络设置</div>
        <Form.Item label="web socket" name="ws_url">

          <Input
            addonBefore="ws://"
            placeholder="请输入web socket服务地址!"
          />
        </Form.Item>
        <Form.Item label="web service" name="xhr_url">
          <Input
            addonBefore="http://"
            placeholder="请输入web service服务地址!"
          />
        </Form.Item>
      </Form>
    );
  }
);

export default connect(({ loading, login }: any) => ({
  loading,
  error: login.error,
}))(Login)
