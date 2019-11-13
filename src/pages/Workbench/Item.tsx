import React, { useMemo, useState } from 'react';
import { Card, Col, Button, Tag, Tooltip, Spin } from 'antd';
import moment from 'moment';
import { Ctg as L } from '@lianmed/lmg';
import { mapStatusToColor, mapStatusToText } from '@/constant';
import Toolbar from './Toolbar';
import { event } from "@lianmed/utils";
import { BedStatus } from "@lianmed/lmg/lib/services/WsService";
import { IDevice } from "@/models/list";
import { IRemain } from './useTodo';
import { Suit } from '@lianmed/lmg/lib/Ctg/Suit';
import useItemAlarm from "./useItemAlarm";
import useFullScreen from "./useFullScreen";
let styles = require('./Item.less')

interface IProps {
  dataSource: IDevice | IRemain;
  [x: string]: any
}
const WorkbenchItem = (props: IProps) => {
  const { dispatch, fullScreenId, itemHeight, itemSpan, dataSource, outPadding } = props;
  const { data, bedname } = dataSource;
  const { unitId } = (dataSource as IDevice)
  const { isTodo, note } = (dataSource as IRemain)
  const suitObject = useMemo<{ suit: Suit }>(() => {
    return { suit: null }
  }, [])

  const [ref, fullScreen] = useFullScreen(fullScreenId, unitId, dispatch)
  const [alarmStatus] = useItemAlarm(suitObject.suit)

  // set loading
  const [spinning, setSpinning] = useState(false);

  // TODO 停止状态下没有孕册信息返回，监护窗口header 暂时处理方案
  // 保存建档孕册信息 1/运行  2/停止 3/离线
  const { status, pregnancy } = data;
  const b = sessionStorage.getItem('bed');
  let bed = b ? JSON.parse(b) : {};
  if (status !== 2) {
    // 停止监护
    bed[bedname] = pregnancy;
    const bedString = JSON.stringify(bed); // JSON.parse(str)
    sessionStorage.setItem('bed', bedString);
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
          onClick={(
            () => {
              return () => {
                if (isTodo) {
                  event.emit('todo:discard', note)
                } else {
                  const cb = () => {
                    dispatch({
                      type: 'list/removeDirty', unitId
                    })
                  }
                  status === BedStatus.Stopped ? cb() : (
                    event.emit(`bedClose:${unitId}`, cb)
                  )
                }
              }
            }
          )()}
        ></Button>
      </div>
    );
  };

  // 床位信息
  const renderTilte = item => {
    const { data = {}, bedname } = item;
    const havePregnancy = data && data.pregnancy;
    const pregnancy = (typeof havePregnancy === 'object')
      ? havePregnancy
      : havePregnancy && JSON.parse(havePregnancy.replace(/'/g, '"'));
    // TODO 根据是否建档判断是否显示
    // const isCreated = havePregnancy && pregnancy.id;
    const { status } = data;
    let dd = pregnancy || {};
    if (status === 2) {
      const bed = JSON.parse(sessionStorage.getItem('bed'));
      dd = bed[bedname] ? JSON.parse(bed[bedname]) : {};
      // console.log('66666666666666', dd)
    }
    const text = (
      <span className={styles.tooltipTitle}>
        床号: <span>{dd.bedNO}</span>
        {/* 住院号: <span>{dd.inpatientNO}</span> */}
        姓名: <span>{dd.name}</span>
        年龄：<span>{dd.age}</span>
        GP：<span>{dd.GP}</span>
        开始时间: <span>{data.starttime && moment(data.starttime).format('HH:mm')}</span>
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
        title={renderTilte(dataSource)}
        className={styles.card}
        extra={renderExtra(bedname, data.status)}
        headStyle={{ background: 'var(--theme-color)', color: '#fff' }}
        bodyStyle={{ padding: 0, height: 'calc(100% - 38px)' }}
      >
        <L
          data={data}
          mutableSuitObject={suitObject}
          itemHeight={itemHeight}
          onDoubleClick={fullScreen}
          loading={spinning}
          showEcg={dataSource.type === 'k9'}
        ></L>
      </Card>
      <Toolbar {...props} showSettingBar={true} showLoading={setSpinning} />
    </Col>
  );
}
export default WorkbenchItem;
