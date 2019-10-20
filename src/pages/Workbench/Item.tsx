import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Card, Col, Button, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { Ctg as L } from '@lianmed/lmg';
import { mapStatusToColor, mapStatusToText } from '@/constant';
import Toolbar from './Toolbar';
import { event } from "@lianmed/utils";
let styles = require('./Item.less')
import { BedStatus } from "@lianmed/lmg/lib/services/WsService";
import { IDevice } from "@/models/list";
import { IRemain } from './useTodo';
import { Suit } from '@lianmed/lmg/lib/Ctg/Suit';
interface IProps {
  dataSource: IDevice | IRemain;
  [x: string]: any
}
const WorkbenchItem = (props: IProps) => {
  // console.log('item render')
  const { dispatch, fullScreenId, itemHeight, itemSpan, dataSource, outPadding } = props;
  const { data, bedname, id } = dataSource;
  const [showSettingBar, setShowSettingBar] = useState(true);
  const ref = useRef(null)
  const suitObject: { suit: Suit } = { suit: null };

  const fullScreen = () => {
    const el = ReactDOM.findDOMNode(ref.current);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen();
    }
  }
  const unitId = (dataSource as IDevice).unitId
  const { isTodo, note } = (dataSource as IRemain)

  const testAlarm = useMemo(() => {
    let f = true
    return () => {
      suitObject.suit[f ? 'alarmOn' : 'alarmOff']('zzz')
      f = !f
    }
  }, [suitObject.suit])

  // item右上角icon
  const renderExtra = (bedname: string, status: number) => {
    return (
      <div className={styles.extra}>
        <span style={{ marginRight: '8px', color: '#fff' }}>{bedname}号</span>
        {
          status !== void 0 && (
            <Tag onClick={testAlarm} color={mapStatusToColor[status]}>{mapStatusToText[status]}</Tag>
          )
        }
        <Button
          title="关闭监护窗口"
          icon="close"
          size="small"
          type="link"
          style={{ color: "#fff" }}
          onClick={(
            () => {
              const s = [BedStatus.Working,BedStatus.Offline].includes(status)
              return () => {
                if (isTodo) {
                  event.emit('todo:discard', note)
                } else {
                  const cb = () => {
                    dispatch({
                      type: 'list/removeDirty', unitId
                    })
                  }
                  s ? event.emit(`bedClose:${unitId}`, cb) : cb()
                }
              }
            }
          )()}
        ></Button>
      </div>
    );
  };

  // 床位信息
  const renderTilte = (item) => {
    const { bedname, data = {} } = item;
    const havePregnancy = data && data.pregnancy
    const pregnancy = (typeof havePregnancy === 'object') ? havePregnancy : havePregnancy && JSON.parse(havePregnancy.replace(/'/g, '"')) || {};
    const text = (
      <span className={styles.title}>
        床号: <span>{pregnancy.bedNO}</span>
        {/* 住院号: <span>{ pregnancy && pregnancy.inpatientNO}</span> */}
        姓名: <span>{pregnancy.name}</span>
        年龄：<span>{pregnancy.age}</span>
        GP：<span>{pregnancy.GP}</span>
        开始时间: <span>{data.starttime && moment(data.starttime).format('HH:mm')}</span>
        {/* <span style={{ float: 'right', marginRight: '5px' }}>{bedname}号</span> */}
      </span>
    )
    // 是否已经建档绑定孕册
    return (
      <Tooltip title={text}>
        {text}
      </Tooltip>
    );
  };

  useEffect(() => {
    if (fullScreenId === unitId) {
      fullScreen();
      dispatch({ type: 'list/setState', payload: { fullScreenId: null } });
    }
    return () => {
    };
  }, [fullScreenId])
  // console.log('zzzzzzz', data)
  return (
    <Col
      span={itemSpan}
      className={styles.col}
      ref={ref}
      style={{ padding: outPadding, height: itemHeight }}
      onMouseOver={e => {
        if (e.target === ref.current) {
          showSettingBar || setShowSettingBar(true)
        }
      }}
      onMouseOut={e => {
        if (e.target === ref.current) {
          showSettingBar && setShowSettingBar(false)
        }
      }}
    >
      <Toolbar {...props} showSettingBar={showSettingBar} />
      <Card
        title={renderTilte(dataSource)}
        size="small"
        className={styles.card}
        extra={renderExtra(bedname, data.status)}
        headStyle={{ background: 'var(--theme-color)', color: '#fff' }}
        bodyStyle={{ padding: 0, height: 'calc(100% - 38px)' }}
      >
        <L data={data} showEcg={false} mutableSuitObject={suitObject} itemHeight={itemHeight} onDoubleClick={fullScreen}></L>
      </Card>
    </Col>
  );
}

export default WorkbenchItem;
