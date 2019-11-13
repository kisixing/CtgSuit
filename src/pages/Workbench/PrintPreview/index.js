/*
 * @Description: 打印modal
 * @Author: Zhong Jun
 * @Date: 2019-10-02 20:10:21
 */

import React, { useMemo, useRef, useLayoutEffect, useState } from 'react';
import { Modal } from 'antd';
import Setting from './Setting';
import Preview from './Preview';
import styles from './index.less';
import moment from 'moment';

import { ipcRenderer } from 'electron';
import config from '@/utils/config';
export const Context = React.createContext({})



const PrintPreview = (props) => {
  const { visible, onCancel, onCreate, dataSource, from } = props;
  const [wh, setWh] = useState({})
  useLayoutEffect(() => {
    const { clientHeight, clientWidth } = inputEl.current;
    setWh({ h: clientHeight, w: clientWidth })
  }, [])

  const inputEl = useRef(null);

  const onDownload = () => {
    const docid = (dataSource.ctgexam && dataSource.ctgexam.note) || dataSource.documentno
    const filePath = `${config.apiPrefix}/ctg-exams-pdfurl/${docid}`
    ipcRenderer.send('printWindow', filePath)
  }

  const getPreviewData = () => {
    const { pregnancy, data, ctgexam } = dataSource
    let starttime
    let p
    if (data) {
      starttime = data.starttime
      p = JSON.parse(data.pregnancy)
    } else {
      starttime = ctgexam.startTime
      p = pregnancy
    }
    return {
      name: p.name,
      age: p.age,
      gestationalWeek: p.gestationalWeek,
      inpatientNO: p.inpatientNO,
      startdate: moment(starttime).format('YYYY-MM-DD HH:mm:ss'),
      fetalcount: 2,
    }
  }
  const renderTitle = (from, data) => {
    if (from !== 'archives') {
      // const d = data.data;
      // // console.log('TCL -----------', d);
      // const havePregnancy = d && d.pregnancy;
      // const p =
      //   typeof havePregnancy === 'object'
      //     ? havePregnancy
      //     : havePregnancy && JSON.parse(d.pregnancy.replace(/'/g, '"'));
      return (
        <div className={styles.modalTitle}>
          <span>档案号：{data.documentno}</span>
          {/* <span>住院号：{p.inpatientNO}</span>
          <span>姓名：{p.name}</span>
          <span>年龄：{p.age}</span>
          <span>孕周： {data.gestationalWeek}</span> */}
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
  const v = useMemo(() => { return {} }, []);
  const docid = (dataSource.ctgexam && dataSource.ctgexam.note) || dataSource.documentno
  return (
    <Context.Provider value={v}>
      <Modal
        getContainer={false}
        destroyOnClose
        centered
        visible={visible}
        title={renderTitle(from, dataSource)}
        okText="创建"
        cancelText="取消"
        width="92%"
        footer={
          null
        }
        bodyStyle={{ height: "80vh" }}
        wrapClassName={styles.modal}
        onCancel={() => onCancel('printVisible')}
        onOk={onCreate}
        maskClosable={false}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }} ref={inputEl}>
          <div style={{ height: 240, textAlign: 'center' }}>
            <Preview docid={docid} onDownload={onDownload} dataSource={dataSource} from={from} wh={wh} {...getPreviewData()} />
          </div>
          <div style={{
            flex: 1,
            padding: 24,
            marginTop: 12,
            border: '1px solid #eee'

          }}>
            <Setting docid={docid} from={from} dataSource={dataSource} />
          </div>
        </div>
      </Modal>
    </Context.Provider>
  );
}

export default PrintPreview;
