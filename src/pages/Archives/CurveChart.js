import React, { Component } from 'react';
import { Ctg as L } from '@lianmed/lmg';

import styles from './CurveChart.less';

class CurveChart extends Component {
  render() {
    return (
      <div className={styles.chart}>
        <L data={null}></L>
      </div>
    );
  }
}

export default CurveChart;
