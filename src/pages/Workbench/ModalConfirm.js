import React from 'react';
import { Modal, Button } from 'antd';
import styles from './ModalConfirm.less';

export default function ModalConfirm({
  visible = false,
  title = "提示窗口",
  dataSource,
  isCreated,
  isMonitor,
  onCancel = () => {},
  onOk = () => {},
  onCreate = () => {}
}) {
  const { bedname, data } = dataSource;
  const havePregnancy = data && data.pregnancy;
  const pregnancy = havePregnancy && JSON.parse(data.pregnancy.replace(/'/g, '"'));
  const isCreate = pregnancy && pregnancy.id && data && data.pregnancy;
  const handleOk = () => {
    onOk(dataSource);
    onCancel('confirmVisible');
  }
  const content = isMonitor ? (
    isCreated ? (
      `确认床号: ${bedname} 停止监护 ?`
    ) : (
      <span>
        床号: {bedname} 即将停止监护，但还
        <span style={{ color: '#f00' }}>未建立档案</span>
        ，建档请选择“建档”按钮，放弃请选择“确定”按钮 ?
      </span>
    )
  ) : (
    `确认床号: ${bedname} 开始监护 ?`
  );

  return (
    <Modal
      getContainer={false}
      centered
      destroyOnClose
      closable
      width={416}
      visible={visible}
      maskClosable={false}
      title={title}
      footer={null}
      okText="创建"
      cancelText="取消"
      wrapClassName={styles.modalConfirm}
    >
      <div className={styles.title}>{title}</div>
      <div className={styles.content}>{content}</div>
      <div className={styles.buttons}>
        <Button onClick={() => onCancel('confirmVisible')}>取消</Button>
        {isCreate ? <Button type="primary" onClick={handleOk}>确定</Button> : <Button onClick={handleOk}>放弃</Button>}
        {isCreate ? null : (
          <Button type="primary" onClick={onCreate}>
            建档
          </Button>
        )}
      </div>
    </Modal>
  );
}
