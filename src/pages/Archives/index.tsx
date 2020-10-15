import { Layout } from 'antd';
import React, { useState } from 'react';
import CurveChart from './CurveChart';
import styles from './index.less';
import TableList from './TableList';
import request from '@/utils/request';
import { IPrenatalVisit } from '@lianmed/f_types';


const Archives = props => {

  const [CTGData, setCTGData] = useState(null)
  const [selected, setSelected] = useState({})
  const [loading, setLoading] = useState(false)
  async function fetchCtgData(item: IPrenatalVisit) {
    setSelected(item)
    const data = await request.get(`/ctg-exams-data/${item.ctgexam.note}`)
    if(!data.fhr1){
      data.fhr1 = '00'
    }
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
        <CurveChart loading={loading} CTGData={CTGData} selected={selected} />
      </Layout>
    </Layout>
  );
}

export default Archives;