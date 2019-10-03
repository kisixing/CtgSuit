import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import FieldForm from './FieldForm';
import TableList from './TableList';
import CurveChart from './CurveChart';

import styles from './index.less';

class Archives extends PureComponent {
  render() {
    return (
      <Layout className={styles.wrapper}>
        <div className={styles.searchForm}>
          <FieldForm />
          <TableList />
        </div>
        <div className={styles.chart}>
          <h2>电脑胎儿监护图</h2>
          <CurveChart />
        </div>
      </Layout>
    );
  }
}

export default Archives;