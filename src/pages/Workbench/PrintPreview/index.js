/*
 * @Description: 打印modal
 * @Author: Zhong Jun
 * @Date: 2019-10-02 20:10:21
 */

import React, { Component } from 'react';
import { Modal } from 'antd';

import Setting from './Setting';
import Preview from './Preview';

import styles from './index.less';

class PrintPreview extends Component {
  render() {
    const { visible, onCancel, onCreate, dataSource } = this.props;
    return (
      <Modal
        getContainer={false}
        destroyOnClose
        centered
        width="92%"
        height="96%"
        visible={visible}
        title={`【${dataSource.index + 1}】 打印`}
        okText="创建"
        cancelText="取消"
        footer={null}
        bodyStyle={{ display: 'flex', flexDirection: 'column' }}
        wrapClassName={styles.modal}
        onCancel={() => onCancel('printVisible')}
        onOk={onCreate}
      >
        <div className={styles.top}>
          {/* <Setting /> */}
        </div>
        <div className={styles.bottom}>
          <Preview />
        </div>
      </Modal>
    );
  }
}

export default PrintPreview;
