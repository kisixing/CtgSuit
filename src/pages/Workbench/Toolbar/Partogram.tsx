import React, {  } from 'react';
import { Modal } from 'antd';
// import modalStyles from './Partogram.less';
import { Partogram } from '@lianmed/lmg';
import { PartogramTable } from '@lianmed/components';
const C = (props: any) => {
  const { visible, onCancel, bedname, pregnancyId } = props;
  return (
    <Modal
      getContainer={false}
      destroyOnClose
      centered
      width="92%"
      visible={visible}
      title={`【${bedname}】 产程图`}
      okText="创建"
      cancelText="取消"
      footer={null}
      bodyStyle={{ paddingRight: '48px', background: '#fff' }}
      // wrapClassName={modalStyles.modal}
      onCancel={onCancel}
    >
      <div style={{ height: 450 }}>
        <Partogram />
      </div>
      <PartogramTable
        url="/prenatal-visits"
        style={{ padding: '20px' }}
        id={pregnancyId}
      />
    </Modal>
  );
}

export default C;
