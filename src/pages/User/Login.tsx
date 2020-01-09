import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'dva';
import {
  Button,
  Row,
  Form,
  Input,
  Icon,
  Alert,
  Select,
  message,
  notification,
  Popconfirm
} from 'antd';
import config from '@/utils/config';
import { IWard } from "@/types";
import request from '@/utils/request';
// import { TOKEN } from '@/utils/constant';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import SettingStore from '@/utils/SettingStore';
import store from "store";

const styles = require('./Login.less');
const FormItem = Form.Item;

interface IProps {
  form: WrappedFormUtils
  [x: string]: any
}
const Login = (props: IProps) => {
  // 清除缓存
  // store.remove(TOKEN);
  const { loading, error, form, dispatch } = props;
  const [areaList, setAreaList] = useState<IWard[]>([]);
  const dateRef = useRef();
  // useEffect(() => {
  //   // 病区保存在ward对象
  //   const old = SettingStore.getSync('ward')
  //   if (old) {
  //     setAreaList([old])
  //     form.setFieldsValue({ wardId: old.id + '' })
  //   }
  // }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const { validateFields } = form;
    validateFields((errors, { id, username, password }) => {
      if (errors) {
        return;
      }
      dispatch({ type: 'login/login', payload: { username, password } })
        .then(() => {
          // areano未旧的病区号
          SettingStore.setSync('ward', areaList.find(_ => _.id == id));
          SettingStore.setSync('areano', areaList.find(_ => _.id == id)['wardId']);
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
    dateRef.current.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      SettingStore.set(Object.keys(values), Object.values(values)).then(status => {
        if (status) {
          message.success('设置成功，2s 后重启！', 1).then(() => {
            // eslint-disable-next-line no-restricted-globals
            location.reload();
          });
        }
      });
      // console.log('Received values of form: ', values);
    });;
  }

  const { getFieldDecorator } = form;

  return (
    <>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img alt="logo" src={config.logoPath} />
          <h1>{config.siteName}</h1>
        </div>
        <Form onSubmit={handleSubmit}>
          <FormItem hasFeedback>
            {getFieldDecorator('username', {
              initialValue: store.get('username'),
              rules: [
                {
                  required: true,
                  message: '请输入用户名！',
                },
              ],
            })(
              <Input
                allowClear
                autoFocus
                placeholder="工号"
                prefix={
                  <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                onPressEnter={handleSubmit}
              />,
            )}
          </FormItem>
          <FormItem hasFeedback>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '请输入用户密码！',
                },
              ],
            })(
              <Input
                allowClear
                type="password"
                placeholder="密码"
                autoComplete="new-password"
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                onPressEnter={handleSubmit}
              />,
            )}
          </FormItem>
          <FormItem hasFeedback>
            {getFieldDecorator('id', {
              rules: [
                {
                  required: true,
                  message: '请选择病区！',
                },
              ],
            })(
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
              </Select>,
            )}
          </FormItem>
          <Row>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading.effects['login/login']}
            >
              <span>登陆</span>
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
            title={<NetWork wrappedComponentRef={dateRef} />}
            onConfirm={onConfirm}
            okText="确定"
            cancelText="取消"
          >
            <Icon
              type="setting"
              style={{ float: 'right', margin: '6px 12px' }}
            />
          </Popconfirm>
        </>
      </div>
    </>
  );
}

const NetWork = Form.create()(
  class extends React.Component {
    componentDidMount() {
      const { form } = this.props;

      SettingStore.get(['ws_url', 'xhr_url']).then(([ws_url, xhr_url]) => {
        form.setFieldsValue({ xhr_url, ws_url });
      });
    }
    render() {
      const { form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Form layout="inline" className={styles.netWork}>
          <div style={{ marginBottom: '12px' }}>网络设置</div>
          <Form.Item label="web socket">
            {getFieldDecorator('ws_url')(
              <Input
                addonBefore="ws://"
                placeholder="请输入web socket服务地址!"
              />,
            )}
          </Form.Item>
          <Form.Item label="web service">
            {getFieldDecorator('xhr_url')(
              <Input
                addonBefore="http://"
                placeholder="请输入web service服务地址!"
              />,
            )}
          </Form.Item>
        </Form>
      );
    }
  },
);

export default connect(({ loading, login }: any) => ({
  loading,
  error: login.error,
}))(Form.create()(Login))
