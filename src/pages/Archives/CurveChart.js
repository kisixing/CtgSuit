import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import moment from 'moment';
import { Ctg as L } from '@lianmed/lmg';

import styles from './CurveChart.less';

class CurveChart extends Component {
  render() {
    const {
      selected: { id, visitType, ctgexam, ...rest },
      dataSource,
      loading,
    } = this.props;
    console.log('TCL: CurveChart -> render -> dataSource', dataSource);

    return (
      <div className={styles.wrapper}>
        {/* <h2>电脑胎儿监护图</h2> */}
        <div className={styles.header}>
          <div>
            <span>
              档案号
              <span className={styles.var} style={{ marginRight: '12px', minWidth: '48px' }}>
                {ctgexam && ctgexam.note}
              </span>
            </span>
            {/* <span>
              第<span className={styles.var}>{visitType}</span>
              次检查
            </span> */}
          </div>
          <div>
            监护时间：
            <span style={{ display: 'inline-block', fontWeight: '600', width: '280px' }}>
              {ctgexam &&
                ctgexam.startTime &&
                moment(ctgexam.startTime).format('YYYY-MM-DD HH:mm:ss')}{' '}
              ~{' '}
              {ctgexam && ctgexam.endTime && moment(ctgexam.endTime).format('YYYY-MM-DD HH:mm:ss')}
            </span>
          </div>
        </div>
        <Spin
          wrapperClassName={styles.chart}
          spinning={loading.effects['archives/fetchCTGrecordData']}
        >
          <L type={1} data={dataSource}></L>
        </Spin>
      </div>
    );
  }
}

export default connect(({ loading, archives }) => ({
  loading: loading,
  selected: archives.current,
  dataSource: archives.currentData
}))(CurveChart);
