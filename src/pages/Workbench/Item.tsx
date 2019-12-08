import React, { useState } from 'react';
import { Col } from 'antd';
import Toolbar from './Toolbar';
import { BedStatus } from "@lianmed/lmg/lib/services/WsService";
import useFullScreen from "./useFullScreen";
import { FetalItem } from "./types";
import { Ctg_Item } from "@lianmed/pages";
import { event } from "@lianmed/utils";
const styles = require('./Toolbar.less')
const WorkbenchItem = (props: FetalItem.IProps) => {
  const { fullScreenId, activeId, itemHeight, itemSpan, outPadding, data, bedname, isTodo, docid, ismulti, status, unitId, ...others } = props;
  let { bedNO, GP, name, age, startTime, pregnancyId } = props

  // const [cache, setCache] = useState<FetalItem.IItemTitle>({})
  const [so, setSo] = useState({ suit: null })
  const [ref, fullScreen] = useFullScreen(fullScreenId, unitId, activeId)
  const [spinning, setSpinning] = useState(false);

  let w: any = window
  const k = `spinfo_${unitId}`
  const c = w[k] || (w[k] = {})
  if ([BedStatus.Stopped, BedStatus.OfflineStopped].includes(status)) {
    bedNO = c.bedNO
    GP = c.GP
    name = c.name
    age = c.age
    startTime = c.startTime
    pregnancyId = c.pregnancyId
  } else {
    bedNO !== c.bedNO && pregnancyId !== c.pregnancyId && Object.assign(c, { bedNO, GP, name, age, startTime, pregnancyId })
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
        name={name}
        age={age}
        bedname={bedname}

        data={data}
        onDoubleClick={fullScreen}
        loading={spinning}
        bedNO={bedNO}
        GP={GP}
        onSuitRead={suit => setSo({ suit })}
        onClose={() => { event.emit('bedClose', unitId, status, isTodo, docid) }}
      />
      <Toolbar
        {...others}

        startTime={startTime}
        name={name}
        age={age}
        status={status}
        bedname={bedname}
        pregnancyId={pregnancyId}
        isTodo={isTodo}
        suitObject={so}
        showLoading={setSpinning}
        unitId={unitId}
        docid={docid}

      />
    </Col >
  );
}
export default WorkbenchItem;
