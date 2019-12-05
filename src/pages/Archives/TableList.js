import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Divider, Button, Popconfirm, Icon, Input } from 'antd';
import moment from 'moment';
import Highlighter from 'react-highlight-words';
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
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        ...this.getColumnSearchProps('name'),
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
        sorter: (a, b) => moment(a.visitTime) - moment(b.visitTime),
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
                报告
              </span>
              <Divider type="vertical" />
              <span className="primary-link" onClick={() => this.showAnalysis(record)}>
                分析
              </span>
              {/* <Divider type="vertical" /> */}
              {/* <span className="delete-link" onClick={() => this.switchFullscreen(record)}>
                详情
              </span>
              <Divider type="vertical" /> */}
              {/* <Popconfirm title="确认删除该条信息？" okText="确定" cancelText="取消">
                <span className="delete-link">删除</span>
              </Popconfirm> */}
            </span>
          );
        },
      },
    ];
  }

  componentDidMount() {
    const { router } = this.props;
    const query = router.location.query;
    // 默认请求近一周的数据
    const sTime = moment()
      .subtract(7, 'd')
      .format('YYYY-MM-DD');
    const eTime = moment().format('YYYY-MM-DD');
    const params = {
      'visitDate.greaterOrEqualThan': sTime,
      'visitDate.lessOrEqualThan': eTime,
    };
    if (query.pregnancyId) {
      // 从孕产妇列表进入时，取得该孕产妇的孕产id，获得ctg档案信息
      this.fetchRecords({
        ...params,
        'pregnancyId.equals': query.pregnancyId
      });
      // 获取列表count
      this.fetchCount({
        ...params,
        'pregnancyId.equals': query.pregnancyId
      });
    } else {
      // 获取列表count
      this.fetchCount(params);
      // 获取列表
      this.fetchRecords(params);
    }
  }

  fetchRecords = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'archives/fetchRecords',
      payload: {
        ...params,
      },
    });
  };

  fetchCount = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'archives/fetchCount',
      payload: {
        ...params,
      },
    });
  };

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
        CTGData: null,
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

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder="输入搜索值..."
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          搜索
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          重置
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      let attributeValue = record[dataIndex];
      if (dataIndex === 'name' || dataIndex === 'age' || dataIndex === 'outpatientNO') {
        attributeValue = record['pregnancy'][dataIndex];
      }
      if (attributeValue) {
        return attributeValue
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      }
    },
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text, record) => (
      <div style={{ width: '134px' }} className={styles.textOver}>
        <Highlighter
          className={styles.textOver}
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0, width: '134px' }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={
            record.pregnancy && record.pregnancy.name ? record.pregnancy.name.toString() : ''
          }
        />
      </div>
    ),
  });

  // 帅选条件的搜索事件
  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  // 帅选条件的重置事件
  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  // 分页器onchange
  onChange = (page, pageSize) => {
    const values = this.getValues();
    // 以是否有pageSize区分触发区域
    if (pageSize) {
      // console.log('onChange --> params', page, pageSize);
      const params = {
        size: pageSize,
        page: page - 1,
        ...values,
      };
      this.fetchRecords(params);
      this.fetchCount(params);
      this.savePagination({ size: pageSize, page: page - 1 });
    }
  };

  // 分页器SizeChange
  onShowSizeChange = (current, size) => {
    // console.log('TCL: TableList -> onShowSizeChange -> current, size', current, size);
    const values = this.getValues();
    const params = {
      size,
      page: current - 1,
      ...values,
    };
    this.fetchRecords(params);
    this.fetchCount(params);
    this.savePagination({ size, page: current - 1 });
  };

  // 获取form表单值
  getValues = () => {
    const { getFields } = this.props;
    const values = getFields();
    let { startTime, endTime } = values;
    if (startTime) {
      startTime = moment(startTime).format('YYYY-MM-DD');
    }
    if (endTime) {
      endTime = moment(endTime).format('YYYY-MM-DD');
    }
    const params = {
      'visitDate.greaterOrEqualThan': startTime,
      'visitDate.lessOrEqualThan': endTime,
    };
    return params;
  };

  // 缓存分页器数据
  savePagination = params => {
    this.props.dispatch({
      type: 'archives/updateState',
      payload: {
        pagination: params,
      },
    });
  };

  render() {
    const { selected, dataSource, count, loading, pagination: { size, page } } = this.props;
    const { visible, printVisible, analysisVisible, type, current } = this.state;

    return (
      <div className={styles.tableList}>
        <Table
          bordered
          size="small"
          scroll={{ x: 1250, y: 196 }}
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
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            total: count,
            current: page + 1,
            defaultPageSize: 5,
            pageSize: size,
            pageSizeOptions: ['5', '10', '20', '30', '40'],
            showTotal: (total, range) => `共 ${total} 条`,
            onChange: this.onChange,
            onShowSizeChange: this.onShowSizeChange,
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
            visible={printVisible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            
            docid={selected.ctgexam && selected.ctgexam.note}
            startTime={selected.ctgexam && selected.ctgexam.startTime}
            inpatientNO={selected.pregnancy && selected.pregnancy.inpatientNO}
            name={selected.pregnancy && selected.pregnancy.name}
            age={selected.pregnancy && selected.pregnancy.age}
            gestationalWeek={selected && selected.gestationalWeek}
          />
        ) : null}
        {analysisVisible ? (
          <Analysis
            visible={analysisVisible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            docid={selected.ctgexam && selected.ctgexam.note}

            startTime={selected.ctgexam && selected.ctgexam.startTime}
            inpatientNO={selected.pregnancy && selected.pregnancy.inpatientNO}
            name={selected.pregnancy && selected.pregnancy.name}
            age={selected.pregnancy && selected.pregnancy.age}
            gestationalWeek={selected && selected.gestationalWeek}
          />
        ) : null}
      </div>
    );
  }
}

export default connect(({ archives, loading, router }) => ({
  pagination: archives.pagination,
  count: archives.count,
  selected: archives.current,
  dataSource: archives.dataSource,
  isFullscreen: archives.isFullscreen,
  loading: loading,
  router,
}))(TableList);