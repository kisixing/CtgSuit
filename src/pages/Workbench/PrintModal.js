/*
 * @Description: 打印modal
 * @Author: Zhong Jun
 * @Date: 2019-10-02 20:10:21
 */

import React, { Component } from 'react';
import { Modal } from 'antd';
import modalStyles from './Analysis/index.less';
import styles from './PrintModal.less';

class PrintModal extends Component {
  render() {
     const { visible, onCancel, onCreate, dataSource } = this.props;
    return (
      <Modal
        centered
        width="92%"
        height="96%"
        visible={visible}
        title={`【${dataSource.index + 1}】 打印`}
        okText="创建"
        cancelText="取消"
        footer={null}
        bodyStyle={{ paddingRight: '48px' }}
        wrapClassName={modalStyles.modal}
        onCancel={() => onCancel('printVisible')}
        onOk={onCreate}
      ></Modal>
    );
  }
}

export default PrintModal;
