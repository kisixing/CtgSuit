/*
 * @Description: 打印modal
 * @Author: Zhong Jun
 * @Date: 2019-10-02 20:10:21
 */

import React, { useMemo } from 'react';
import { Modal } from 'antd';
import Setting from './Setting';
import Preview from './Preview';
import styles from './index.less';
import moment from 'moment';

export const Context = React.createContext({})

const PrintPreview = (props) => {
  const renderTitle = (from, data) => {
    if (from !== 'archives') {
      const d = data.data;
      // console.log('TCL -----------', d);
      const havePregnancy = d && d.pregnancy;
      const p =
        typeof havePregnancy === 'object'
          ? havePregnancy
          : havePregnancy && JSON.parse(d.pregnancy.replace(/'/g, '"'));
      // console.log('TCL -----------', d, p);
      return (
        <div className={styles.modalTitle}>
          <span>档案号：{data.documentno}</span>
          <span>住院号：{p.inpatientNO}</span>
          <span>姓名：{p.name}</span>
          <span>年龄：{p.age}</span>
          <span>孕周： {data.gestationalWeek}</span>
          {/* <span>
            监护日期：
            {d && d.startTime && moment(d.startTime).format('YYYY-MM-DD HH:mm:ss')}
          </span> */}
        </div>
      );
    }
    return (
      <div className={styles.modalTitle}>
        <span>档案号：{(data.ctgexam && data.ctgexam.note) || data.documentno}</span>
        <span>住院号：{(data.pregnancy && data.pregnancy.inpatientNO)}</span>
        <span>姓名：{data.pregnancy && data.pregnancy.name}</span>
        <span>年龄：{data.pregnancy && data.pregnancy.age}</span>
        <span>孕周： {data.gestationalWeek}</span>
        <span>
          监护日期：
          {data.ctgexam &&
            data.ctgexam.startTime &&
            moment(data.ctgexam.startTime).format('YYYY-MM-DD HH:mm:ss')}
          {/* {data.data && data.data.startTime && moment(data.data.startTime).format('YYYY-MM-DD HH:mm:ss')} */}
        </span>
      </div>
    );
  }
  const { visible, onCancel, onCreate, dataSource, from } = props;
  const v = useMemo(() => { return {} }, []);

  return (
    <Context.Provider value={v}>
      <Modal
        getContainer={false}
        destroyOnClose
        centered
        width="92%"
        height="96%"
        visible={visible}
        title={renderTitle(from, dataSource)}
        okText="创建"
        cancelText="取消"
        footer={null}
        bodyStyle={{ display: 'flex', flexDirection: 'column' }}
        wrapClassName={styles.modal}
        onCancel={() => onCancel('printVisible')}
        onOk={onCreate}
        maskClosable={false}
      >
        <div className={styles.top}>
          <Preview dataSource={dataSource} from={from} />
        </div>
        <div className={styles.bottom}>
          <Setting from={from} dataSource={dataSource} />
        </div>
      </Modal>
    </Context.Provider>
  );
}

export default PrintPreview;
