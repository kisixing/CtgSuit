/*
 * @Description: 产程图Partogram
 * @Author: Zhong Jun
 * @Date: 2019-10-02 20:25:10
 */

import React, { Component } from 'react';
import { Modal } from 'antd';
import modalStyles from './Partogram.less';
import { Partogram } from '@lianmed/lmg';
import { PartogramTable } from '@lianmed/components';
class C extends Component {
  render() {
    const { visible, onCancel, dataSource } = this.props;
    return (
      <Modal
        getContainer={false}
        destroyOnClose
        centered
        width="92%"
        height="96%"
        visible={visible}
        title={`【${dataSource.bedname}】 产程图`}
        okText="创建"
        cancelText="取消"
        footer={null}
        bodyStyle={{ paddingRight: '48px', background: '#fff' }}
        wrapClassName={modalStyles.modal}
        onCancel={onCancel}
      >
        <div style={{ height: 450 }}>
          <Partogram />
        </div>
        <PartogramTable
          url="/prenatal-visits"
          style={{ padding: '20px' }}
          id={dataSource.pregnancy && dataSource.pregnancy.id}
        />
      </Modal>
    );
  }
}

export default C;
