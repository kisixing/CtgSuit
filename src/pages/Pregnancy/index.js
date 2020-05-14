import React, { useState, useRef } from 'react';
import { Layout } from 'antd';
import store from 'store';
import SearchForm from './SearchForm';
import TableList from './TableList';
import styles from './index.less';

export default function Pregnancy(props) {
  const ward = store.get('ward');

  const [wardId, setWardId] = useState((ward && ward.wardId) ? ward.wardId : undefined)
  const form = useRef()
  // 置空病区
  const clearWard = () => {
    setWardId(undefined)
  }

  const getFields = () => {
    let v = {};
    form.current.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      v = values;
    });
    return v
  }
  return (
    <Layout className={styles.wrapper}>
      <div>
        <SearchForm
          clearWard={clearWard}
          wrappedComponentRef={rel => (form.current = rel)}
        />
      </div>
      <Layout>
        <TableList getFields={getFields} wardId={wardId} />
      </Layout>
    </Layout>
  );
}
