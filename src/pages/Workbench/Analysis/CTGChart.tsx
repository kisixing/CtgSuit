import React, { useEffect, useState } from 'react';
import { Context } from './index';
import { Spin } from 'antd';
import { Ctg as L } from '@lianmed/lmg';

import request from "@lianmed/request";
const styles = require('./index.less')
const CTGChart = props => {
  const { docid, } = props;

  const [ctgData, setCtgData] = useState(null)

  useEffect(() => {
    request.get(`/ctg-exams-data/${docid}`).then(res => {
      setCtgData({ docid, ...res })
    })

  }, [])



  return (
    <Context.Consumer>
      {(value: any) => {
        return (
          <Spin
            wrapperClassName={styles.spinWrapper}
            // spinning={
            //   loading.effects['item/fetchCTGData'] || loading.effects['archives/fetchCTGrecordData']
            // }
            spinning={!ctgData}
          >
            <L suitType={2} data={ctgData} mutableSuitObject={value}></L>
          </Spin>
        )
      }}
    </Context.Consumer>
  );
}

export default CTGChart
