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
      type: 'edit',
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
        width: 100,
        render: (text, record) => record.pregnancy && record.pregnancy.outpatientNO,
      },
      {
        title: '住院号',
        dataIndex: 'inpatientNO',
        key: 'inpatientNO',
        width: 100,
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
        render: (text, record) => record.ctgexam.note,
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        width: 150,
        render: (text, record) => {
          return (
            <span>
              <span onClick={this.showDetailModal}>修改</span>
              <Divider type="vertical" />
              <span>导出</span>
              <Divider type="vertical" />
              <span>删除</span>
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

  showModal = () => {
    this.setState({
      visible: true,
      type: 'create',
    });
  };

  showDetailModal = () => {
    this.setState({
      visible: true,
      type: 'update',
    });
  }

  handleCancel = () => {
    this.setState({ visible: false });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  // 创建档案
  handleOk = (item) => {
    const { dispatch } = this.props;
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const p = {
        ...item,
        visitTime: moment(values.visitTime),
        gestationalWeek: values.gestationalWeek,
        pregnancy: {
          ...item.pregnancy,
          name: values.name,
          age: values.age,
          inpatientNO: values.inpatientNO,
          gravidity: values.gravidity,
          parity: values.parity,
          telephone: values.telephone,
        },
      };
      dispatch({
        type: 'archives/update',
        payload: {
          ...p,
        }
      });
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  // 单机行事件
  handleRow = (record, index) => {
    const { dispatch } = this.props;
    // 当前点击的档案详情
    dispatch({
      type: 'archives/updateState',
      payload: {
        current: record,
      },
    });
    // 获取监护图曲线信息
    dispatch({
      type: 'archives/fetchCTGrecordData',
      payload: {
        ctgexamid: record.ctgexam.id,
        // ctgexamid: record.ctgexam.note,
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
          scroll={{ x: 1400, y: 240 }}
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
          // title={this.renderTitle}
        />
        {visible ? (
          <CreateRecordModal
            type={type}
            visible={visible}
            wrappedComponentRef={this.saveFormRef}
            onCancel={this.handleCancel}
            onOk={this.handleOk}
            dataSource={selected}
          />
        ) : null}
      </div>
    );
  }
}

export default connect(({ archives, loading }) => ({
  selected: archives.current,
  dataSource: archives.dataSource,
  loading: loading,
}))(TableList);