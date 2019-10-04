import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Divider, Button } from 'antd';
import moment from 'moment';
import CreateRecordModal from './CreateRecordModal';

import styles from './TableList.less';

class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      type: 'create',
    };
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
        render: (text, record) => record.pregnancy && record.pregnancy.name,
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        width: 80,
        render: (text, record) => record.pregnancy && record.pregnancy.age,
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
        render: (text, record) => record.pregnancy && record.pregnancy.outpatientNO,
      },
      {
        title: '住院号',
        dataIndex: 'inpatientNO',
        key: 'inpatientNO',
        width: 200,
        render: (text, record) => record.pregnancy && record.pregnancy.inpatientNO,
      },
      {
        title: '床号',
        dataIndex: 'bedNumber',
        key: 'bedNumber',
        width: 80,
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

  showModal = name => {
    this.setState({ [name]: true });
  };

  handleCancel = name => {
    this.setState({ [name]: false });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  // 创建档案
  handleCreate = () => {
    const { dispatch } = this.props;
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'archives/create',
        payload: {
          ...values,
          visitTime: moment(values.visitTime).format('YYYY-MM-DD HH:ss:mm'),
          pregnancy: {
            name: values.name,
            age: values.age,
          },
        },
        callback(e) {
          console.log('99999999999999999999999999999999999999999', e);
        },
      });
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  // 单机行事件
  handleRow = (record, index) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'archives/updateState',
      payload: {
        current: record,
      },
    });
  };

  renderTitle = () => {
    return (
      <>
        <Button type="primary" onClick={() => this.showModal('visible')}>
          新建
        </Button>
        <Button style={{ marginLeft: '12px' }}>导入</Button>
      </>
    );
  };

  render() {
    const { selected, dataSource, loading } = this.props;
    const { visible, type } = this.state;

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
              onClick: event => this.handleRow(record), // 点击行
              onDoubleClick: event => {},
            };
          }}
          loading={loading.effects['archives/fetchRecords']}
          rowKey="id"
          rowClassName={record => (record.id === selected.id ? styles.selectedRow : '')}
          rowSelection={{
            columnWidth: '38px',
            type: 'radio',
            selectedRowKeys: [selected.id],
            onSelect: (record, selected, selectedRows) => this.handleRow(record),
          }}
          title={this.renderTitle}
        />
        <CreateRecordModal
          type={type}
          visible={visible}
          wrappedComponentRef={this.saveFormRef}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
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