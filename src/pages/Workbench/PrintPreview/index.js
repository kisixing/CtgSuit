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
  renderTitle = (data) => {
    return (
      <div className={styles.modalTitle}>
        <span>【${data.bedname}】 打印</span>
        <span>住院号：{data.pregnancy && data.pregnancy.inpatientNO}</span>
        <span>姓名：{data.pregnancy && data.pregnancy.name}</span>
        <span>年龄：{data.pregnancy && data.pregnancy.age}</span>
      </div>
    );
  }
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
        title={this.renderTitle(dataSource)}
        okText="创建"
        cancelText="取消"
        footer={null}
        bodyStyle={{ display: 'flex', flexDirection: 'column' }}
        wrapClassName={styles.modal}
        onCancel={() => onCancel('printVisible')}
        onOk={onCreate}
      >
        <div className={styles.top}>
          <Setting dataSource={dataSource} />
        </div>
        <div className={styles.bottom}>
          <Preview dataSource={dataSource} />
        </div>
      </Modal>
    );
  }
}

export default PrintPreview;
