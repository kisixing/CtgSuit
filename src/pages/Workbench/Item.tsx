import React, { useState } from 'react';
import L from '@lianmed/lmg';
import { Card, Col, Button } from 'antd';
import { connect } from 'react-redux';
import { mapStatusToColor, mapStatusToText } from '@/constant';
import Link from 'umi/link';

const Home = props => {
  const { index, name, age, itemHeight, outPadding, itemSpan, status } = props;
  const [showSetting, setShowSetting] = useState(false);
  const floatPadding = outPadding + 10;
  return (
    <Col span={itemSpan} style={{ padding: outPadding, position: 'relative' }}>
      <div
        style={{
          background: '#fff',
          overflow: 'hidden',
          borderRadius: '2px',
          boxShadow: '#aaa 3px 3px 5px 1px',
          transition: 'all 0.2s ease-out',
          width: showSetting ? `calc(100% - ${2 * floatPadding + 40}px )` : 0,
          opacity: showSetting ? 1 : 0,
          position: 'absolute',
          bottom: floatPadding,
          left: floatPadding,
          zIndex: 10,
          height: 32,
        }}
      >
        <Button icon="setting" type="link"></Button>
        <Button icon="setting" type="link"></Button>
        <Button icon="setting" type="link"></Button>
        <Button icon="setting" type="link"></Button>
        <Link to="">
          <Button icon="user-add" type="link">
            建档
          </Button>
        </Link>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: floatPadding,
          right: floatPadding,
          zIndex: 10,
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
        headStyle={{ background: '#fff', color: '#888' }}
        style={{
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        extra={
          <Button
            size="small"
            style={{ background: mapStatusToColor[status], color: '#fff', border: 0 }}
          >
            {mapStatusToText[status]}
          </Button>
        }
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
