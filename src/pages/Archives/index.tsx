import { Layout } from 'antd';
import React, { useState } from 'react';
import CurveChart from './CurveChart';
import styles from './index.less';
import TableList from './TableList';
import request from '@/utils/request';


const Archives = props => {

  const [CTGData, setCTGData] = useState(null)
  async function fetchCtgData(docid = '') {
    const data = await request.get(`/ctg-exams-data/${docid}`)
    setCTGData(data)
  }
  return (
    <Layout className={styles.wrapper}>
      <div className={styles.searchForm}>
        {/* <FieldForm
          clearWard={clearWard}
        /> */}
        <TableList fetchCtgData={fetchCtgData} />
      </div>
      <Layout className={styles.chart}>
        <CurveChart CTGData={CTGData} />
      </Layout>
    </Layout>
  );
}

export default Archives;