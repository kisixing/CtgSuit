import React, { useState, useRef } from 'react';
import { Layout, Form } from 'antd';
import store from 'store';
import SearchForm from './SearchForm';
import TableList from './TableList';
const styles = require('./index.less')

export default function Pregnancy(props) {
  const ward = store.get('ward');
  const [form] = Form.useForm()
  const [wardId, setWardId] = useState((ward && ward.wardId) ? ward.wardId : undefined)
  // 置空病区
  const clearWard = () => {
    setWardId(undefined)
  }

  const getFields = () => {
    return form.getFieldsValue()
  }
  return (
    <Layout className={styles.wrapper}>
      <div>
        <SearchForm
          clearWard={clearWard}
          form={form}
        />
      </div>
      <Layout>
        <TableList getFields={getFields} wardId={wardId} />
      </Layout>
    </Layout>
  );
}
