import React, { Component } from 'react';
import { connect } from 'dva';
import { Ctg as L } from '@lianmed/lmg';

import styles from './CurveChart.less';

class CurveChart extends Component {
  render() {
    return (
      <div className={styles.wrapper}>
        <h2>电脑胎儿监护图</h2>
        <div className={styles.chart} >

        </div>
        {/* <L data={null}></L> */}
      </div>
    );
  }
}

export default connect(({ loading }) => ({
  loading: loading
}))(CurveChart);
