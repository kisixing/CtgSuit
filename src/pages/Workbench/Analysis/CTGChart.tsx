import React, { useEffect, useState } from 'react';
import { Context } from './index';
import { Ctg as L } from '@lianmed/lmg';
import { event } from '@lianmed/utils'
import request from "@lianmed/request";
const CTGChart = (props: { docid: string }) => {
  const { docid } = props;

  const [ctgData, setCtgData] = useState(null)
  useEffect(() => {
    request.get(`/ctg-exams-data/${docid}`).then(res => {
      setCtgData({ docid, ...res })
    })
  }, [])

  useEffect(() => {
    const fn = data => {
      setCtgData({ ...ctgData, ...data })
    }
    event.on('analysis:setCtgData', fn)
    return () => {
      event.off('analysis:setCtgData', fn)
    }
  }, [ctgData])


  return (
    <Context.Consumer>
      {(value: any) => {
        return (

          <L suitType={2} data={ctgData} mutableSuitObject={value} />
        )
      }}
    </Context.Consumer>
  );
}

export default CTGChart
