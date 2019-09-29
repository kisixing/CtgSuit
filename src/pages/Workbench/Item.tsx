import React, { useState } from 'react';
import L from '@lianmed/lmg';
import { Card, Col, Button } from 'antd';
import { connect } from 'react-redux';
import { mapStatusToColor } from '@/constant';
const Home = props => {
  const { index, name, age, itemHeight, outPadding, itemSpan, status } = props;
  const [showSetting, setShowSetting] = useState(false);

  return (
    <Col span={itemSpan} style={{ padding: outPadding, position: 'relative' }}>
      <div
        style={{
          background: '#fff',
          overflow: 'hidden',
          borderRadius: '2px',
          boxShadow: '#aaa 3px 3px 5px 1px',
          transition: 'all 0.2s ease-out',
          width: showSetting ? `calc(100% - 60px)` : 0,
          opacity: showSetting ? 1 : 0,
          position: 'absolute',
          bottom: 10,
          left: 10,
          zIndex: 10,
          height: 32,
        }}
      >
        <Button icon="setting" type="link"></Button>
        <Button icon="setting" type="link"></Button>
        <Button icon="setting" type="link"></Button>
        <Button icon="setting" type="link"></Button>
        <Button icon="setting" type="link"></Button>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          zIndex: 10,
          display: 'flex',
        }}
      >
        <Button
          icon={showSetting ? 'left' : 'right'}
          shape={showSetting ? 'circle' : null}
          style={{ boxShadow: '#aaa 3px 3px 5px 1px' }}
          type="primary"
          onClick={() => {
            setShowSetting(!showSetting);
          }}
        ></Button>
      </div>
      <Card
        title={
          <div>
            【{index + 1}】姓名：
            <span style={{ color: '#000' }}>{name}</span>
            <span style={{ margin: '0 10px' }} />
            年龄：
            <span style={{ color: '#000' }}>{age}</span>
          </div>
        }
        size="small"
        headStyle={{ background: mapStatusToColor[status], color: '#888' }}
        style={{
          border: '1px solid #aaa',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        extra={<Button style={{ color: '#fff' }} icon="close" size="small" type="link"></Button>}
        bodyStyle={{
          padding: 0,
          flex: 1,
          height: itemHeight,
        }}
      >
        <L data={null}></L>
      </Card>
    </Col>
  );
};

export default connect(({ setting, list }: any) => {
  return {
    listLayout: setting.listLayout,
  };
})(Home);
