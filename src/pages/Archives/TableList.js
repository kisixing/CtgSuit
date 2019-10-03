import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Button, Divider } from 'antd';
import styles from './TableList.less';

const columns = [
  {
    title: '编号',
    dataIndex: 'NO',
    key: 'NO',
    width: 80,
    align: 'center',
  },
  {
    title: '检查次数',
    dataIndex: 'checkNumber',
    key: 'checkNumber',
    width: 80,
    align: 'center',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 100,
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
    width: 80,
  },
  {
    title: '孕周',
    dataIndex: 'gestweek',
    key: 'gestweek',
    width: 80,
  },
  {
    title: '门诊号',
    dataIndex: 'patientNumber',
    key: 'patientNumber',
    width: 200,
  },
  {
    title: '住院号',
    dataIndex: 'AD',
    key: 'AD',
    width: 200,
  },
  {
    title: '床号',
    dataIndex: 'bedNumber',
    key: 'bedNumber',
    width: 200,
  },
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date',
    width: 150,
  },
  {
    title: 'GP',
    dataIndex: 'GP',
    key: 'GP',
    width: 100,
  },
  {
    title: '备注',
    dataIndex: 'comment',
    key: 'comment',
    width: 180,
    align: 'center',
    render: (text, recod) => 123456789,
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
    width: 200,
    render: (text, record) => {
      return (
        <span>
          <a href="javacript:;">详情</a>
          <Divider type="vertical" />
          <a href="javacript:;">修改</a>
          <Divider type="vertical" />
          <a href="javacript:;">导出</a>
          <Divider type="vertical" />
          <a href="javacript:;">记录单</a>
        </span>
      );
    },
  },
];

class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClick = (record, index) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'archives/updateState',
      payload: {
        current: record,
      },
    });
  };



  render() {
    const { selected, dataSource, loading } = this.props;
    return (
      <div className={styles.tableList}>
        <Table
          bordered
          size="small"
          scroll={{ x: 1680, y: 240 }}
          pagination={false}
          columns={columns}
          dataSource={dataSource}
          onRow={record => {
            return {
              onClick: event => this.handleClick(record), // 点击行
              onDoubleClick: event => {},
            };
          }}
          loading={!loading}
          rowKey="NO"
          rowClassName={record => (record.NO === selected.NO ? styles.selectedRow : '')}
          rowSelection={{
            columnWidth: '38px',
            type: 'radio',
            selectedRowKeys: [selected.NO],
            onSelect: (record, selected, selectedRows) => this.handleClick(record),
          }}
        />
      </div>
    );
  }
}

export default connect(({ archives, loading }) => ({
  selected: archives.current,
  dataSource: archives.dataSource,
  loading: loading,
}))(TableList);