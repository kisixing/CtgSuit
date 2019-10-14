/*
 * @Description: 床位信息设置
 * @Author: Zhong Jun
 * @Date: 2019-10-10 20:37:05
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import styles from './index.less';

class BedInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
    this.columns = [
      {
        title: '编号',
        dataIndex: 'bedno',
        key: 'bedno',
        width: 100,
        align: 'center',
      },
      {
        title: '名称',
        dataIndex: 'bedname',
        key: 'bedname',
        width: 80,
        align: 'center',
      },
      {
        title: '设备编号',
        dataIndex: 'deviceno',
        key: 'deviceno',
        width: 100,
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        align: 'center',
        render: (text, record) => {
          let status = '其它';
          if (text === '0') {
            status = '离线'
          } else if (text === '1') {
            status = '在线'
          } else if (text === '2') {
            status = '工作中'
          }
          return status;
        },
      },
      {
        title: '设备类型',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        width: 100,
      },
    ];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'setting/fetchBed',
    });
  }

  render() {
    const { loading, data } = this.props;
    return (
      <div className={styles.table}>
        <Table
          bordered
          size="small"
          loading={loading.effects['setting/fetchBed']}
          columns={this.columns}
          dataSource={data}
        />
      </div>
    );
  }
}

export default connect(({ loading, setting }) => ({
  data: setting.bedinfo,
  loading: loading,
}))(BedInfo);