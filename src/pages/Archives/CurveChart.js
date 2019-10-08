import React, { Component } from 'react';
import { connect } from 'dva';
import { Ctg as L } from '@lianmed/lmg';

import styles from './CurveChart.less';

class CurveChart extends Component {
  render() {
    const { selected } = this.props;
    return (
      <div className={styles.wrapper}>
        <h2>电脑胎儿监护图</h2>
        <div className={styles.header}>
          <div>
            <span style={{ marginRight: '24px' }}>档案号：{selected.id}</span>
            <span>第 {selected.visitType} 次检查`</span>
          </div>
          <div>
            <span>监护时间：</span>
          </div>
        </div>
        <div className={styles.chart}></div>
        {/* <L data={null}></L> */}
      </div>
    );
  }
}

export default connect(({ loading, archives }) => ({
  loading: loading,
  selected: archives.current,
  dataSource: archives.currentData
}))(CurveChart);
