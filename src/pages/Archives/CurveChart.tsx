import React, { } from 'react';
import { connect } from 'dva';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Spin, Button } from 'antd';
import moment from 'moment';
import classnames from 'classnames';
import { Ctg as L } from '@lianmed/lmg';

import styles from './CurveChart.less';

const CurveChart = (props) => {
  const {
    selected: { ctgexam },
    dataSource,
    loading,
    isFullscreen,
    dispatch
  } = props;

  const switchFullscreen = () => {

    dispatch({
      type: 'archives/updateState',
      payload: {
        isFullscreen: !isFullscreen,
      },
    });
  };


  // ctgexam && (ctgexam.audios = ['21_1_200524155151_1'])
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
            <span style={{ display: 'inline-block', fontWeight: 600, marginRight: '24px' }}>
            {ctgexam && ctgexam.startTime && moment(ctgexam.startTime).format('YYYY-MM-DD HH:mm:ss')}
            {' ~ '}
            {ctgexam && ctgexam.endTime && moment(ctgexam.endTime).format('YYYY-MM-DD HH:mm:ss')}
          </span>
          <Button
            type="link"
            icon={<LegacyIcon type={isFullscreen ? 'fullscreen-exit' : 'fullscreen'} />}
            title={isFullscreen ? '最小化' : '最大化'}
            size={isFullscreen ? 'large' : 'middle'}
            onClick={switchFullscreen}
          />
        </div>
      </div>
      <Spin
        wrapperClassName={styles.chart}
        spinning={loading.effects['archives/fetchCTGrecordData'] || false}
      >
        <L audios={(ctgexam && ctgexam.audios && ctgexam.audios.length) ? ctgexam.audios : null} suitType={1} data={dataSource}></L>
      </Spin>
    </div>
  );
}

export default connect(({ loading, archives }: any) => ({
  loading: loading,
  selected: archives.current,
  isFullscreen: archives.isFullscreen,
  dataSource: archives.CTGData,
}))(CurveChart);
