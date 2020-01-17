import React, { useState } from 'react';
import { Col } from 'antd';
import Toolbar from './Toolbar/index';
import { BedStatus } from "@lianmed/lmg/lib/services/WsService";
import useFullScreen from "./useFullScreen";
import { FetalItem } from "./types";
import { Ctg_Item } from "@lianmed/pages";
import { event } from "@lianmed/utils";
const styles = require('./Toolbar/Toolbar.less')
const WorkbenchItem = (props: FetalItem.IProps) => {
  const { fullScreenId, activeId, itemHeight, itemSpan, outPadding, data, bedname, isTodo, docid, ismulti, status, unitId, isOn, ...others } = props;
  let { startTime, pregnancy } = props

  const [so, setSo] = useState({ suit: null })
  const [ref, fullScreen] = useFullScreen(fullScreenId, unitId, activeId)
  const [spinning, setSpinning] = useState(false);

  let w: any = window
  const k = `spinfo_${unitId}`
  const c = w[k] || (w[k] = {})
  if ([BedStatus.Stopped, BedStatus.OfflineStopped].includes(status)) {
    startTime = c.startTime
    pregnancy = c.pregnancy || {}
  } else {
    Object.assign(c, { pregnancy: { ...pregnancy, pvId: null }, startTime })
  }


  return (
    <Col
      className={styles.col}
      span={itemSpan}
      ref={ref}
      style={{ padding: outPadding, height: itemHeight, background: `var(--theme-light-color)`, position: 'relative' }}
    >
      <Ctg_Item
        themeColor='var(--theme-color)'
        startTime={startTime}
        name={pregnancy.name}
        age={pregnancy.age as any}
        bedname={bedname}
        status={isOn ? status : null}
        data={data}
        onDoubleClick={fullScreen}
        loading={spinning}
        bedNO={pregnancy.bedNO}
        GP={pregnancy.GP}
        gestationalWeek={pregnancy.gestationalWeek}
        onSuitRead={suit => setSo({ suit })}
        onClose={() => { event.emit('bedClose', unitId, status, isTodo, docid) }}
      />
      <Toolbar
        {...others}

        startTime={startTime}


        status={status}
        bedname={bedname}

        isTodo={isTodo}
        suitObject={so}
        showLoading={setSpinning}
        unitId={unitId}
        docid={docid}
        pregnancy={pregnancy}
      />
    </Col >
  );
}
export default WorkbenchItem;
