import React, { useRef, useCallback, useEffect,useState } from 'react';
import ReactDOM from 'react-dom';
import { Card, Col, Button, Tag } from 'antd';
import { Ctg as L } from '@lianmed/lmg';
import { mapStatusToColor, mapStatusToText } from '@/constant';
let styles = require('./Item.less')
import Toolbar from './Toolbar'
const WorkbenchItem = props => {
  const { dispatch, fullScreenId, itemHeight, itemSpan, dataSource, outPadding, } = props;
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
  const renderExtra = status => {
    return (
      <div className={styles.extra}>
        <Tag color={mapStatusToColor[status]}>{mapStatusToText[status]}</Tag>
        <Button
          title="全屏展示"
          icon="fullscreen"
          size="small"
          type="link"
          onClick={fullScreen.bind(this)}
        ></Button>
      </div>
    );
  };

  const renderTilte = item => {
    return (
      <div className={styles.title}>
        床号: <span>{item.bedname}</span>
        住院号: <span>{item.documentno}</span>
        姓名: <span>{item.bedname}</span>
        开始时间: <span>{new Date(item.updateTime).toLocaleDateString()}</span>
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
      onMouseOver={()=>{
        setShowSettingBar(true)
      }}
      onMouseOut={()=>{
        setShowSettingBar(false)
      }}
    >
      <Toolbar {...props} showSettingBar={showSettingBar}/>
      <Card
        title={renderTilte(dataSource)}
        size="small"
        className={styles.card}
        extra={renderExtra(dataSource.status)}
        bodyStyle={{ padding: 0, height: 'calc(100% - 40px)' }}
      >
        <L data={data} mutableSuitObject={suitObject} itemHeight={itemHeight}></L>
      </Card>
    </Col>
  );
}

export default WorkbenchItem