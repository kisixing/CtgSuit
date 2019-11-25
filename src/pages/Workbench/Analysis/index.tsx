import React from 'react';
import { Modal } from 'antd';

import moment from 'moment';

import { Ctg_Analyse } from "@lianmed/pages";

export const Context = React.createContext({});
function Analysis({
  visible,
  onCancel,
  onCreate,
  dataSource,
  docid = '',
}) {
  return (
    <Modal
      maskClosable={false}
      getContainer={false}
      destroyOnClose
      centered
      width="92%"
      footer={
        null
      }
      bodyStyle={{ height: "80vh" }}
      visible={visible}
      title={
        <div >
          <span>档案号：{(dataSource.ctgexam && dataSource.ctgexam.note) || dataSource.documentno}</span>
          <span>住院号：{(dataSource.pregnancy && dataSource.pregnancy.inpatientNO)}</span>
          <span>姓名：{dataSource.pregnancy && dataSource.pregnancy.name}</span>
          <span>年龄：{dataSource.pregnancy && dataSource.pregnancy.age}</span>
          <span>孕周： {dataSource.gestationalWeek}</span>
          <span>
            监护日期：
            {dataSource.ctgexam &&
              dataSource.ctgexam.startTime &&
              moment(dataSource.ctgexam.startTime).format('YYYY-MM-DD HH:mm:ss')}
            {/* {dataSource.data && dataSource.data.startTime && moment(dataSource.data.startTime).format('YYYY-MM-DD HH:mm:ss')} */}
          </span>
        </div>
      }
      okText="创建"
      cancelText="取消"
      onCancel={() => onCancel('analysisVisible')}
      onOk={onCreate}
    // bodyStyle={{background:'#f1f1f1'}}
    // wrapClassName={styles.modal}
    >
      <Ctg_Analyse docid={docid} />
    </Modal>
  );
}

export default Analysis;
