import React, { useState } from 'react';
import { Layout, Form } from 'antd';
import store from 'store';
import FieldForm from './FieldForm';
import TableList from './TableList';
import CurveChart from './CurveChart';

import styles from './index.less';

const Archives = props => {
  const ward = store.get('ward');
  const [form] = Form.useForm()
  const [wardId, setWardId] = useState(ward && ward.wardId ? ward.wardId : undefined)
  // 置空病区
  const clearWard = () => {
    setWardId(undefined);
  };

  const getFields = () => {
    return form.getFieldsValue();
  };
  return (
    <Layout className={styles.wrapper}>
      <div className={styles.searchForm}>
        <FieldForm
          clearWard={clearWard}
          form={form}
        />
        <TableList wardId={wardId} getFields={getFields} />
      </div>
      <Layout className={styles.chart}>
        <CurveChart />
      </Layout>
    </Layout>
  );
}

export default Archives;