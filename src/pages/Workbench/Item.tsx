import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Card, Col, Button, Tag, Tooltip } from 'antd';
import { Ctg as L } from '@lianmed/lmg';
import { mapStatusToColor, mapStatusToText } from '@/constant';
import Toolbar from './Toolbar';
import { event } from "@lianmed/utils";
let styles = require('./Item.less')
import { BedStatus } from "@lianmed/lmg/lib/services/WsService";
import { IDevice } from "@/models/list";
import { IRemain } from './useTodo';
interface IProps {
  dataSource: IDevice | IRemain;
  [x: string]: any
}
const WorkbenchItem = (props: IProps) => {
  // console.log('item render')
  const { dispatch, fullScreenId, itemHeight, itemSpan, dataSource, outPadding } = props;
  const { data, id } = dataSource;
  const [showSettingBar, setShowSettingBar] = useState(true);
  const ref = useRef(null)
  const suitObject = { suit: null };

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

  // item右上角icon
  const renderExtra = (status: React.ReactText) => {
    return (
      <div className={styles.extra}>
        {
          status !== void 0 && (
            <Tag color={mapStatusToColor[status]}>{mapStatusToText[status]}</Tag>
          )
        }
        <Button
          title="全屏展示"
          icon="close"
          size="small"
          type="link"
          style={{ color: "#fff" }}
          onClick={(
            () => {
              const s = status === BedStatus.Working
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
    const { bedname, data } = item;
    const havePregnancy = data && data.pregnancy
    const pregnancy = (typeof havePregnancy === 'object') ? havePregnancy : havePregnancy && JSON.parse(havePregnancy.replace(/'/g, '"'));
    // 处理“null”
    // Object.keys(pregnancy).forEach(key => {
    //   const value = pregnancy[key];
    //   if (value === 'null') {
    //     pregnancy[key] = '';
    //   }
    //   pregnancy[key] = value;
    // })
    const text = (
      <span className={styles.title}>
        床号: <span>{pregnancy && pregnancy.bedNO}</span>
        {/* 住院号: <span>{ pregnancy && pregnancy.inpatientNO}</span> */}
        姓名: <span>{pregnancy && pregnancy.name}</span>
        开始时间: <span>{data && data.starttime}</span>
        <span style={{ float: 'right' }}>{bedname}</span>
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
        extra={renderExtra(data && data.status)}
        headStyle={{ background: 'var(--theme-color)', color: '#fff' }}
        bodyStyle={{ padding: 0, height: 'calc(100% - 38px)' }}
      >
        <L data={data} showEcg={false} mutableSuitObject={suitObject} itemHeight={itemHeight} onDoubleClick={fullScreen}></L>
      </Card>
    </Col>
  );
}

export default WorkbenchItem;
