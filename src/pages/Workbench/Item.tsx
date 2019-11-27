import React, { useState } from 'react';
import { Card, Col, Button, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { Ctg as L } from '@lianmed/lmg';
import { mapStatusToColor, mapStatusToText } from '@/constant';
import Toolbar from './Toolbar';
import { event } from "@lianmed/utils";
import { BedStatus, ICacheItem } from "@lianmed/lmg/lib/services/WsService";
import { IBed, IPregnancy, IPrenatalVisit } from "@/types";
import { IRemain } from './useTodo';
import useItemAlarm from "./useItemAlarm";
import useFullScreen from "./useFullScreen";
let styles = require('./Item.less')

interface IProps {
  data: ICacheItem
  bedname: string
  unitId: string
  isTodo: boolean
  note: string
  ismulti: boolean
  inpatientNO: string
  name: string
  age: number
  gestationalWeek: string
  deviceno: string
  bedNO: string
  docid: string
  status: BedStatus
  pregnancyId: number
  index: any
  startTime: string
  outPadding: number
  fullScreenId: string
  itemHeight: number
  itemSpan: number
  GP: string
}
const WorkbenchItem = (props: IProps) => {
  const {
    fullScreenId,
    itemHeight,
    itemSpan,
    outPadding,
    data,
    bedname,
    unitId,
    isTodo,
    note,
    ismulti,
    docid,
    deviceno,
    index,
    pregnancyId,
    status,
    startTime,
    gestationalWeek,
    name,
    age,
    inpatientNO,
    GP,
    bedNO
  } = props;

  // let safeP = pregnancy || { name: null, age: null, inpatientNO: null, GP: '/', bedNO: null, id: null }



  // if (status === 2) {
  //   const bed = JSON.parse(sessionStorage.getItem('bed'));
  //   bed[bedname] && (safeP = bed[bedname])
  // }


  // const { name, age, inpatientNO, GP, bedNO } = safeP

  // let safePv = prenatalVisit || { gestationalWeek: null, ctgexam: { startTime: null } }


  const [so, setSo] = useState({ suit: null })
  const [ref, fullScreen] = useFullScreen(fullScreenId, unitId)
  const [alarmStatus] = useItemAlarm(so.suit)

  // set loading
  const [spinning, setSpinning] = useState(false);

  // TODO 停止状态下没有孕册信息返回，监护窗口header 暂时处理方案
  // 保存建档孕册信息 1/运行  2/停止 3/离线
  const b = sessionStorage.getItem('bed');
  let bed = b ? JSON.parse(b) : {};
  // if (status !== 2) {
  //   // 停止监护
  //   bed[bedname] = pregnancy;
  //   const bedString = JSON.stringify(bed); // JSON.parse(str)
  //   sessionStorage.setItem('bed', bedString);
  // }

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
          onClick={
            () => {
              event.emit('bedClose', unitId, status, isTodo, note)
            }
          }
        ></Button>
      </div >
    );
  };

  // 床位信息
  const renderTilte = () => {
    // console.log('pregnancy', pregnancy)
    // TODO 根据是否建档判断是否显示
    // const isCreated = havePregnancy && pregnancy.id;

    const text = (
      <span className={styles.tooltipTitle}>
        床号: <span>{bedNO}</span>
        {/* 住院号: <span>{dd.inpatientNO}</span> */}
        姓名: <span>{name}</span>
        年龄：<span>{age}</span>
        GP：<span>{GP}</span>
        开始时间: <span>{startTime && moment(startTime).format('HH:mm')}</span>
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
        // loading={spinning}
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
        inpatientNO={inpatientNO}
        name={name}
        age={age}
        gestationalWeek={gestationalWeek}
        unitId={unitId}
        bedname={bedname}
        deviceno={deviceno}
        bedNO={bedNO}
        docid={docid}
        status={status}
        pregnancyId={pregnancyId}
        index={index}
        startTime={startTime}
        isTodo={isTodo}

        suitObject={so}
        showLoading={setSpinning}
      />
    </Col>
  );
}
export default WorkbenchItem;
