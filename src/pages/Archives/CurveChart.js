import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin, Button } from 'antd';
import moment from 'moment';
import classnames from 'classnames';
import { Ctg as L } from '@lianmed/lmg';

import styles from './CurveChart.less';

class CurveChart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  switchFullscreen = () => {
    const { dispatch, isFullscreen } = this.props;
    dispatch({
      type: 'archives/updateState',
      payload: {
        isFullscreen: !isFullscreen,
      },
    });
  };

  render() {
    const {
      selected: { id, visitType, ctgexam, ...rest },
      dataSource,
      loading,
      isFullscreen,
    } = this.props;
    return (
      <div className={classnames([styles.wrapper], { [styles.fullscreen]: isFullscreen })}>
        {/* <h2>电脑胎儿监护图</h2> */}
        <div className={styles.header}>
          <div>
            <span>
              档案号：
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
            <span style={{ display: 'inline-block', fontWeight: '600', marginRight: '24px' }}>
              {ctgexam &&
                ctgexam.startTime &&
                moment(ctgexam.startTime).format('YYYY-MM-DD HH:mm:ss')}{' '}
              ~{' '}
              {ctgexam && ctgexam.endTime && moment(ctgexam.endTime).format('YYYY-MM-DD HH:mm:ss')}
            </span>
            <Button
              type="link"
              icon={isFullscreen ? 'fullscreen-exit' : 'fullscreen'}
              title={isFullscreen ? '最小化' : '最大化'}
              size={isFullscreen ? 'large' : 'default'}
              onClick={this.switchFullscreen}
            />
          </div>
        </div>
        <Spin
          wrapperClassName={styles.chart}
          spinning={loading.effects['archives/fetchCTGrecordData'] || false}
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
  isFullscreen: archives.isFullscreen,
  dataSource: archives.CTGData,
}))(CurveChart);
