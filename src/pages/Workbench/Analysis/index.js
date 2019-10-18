/*
 * @Description: 电脑分析
 * @Author: Zhong Jun
 * @Date: 2019-10-02 10:49:29
 */

import React, { useMemo } from 'react';
import { Layout, Modal, Row, Col } from 'antd';
import ScoringMethod from './ScoringMethod';
import Setting from './Setting';
import CTGChart from './CTGChart';
import styles from './index.less';

export const Context = React.createContext({});

function Analysis({
  visible,
  onCancel,
  onCreate,
  dataSource,
  from, // 判断从哪里跳转过来的
}) {
  const v = useMemo(() => {
    return {};
  }, []);
  return (
    <Context.Provider value={v}>
      <Modal
        getContainer={false}
        destroyOnClose
        centered
        width="92%"
        height="96%"
        footer={null}
        visible={visible}
        title={`【${dataSource.index + 1}】 分析曲线`}
        okText="创建"
        cancelText="取消"
        onCancel={() => onCancel('analysisVisible')}
        onOk={onCreate}
        wrapClassName={styles.modal}
      >
        <Layout style={{ height: '100%' }}>
          <div className={styles.chart}>
            <CTGChart from={from} dataSource={dataSource} />
          </div>
          <div className={styles.content}>
            <Row gutter={24}>
              <Col span={12}>
                <ScoringMethod />
              </Col>
              <Col span={12}>
                <Setting />
              </Col>
            </Row>
          </div>
        </Layout>
      </Modal>
    </Context.Provider>
  );
}

export default Analysis;
