import React from 'react';
import { Modal, Button } from 'antd';

export default function ModalConfirm({
  visible = false,
  title = "提示窗口",
  isCreated,
  isMonitor,
  onCancel = () => { },
  onOk = () => { }, // end事件，停止监护
  onCreate = () => { },
  bedname,
  isOffine
}) {


  // 放弃建档
  const handleOk = () => {
    onOk();
    onCancel();
  }

  let content: any = '';
  if (isMonitor) {
    content = isCreated ? (
      `确认子机: ${bedname} 停止监护 ?`
    ) : (
        <span>
          子机: {bedname} 即将停止监护，但还
        <span style={{ color: '#f00' }}>未建立档案</span>
          ，建档请选择“建档”按钮，放弃请选择“放弃”按钮 ?
      </span>
      );
  }
  if (isOffine) {
    content = isCreated ? (
      `确认子机: ${bedname} 停止监护 ?`
    ) : (
        <span>
          子机: {bedname} 即将停止监护，但还
        <span style={{ color: '#f00' }}>未建立档案</span>
          ，建档请选择“建档”按钮，放弃请选择“放弃”按钮 ?
      </span>
      );
  }
  // const content = isMonitor ? (
  //   isCreated ? (
  //     `确认子机: ${bedname} 停止监护 ?`
  //   ) : (
  //     <span>
  //       子机: {bedname} 即将停止监护，但还
  //       <span style={{ color: '#f00' }}>未建立档案</span>
  //       ，建档请选择“建档”按钮，放弃请选择“放弃”按钮 ?
  //     </span>
  //   )
  // ) : (
  //   `确认子机: ${bedname} 开始监护 ?`
  // );

  return (
    <Modal
      getContainer={false}
      centered
      destroyOnClose
      closable
      width={416}
      visible={visible}
      maskClosable={false}
      footer={null}
      okText="创建"
      cancelText="取消"
      onCancel={onCancel}
    >
      <div style={{
        fontSize: 16,
        fontWeight: 600,
        color: '#666',
        marginBottom: 12,
      }}>{title}</div>
      <div style={{ marginBottom: 12 }}>{content}</div>
      <div style={{ textAlign: 'right' }}>
        <Button style={{ marginLeft: 12 }} onClick={onCancel}>取消</Button>
        {isCreated ? <Button style={{ marginLeft: 12 }} type="primary" onClick={handleOk}>确定</Button> : <Button style={{ marginLeft: 12 }} onClick={handleOk}>放弃</Button>}
        {isCreated ? null : (<Button style={{ marginLeft: 12 }} type="primary" onClick={onCreate}>建档</Button>)}
      </div>
    </Modal>
  );
}
