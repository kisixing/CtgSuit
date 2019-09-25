import React from 'react';
import { Spin, Icon } from 'antd';

const antIcon = <Icon type="loading" style={{ fontSize: 48, fontWeight: 'blod' }} spin />;

export default function Loading() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '0',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Spin indicator={antIcon} />
    </div>
  );
}
