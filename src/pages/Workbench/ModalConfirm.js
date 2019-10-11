import React from 'react';
import { Modal, Button } from 'antd';
import styles from './ModalConfirm.less';

export default function ModalConfirm({
  visible = false,
  title = "提示窗口",
  content,
  dataSource,
  onCancel = () => {},
  onOk = () => {}
}) {
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
        <Button type="primary" onClick={() => onOk(dataSource)}>
          确认
        </Button>
      </div>
    </Modal>
  );
}
