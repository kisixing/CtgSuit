import React, { useRef, useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Card, Col, Button, Tag } from 'antd';
import { Ctg as L } from '@lianmed/lmg';
import { mapStatusToColor, mapStatusToText } from '@/constant';
import Toolbar from './Toolbar';

let styles = require('./Item.less')

const WorkbenchItem = props => {
  console.log('renderItem')
  const { dispatch, fullScreenId, itemHeight, itemSpan, dataSource, outPadding } = props;
  const { data, unitId } = dataSource;
  const [showSettingBar, setShowSettingBar] = useState(false)
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

  const fullScreenEvent = useCallback(() => { suitObject.suit.resize(); }, [suitObject.suit])

  // item右上角icon
  const renderExtra = (status: React.ReactText) => {
    return (
      <div className={styles.extra}>
        <Tag color={mapStatusToColor[status]}>{mapStatusToText[status]}</Tag>
        <Button
          title="全屏展示"
          icon="fullscreen"
          size="small"
          type="link"
          style={{ color: "#fff" }}
          onClick={fullScreen.bind(this)}
        ></Button>
      </div>
    );
  };

  // 床位信息
  const renderTilte = (item) => {
    const { data, pregnancy, documentno, bedname } = item;
    // 是否已经建档绑定孕册
    const isCreated = pregnancy && pregnancy.id && data // && documentno === data.docid;
    return (
      <div className={styles.title}>
        床号: <span>{bedname}</span>
        住院号: <span>{isCreated ? pregnancy.inpatientNO : ''}</span>
        姓名: <span>{isCreated ? pregnancy.name : ''}</span>
        开始时间: <span>{data && data.starttime}</span>
      </div>
    );
  };

  useEffect(() => {
    if (fullScreenId === unitId) {
      fullScreen();
      dispatch({ type: 'list/setState', payload: { fullScreenId: null } });
    }
    document.addEventListener('fullscreenchange', fullScreenEvent);
    return () => {
      document.removeEventListener('fullscreenchange', fullScreenEvent);
    };
  }, [fullScreenId])

  return (
    <Col
      span={itemSpan}
      className={styles.col}
      ref={ref}
      style={{ padding: outPadding, height: itemHeight }}
      onMouseOver={() => {
        showSettingBar || setShowSettingBar(true)
      }}
      onMouseOut={() => {
        showSettingBar && setShowSettingBar(false)
      }}
    >
      <Toolbar {...props} showSettingBar={showSettingBar} />
      <Card
        title={renderTilte(dataSource)}
        size="small"
        className={styles.card}
        extra={renderExtra(dataSource.status)}
        headStyle={{ background: '#004c8c', color: '#fff' }}
        bodyStyle={{ padding: 0, height: 'calc(100% - 40px)' }}
      >
        <L data={data} mutableSuitObject={suitObject} itemHeight={itemHeight}></L>
      </Card>
    </Col>
  );
}

export default WorkbenchItem;
