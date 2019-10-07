/*
 * @Description: 产程图Partogram
 * @Author: Zhong Jun
 * @Date: 2019-10-02 20:25:10
 */

import React, { Component } from 'react';
import { Modal } from 'antd';
import modalStyles from './Analysis/index.less';
import { Partogram } from '@lianmed/lmg';
import { PartogramTable } from '@lianmed/components';
class C extends Component {
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
        title={`【${dataSource.index + 1}】 产程图`}
        okText="创建"
        cancelText="取消"
        footer={null}
        onOk={onCreate}
        bodyStyle={{ paddingRight: '48px', background: '#fff' }}
        wrapClassName={modalStyles.modal}
        onCancel={() => onCancel('partogramVisible')}
      >
        <div style={{ height: 450 }}>
          
          <Partogram />
        </div>
        <PartogramTable url="/prenatal-visits" style={{ padding: '20px' }} id="1" />
      </Modal>
    );
  }
}

export default C;
