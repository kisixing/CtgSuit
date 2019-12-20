import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Button, Row, Form, Input, Icon, Alert, Select } from 'antd';
import config from '@/utils/config';
const styles = require('./Login.less')
import { IWard } from "@/types";
import { request } from '@lianmed/utils';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import store from '@/utils/SettingStore'
const FormItem = Form.Item;

interface IProps {
  form: WrappedFormUtils
  [x: string]: any
}
const Login = (props: IProps) => {

  const { loading, error, form, dispatch } = props;
  const [areaList, setAreaList] = useState<IWard[]>([])
  useEffect(() => {
    const old = store.getSync('ward')
    if (old) {
      setAreaList([old])
      form.setFieldsValue({ wardId: old.id + '' })
    }
  }, [])
  const handleSubmit = e => {
    e.preventDefault();
    const { } = props;
    const { validateFields } = form;
    validateFields((errors, { wardId, ...others }) => {
      if (errors) {
        return;
      }
      dispatch({ type: 'login/login', payload: others })
        .then(() => {

          store.setSync('ward', areaList.find(_ => _.id == wardId))
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

              <Select onDropdownVisibleChange={_ => _ && onDropdownVisible()}>
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
