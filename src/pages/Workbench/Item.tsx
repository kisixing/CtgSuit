import React, { useState } from 'react';
import { Card, Col, Button, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { Ctg as L } from '@lianmed/lmg';
import { mapStatusToColor, mapStatusToText } from '@/constant';
import Toolbar from './Toolbar';
import { event } from "@lianmed/utils";
import { BedStatus } from "@lianmed/lmg/lib/services/WsService";
import useItemAlarm from "./useItemAlarm";
import useFullScreen from "./useFullScreen";
import { FetalItem } from "./types";
let styles = require('./Item.less')


const WorkbenchItem = (props: FetalItem.IProps) => {
  const { fullScreenId, itemHeight, itemSpan, outPadding, data, bedname, isTodo, note, ismulti, status, unitId, ...others } = props;
  let { bedNO, GP, name, age, startTime, } = props

  const [cache, setCache] = useState<FetalItem.IItemTitle>({})
  const [so, setSo] = useState({ suit: null })
  const [ref, fullScreen] = useFullScreen(fullScreenId, unitId)
  const [alarmStatus] = useItemAlarm(so.suit)
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

  // item右上角icon
  const renderExtra = (bedname: string, status: number) => {
    return (
      <div className={styles.extra}>
        <span style={{ marginRight: '8px', color: '#fff' }}>{bedname}号</span>
        {
          <Tag color={alarmStatus ? '#f5222d' : mapStatusToColor[status]}>
            {alarmStatus ? alarmStatus : mapStatusToText[status]}
          </Tag>
        }
        <Button
          title="关闭监护窗口"
          icon="close"
          size="small"
          type="link"
          style={{ color: "#fff" }}
          onClick={() => {
            event.emit('bedClose', unitId, status, isTodo, note)
          }}
        ></Button>
      </div >
    );
  };

  // 床位信息
  const renderTilte = () => {
    const text = (
      <span>
        {
          [
            ['床号', bedNO],
            ['姓名', name],
            ['年龄', age],
            ['GP', GP],
            ['开始时间', startTime && moment(startTime).format('HH:mm')],
          ].map(([a, b]) => (<span key={a} style={{ marginRight: 12 }}>{a}：{b}</span>))
        }
      </span>
    )
    // 是否已经建档绑定孕册
    return (
      <Tooltip title={text}>
        {text}
      </Tooltip>
    );
  };

  return (
    <Col
      span={itemSpan}
      className={styles.col}
      ref={ref}
      style={{ padding: outPadding, height: itemHeight }}
    >
      <Card
        size="small"
        title={renderTilte()}
        className={styles.card}
        extra={renderExtra(bedname, status)}
        headStyle={{ background: 'var(--theme-color)', color: '#fff' }}
        bodyStyle={{ padding: 0, height: 'calc(100% - 38px)' }}
      >
        <L
          data={data}
          onReady={suit => setSo({ suit })}
          onDoubleClick={fullScreen}
          loading={spinning}
          showEcg={ismulti}
        ></L>
      </Card>
      <Toolbar
        name={name}
        age={age}
        bedname={bedname}
        status={status}
        startTime={startTime}
        isTodo={isTodo}
        suitObject={so}
        showLoading={setSpinning}
        unitId={unitId}
        {...others}
      />
    </Col>
  );
}
export default WorkbenchItem;
