/*
 * @Description: 电脑分析
 * @Author: Zhong Jun
 * @Date: 2019-10-02 10:49:29
 */

import React, { Component } from 'react';
import { Layout, Modal, Row, Col } from 'antd';
import { Ctg as L } from '@lianmed/lmg';

import ScoringMethod from './ScoringMethod';
import Setting from './Setting';

import styles from './index.less';

class Analysis extends Component {
  render() {
    const { visible, onCancel, onCreate, form, dataSource } = this.props;
    return (
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
            {/* <L data={null}></L> */}
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
    );
  }
}

export default Analysis;