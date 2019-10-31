/*
 * @Description: 电脑分析
 * @Author: Zhong Jun
 * @Date: 2019-10-02 10:49:29
 */

import React, { useMemo } from 'react';
import { Layout, Modal, Row, Col, Button } from 'antd';
import ScoringMethod from './ScoringMethod';
import Setting from './Setting';
import CTGChart from './CTGChart';
import { Suit } from '@lianmed/lmg/lib/Ctg/Suit';
import moment from 'moment';
const styles = require('./index.less');

export const Context = React.createContext({});
const docid = '1_1112_160415144057'
function Analysis({
  visible,
  onCancel,
  onCreate,
  dataSource,
  // docid = '',
  from, // 判断从哪里跳转过来的
}) {
  console.log(dataSource)
  const v = useMemo<{ suit: Suit }>(() => {
    return {} as any;
  }, []);
  return (
    <Context.Provider value={v}>
      <Modal
        maskClosable={false}
        getContainer={false}
        destroyOnClose
        centered
        width="92%"
        style={{ height: "88%" }}
        footer={null}
        visible={visible}
        title={
          <div className={styles.modalTitle}>
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
        wrapClassName={styles.modal}
      >
        <div style={{ height: '100%',display:'flex',flexDirection:'column' }}>
          <div className={styles.chart}>
            <CTGChart from={from} dataSource={dataSource} docid={docid} />
          </div>
          <div className={styles.content}>
            <Row gutter={24} style={{ height: '100%' }}>
              <Col span={12} style={{ height: '100%' }}>
                <ScoringMethod docid={docid} v={v} dataSource={dataSource} />
              </Col>
              <Col span={12} style={{ height: '100%' }}>
                <Setting />
                <Button style={{ position: 'absolute', right: 40, bottom: 20 }} type="primary">保存</Button>
              </Col>
            </Row>
          </div>
        </div>
      </Modal>
    </Context.Provider>
  );
}

export default Analysis;
