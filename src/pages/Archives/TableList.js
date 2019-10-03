import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Divider } from 'antd';
import moment from 'moment';
import styles from './TableList.less';

class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.columns = [
      {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        width: 80,
        align: 'center',
      },
      {
        title: '检查次数',
        dataIndex: 'visitType',
        key: 'visitType',
        width: 80,
        align: 'center',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        render: (text, record) => record.pregnancy.name,
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        width: 80,
        render: (text, record) => record.pregnancy.age,
      },
      {
        title: '孕周',
        dataIndex: 'gestationalWeek',
        key: 'gestationalWeek',
        width: 80,
      },
      {
        title: '门诊号',
        dataIndex: 'outpatientNO',
        key: 'outpatientNO',
        width: 200,
        render: (text, record) => record.pregnancy.outpatientNO,
      },
      {
        title: '住院号',
        dataIndex: 'inpatientNO',
        key: 'inpatientNO',
        width: 200,
        render: (text, record) => record.pregnancy.inpatientNO,
      },
      {
        title: '床号',
        dataIndex: 'bedNumber',
        key: 'bedNumber',
        width: 200,
        render: (text, record) => record.ctgexam.id,
      },
      {
        title: '日期',
        dataIndex: 'visitTime',
        key: 'visitTime',
        width: 150,
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
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
        render: (text, recod) => '',
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
              <a href="javacript:;">删除</a>
            </span>
          );
        },
      },
    ];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'archives/fetchRecords' });
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
          columns={this.columns}
          dataSource={dataSource}
          onRow={record => {
            return {
              onClick: event => this.handleClick(record), // 点击行
              onDoubleClick: event => {},
            };
          }}
          loading={loading.effects['archives/fetchRecords']}
          rowKey="id"
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