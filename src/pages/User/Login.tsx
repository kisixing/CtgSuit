import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Button, Row, Form, Input, Icon, Alert, Select } from 'antd';
import config from '@/utils/config';
import { IWard } from "@/types";
// import { request } from '@lianmed/utils';
import request from '@/utils/request';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import store from '@/utils/SettingStore';

const styles = require('./Login.less');
const FormItem = Form.Item;

interface IProps {
  form: WrappedFormUtils
  [x: string]: any
}
const Login = (props: IProps) => {

  const { loading, error, form, dispatch } = props;
  const [areaList, setAreaList] = useState<IWard[]>([])
  // useEffect(() => {
  //   // 病区保存在ward对象
  //   const old = store.getSync('ward')
  //   if (old) {
  //     setAreaList([old])
  //     form.setFieldsValue({ wardId: old.id + '' })
  //   }
  // }, []);

  const handleSubmit = e => {
    e.preventDefault();
    const { validateFields } = form;
    validateFields((errors, { wardId, ...others }) => {
      if (errors) {
        return;
      }
      dispatch({ type: 'login/login', payload: others })
        .then(() => {
          // areano未旧的病区号
          store.setSync('ward', areaList.find(_ => _.id == wardId));
          store.setSync('areano', wardId);
          form.resetFields();
        })
    });
  };

  const onDropdownVisible = () => {
    request.get(`/users/${form.getFieldValue('username')}`).then(({ wards }) => {
      wards && setAreaList(wards)
    })
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
              // initialValue: 'admin',

              rules: [
                {
                  required: true,
                  message: '请输入用户名！',
                },
              ],
            })(
              <Input
                autoFocus
                placeholder="用户名"
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                onPressEnter={handleSubmit}
              />,
            )}
          </FormItem>
          <FormItem hasFeedback>
            {getFieldDecorator('password', {
              // initialValue: 'admin',
              rules: [
                {
                  required: true,
                  message: '请输入用户密码！',
                },
              ],
            })(
              <Input
                type="password"
                placeholder="密码"
                autoComplete="new-password"
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                onPressEnter={handleSubmit}
              />,
            )}
          </FormItem>
          <FormItem hasFeedback>
            {getFieldDecorator('wardId', {
              // initialValue: 'hi',
              rules: [
                {
                  required: true,
                  message: '请选择病区！',
                },
              ],
            })(
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: '5px',
                    left: 0,
                    display: 'inline-block',
                    width: '30px',
                    height: '30px',
                    textAlign: 'right',
                    lineHeight: '30px',
                    zIndex: 9,
                  }}
                >
                  <Icon type="gold" style={{ marginRight: '4px', color: '#999' }} />
                </div>
                <Select
                  placeholder="选择病区"
                  className={styles.select}
                  onDropdownVisibleChange={_ => _ && onDropdownVisible()}
                >
                  {
                    areaList.map(({ id, wardName }) => {
                      return (
                        <Select.Option key={id}>
                          {wardName}
                        </Select.Option>
                      )
                    })
                  }
                </Select>
              </div>
            )}
          </FormItem>
          <Row>
            <Button type="primary" htmlType="submit" loading={loading.effects['login/login']}>
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
          Copyright <Icon type="copyright" /> {config.copyright}
        </>
      </div>
    </>
  );
}

export default connect(({ loading, login }: any) => ({
  loading,
  error: login.error,
}))(Form.create()(Login))
