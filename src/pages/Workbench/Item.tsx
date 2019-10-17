import React, { useRef, useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Card, Col, Button, Tag, Tooltip } from 'antd';
import { Ctg as L } from '@lianmed/lmg';
import { mapStatusToColor, mapStatusToText } from '@/constant';
import Toolbar from './Toolbar';
import { event } from "@lianmed/utils";
let styles = require('./Item.less')
import { BedStatus } from "@lianmed/lmg/lib/services/WsService";

const WorkbenchItem = props => {
  // console.log('item render')
  const { dispatch, fullScreenId, itemHeight, itemSpan, dataSource, outPadding } = props;
  const { data, unitId, status } = dataSource;
  const [showSettingBar, setShowSettingBar] = useState(true);
  const [showTitle, setShowTitle] = useState(true)
  const ref = useRef(null)
  const suitObject = { suit: null };
  console.log('list item', dataSource);

  const fullScreen = () => {
    const el = ReactDOM.findDOMNode(ref.current);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen();
    }
  }


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
                const cb = () => {
                  dispatch({
                    type: 'list/removeDirty', unitId
                  })
                }
                s ? event.emit(`bedClose:${unitId}`, cb) : cb()
              }
            }
          )()}
        ></Button>
      </div>
    );
  };

  // 床位信息
  const renderTilte = (item) => {
    const { data, pregnancy, documentno, bedname } = item;
    const isCreated = pregnancy && pregnancy.id && data && documentno === data.docid && showTitle;
    const text = (
      <span className={styles.title}>
        床号: <span>{bedname}</span>
        住院号: <span>{isCreated ? pregnancy.inpatientNO : ''}</span>
        姓名: <span>{isCreated ? pregnancy.name : ''}</span>
        开始时间: <span>{data && data.starttime}</span>
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
      <Toolbar {...props} showSettingBar={showSettingBar} setShowTitle={setShowTitle} />
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
