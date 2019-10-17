import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Divider, Button, Popconfirm } from 'antd';
import moment from 'moment';
import CreateRecordModal from './CreateRecordModal';
import PrintPreview from '../Workbench/PrintPreview';
import Analysis from '../Workbench/Analysis';

import styles from './TableList.less';

class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      printVisible: false,
      analysisVisible: false,
      type: 'edit',
      current: {}, // 当前行
    };
    this.columns = [
      // {
      //   title: '编号',
      //   dataIndex: 'id',
      //   key: 'id',
      //   width: 100,
      //   align: 'center',
      // },
      // {
      //   title: '孕册ID',
      //   dataIndex: 'pregnancyId',
      //   key: 'pregnancyId',
      //   width: 68,
      //   align: 'center',
      //   render: (text, record) => record.pregnancy && record.pregnancy.id,
      // },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        render: (text, record) => (
          <span style={{ width: '84px' }} className={styles.textOver}>
            {record.pregnancy && record.pregnancy.name}
          </span>
        ),
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        width: 68,
        render: (text, record) => record.pregnancy && record.pregnancy.age,
      },
      {
        title: '孕周',
        dataIndex: 'gestationalWeek',
        key: 'gestationalWeek',
        width: 68,
      },
      {
        title: '住院号',
        dataIndex: 'inpatientNO',
        key: 'inpatientNO',
        width: 100,
        render: (text, record) => (
          <div style={{ width: '84px' }} className={styles.textOver}>
            {record.pregnancy && record.pregnancy.inpatientNO}
          </div>
        ),
      },
      {
        title: '床号',
        dataIndex: 'bedNumber',
        key: 'bedNumber',
        width: 100,
        render: (text, record) => record.pregnancy && record.pregnancy.bedNO,
      },
      {
        title: '日期',
        dataIndex: 'visitTime',
        key: 'visitTime',
        width: 150,
        render: text => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: 'GP',
        dataIndex: 'GP',
        key: 'GP',
        width: 100,
        render: (text, record) => {
          if (record.pregnancy) {
            return `${record.pregnancy.gravidity} / ${record.pregnancy.parity}`;
          }
          return;
        },
      },
      {
        title: '档案号',
        dataIndex: 'comment',
        key: 'comment',
        width: 150,
        align: 'center',
        render: (text, record) => record.ctgexam.note,
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
              <span className="primary-link" onClick={() => this.showPrint(record)}>
                打印
              </span>
              <Divider type="vertical" />
              <span className="primary-link" onClick={() => this.showAnalysis(record)}>
                分析
              </span>
              <Divider type="vertical" />
              {/* <span className="delete-link" onClick={() => this.switchFullscreen(record)}>
                详情
              </span>
              <Divider type="vertical" /> */}
              <Popconfirm title="确认删除该条信息？" okText="确定" cancelText="取消">
                <span className="delete-link">删除</span>
              </Popconfirm>
            </span>
          );
        },
      },
    ];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    console.log('7777777777777777', this.props);
    // 默认请求近一周的数据
    let sTime = moment()
      .subtract(7, 'd')
      .format('YYYY-MM-DD');
    let eTime = moment().format('YYYY-MM-DD');
    dispatch({
      type: 'archives/fetchRecords',
      payload: {
        'visitDate.greaterOrEqualThan': sTime,
        'visitDate.lessOrEqualThan': eTime,
      },
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
      type: 'create',
    });
  };

  showPrint = record => {
    this.setState({ current: record }, () => {
      this.setState({ printVisible: true });
      this.handleRow(record);
    });
  };

  showAnalysis = record => {
    this.setState({ current: record }, () => {
      this.setState({ analysisVisible: true });
      this.handleRow(record);
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      printVisible: false,
      analysisVisible: false,
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  // 创建档案
  handleOk = item => {
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
        },
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
        ctgexamid: record.ctgexam.note,
      },
    });
  };

  switchFullscreen = record => {
    const { dispatch, isFullscreen } = this.props;
    dispatch({
      type: 'archives/updateState',
      payload: {
        isFullscreen: !isFullscreen,
      },
    });
    this.handleRow(record);
  };

  render() {
    const { selected, dataSource, loading } = this.props;
    const { visible, printVisible, analysisVisible, type, current } = this.state;

    return (
      <div className={styles.tableList}>
        <Table
          bordered
          size="small"
          pagination={false}
          scroll={{ x: 1250, y: 218 }}
          columns={this.columns}
          dataSource={dataSource}
          // onRow={record => {
          // // 当存在action时，会触发多个事件
          //   return {
          //     onClick: event => this.handleRow(record), // 点击行
          //     onDoubleClick: event => {},
          //   };
          // }}
          loading={loading.effects['archives/fetchRecords']}
          rowKey="id"
          rowClassName={record => (record.id === selected.id ? styles.selectedRow : '')}
          rowSelection={{
            // columnWidth: '67px',
            columnTitle: '选中',
            type: 'radio',
            selectedRowKeys: [selected.id],
            onSelect: (record, selected, selectedRows) => this.handleRow(record),
          }}
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
        {printVisible ? (
          <PrintPreview
            from="archives"
            visible={printVisible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            dataSource={current}
          />
        ) : null}
        {analysisVisible ? (
          <Analysis
            from="archives"
            visible={analysisVisible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            dataSource={dataSource}
          />
        ) : null}
      </div>
    );
  }
}

export default connect(({ archives, loading }) => ({
  selected: archives.current,
  dataSource: archives.dataSource,
  isFullscreen: archives.isFullscreen,
  loading: loading,
}))(TableList);