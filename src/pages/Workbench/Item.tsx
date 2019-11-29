import React, { useState } from 'react';
import { Col } from 'antd';
import Toolbar from './Toolbar';
import { BedStatus } from "@lianmed/lmg/lib/services/WsService";
import useFullScreen from "./useFullScreen";
import { FetalItem } from "./types";
import { Ctg_Item } from "@lianmed/pages";
import { event } from "@lianmed/utils";

const WorkbenchItem = (props: FetalItem.IProps) => {
  const { fullScreenId, itemHeight, itemSpan, outPadding, data, bedname, isTodo, docid, ismulti, status, unitId, ...others } = props;
  let { bedNO, GP, name, age, startTime, } = props

  const [cache, setCache] = useState<FetalItem.IItemTitle>({})
  const [so, setSo] = useState({ suit: null })
  const [ref, fullScreen] = useFullScreen(fullScreenId, unitId)
  const [spinning, setSpinning] = useState(false);

  if (status === BedStatus.Stopped) {
    bedNO = cache.bedNO
    GP = cache.GP
    name = cache.name
    age = cache.age
    startTime = cache.startTime
  } else {
    bedNO !== cache.bedNO && name !== cache.name && setCache({ bedNO, GP, name, age, startTime, })
  }

  return (
    <Col
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
        startTime={startTime}
        name={name}
        age={age}
        status={status}
        bedname={bedname}

        isTodo={isTodo}
        suitObject={so}
        showLoading={setSpinning}
        unitId={unitId}
        docid={docid}
        
        {...others}
      />
    </Col >
  );
}
export default WorkbenchItem;
