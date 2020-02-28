import React, { Component } from 'react';
import { connect } from 'dva';
import { router } from 'umi';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Table, Divider, /* Popconfirm, */ Input, Button } from 'antd';
import Highlighter from 'react-highlight-words';
import EditModal from './EditModal';
import styles from './TableList.less';
import moment from 'moment';
import store from "store";
class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      current: {}, // 当前编辑孕册
      searchText: '', //
    };

    const ward = store.get('ward') || {}
    const isIn = ward.wardType === 'in'

    this.isIn = isIn;
    this.noKey = this.isIn ? 'inpatientNO' : 'cardNO';
    this.noLabel = this.isIn ? '住院号' : '卡号';
    this.wardId = ward.wardId;

    this.columns = [
      {
        title: this.noLabel,
        dataIndex: this.noKey,
        key: this.noKey,
        width:200,
        sorter: (a, b) => a[this.noKey] - b[this.noKey],
        ...this.getColumnSearchProps(this.noKey),
      },
      {
        title: '床号',
        dataIndex: 'bedNO',
        key: 'bedNO',
        sorter: (a, b) => a.bedNO - b.bedNO,
        ...this.getColumnSearchProps('bedNO'),
      },
      this.isIn && {
        // TODO render 名称
        // 10 住院中  20 出院 30门诊
        title: '入院状态',
        dataIndex: 'recordstate',
        key: 'recordstate',
        render: text => (text === '10' ? '住院中' : '出院'),
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => {
          if (a.name && b.name) {
            return a.name.length - b.name.length;
          }
        },
        ...this.getColumnSearchProps('name'),
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        sorter: (a, b) => a.age - b.age,
      },
      {
        title: '孕次',
        dataIndex: 'gravidity',
        key: 'gravidity',
        sorter: (a, b) => a.gravidity - b.gravidity,
      },
      {
        title: '产次',
        dataIndex: 'parity',
        key: 'parity',
        sorter: (a, b) => a.parity - b.parity,
      },
      {
        title: '预产期',
        dataIndex: 'edd',
        key: 'edd',
        render: text => (text ? moment(text).format('YYYY-MM-DD') : null),
        // sorter: (a, b) => a.edd - b.edd,
      },
      {
        title: '手机号码',
        dataIndex: 'telephone',
        key: 'telephone',
      },
      // {
      //   title: '住址',
      //   dataIndex: 'address',
      //   key: 'address',
      //   width: 200,
      //   ...this.getColumnSearchProps('address'),
      // },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        width: 100,
        render: (text, record) => {
          return (
            <>
              <span
                className="primary-link"
                onClick={() => this.showEdit(record)}
              >
                编辑
              </span>
              <Divider type="vertical" />
              <span
                className="primary-link"
                onClick={() => this.handleSearchArchives(record)}
              >
                档案
              </span>
              {/* <Divider type="vertical" />
              <Popconfirm title="确认删除此条孕册信息？" okText="确定" cancelText="取消">
                <span className="delete-link">删除</span>
              </Popconfirm> */}
            </>
          );
        },
      },
    ].filter(_ => !!_);
  }

  componentDidMount() {
    // 默认检索住院状态的
    this.fetchCount();
    this.fetchData();
  }

  fetchData = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pregnancy/fetchPregnancies',
      payload: {
        // 住院状态
        'recordstate.equals': this.isIn ? '10' : undefined,
        // 默认进来只显示本病区,条件查询就不限制本病区
        'areaNO.equals': this.wardId,
        ...params,
      },
    });
  };

  fetchCount = params => {
    const { dispatch } = this.props;
    // const ward = store.get('ward') || {};
    dispatch({
      type: 'pregnancy/fetchCount',
      payload: {
        'recordstate.equals': this.isIn ? '10' : undefined,
        ...params
      },
    });
  };

  hideEdit = () => {
    this.setState({ visible: false });
  };

  showEdit = record => {
    this.setState(
      {
        current: record,
      },
      () => {
        this.setState({ visible: true });
      },
    );
  };

  handleSearchArchives = record => {
    router.push({
      pathname: '/archives',
      query: {
        pregnancyId: record.id,
        name: record.name,
        inpatientNO: record.inpatientNO,
        // ...record,
      },
    });
  };

  handleUpdate = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pregnancy/update',
      payload: values,
    }).then(() => {
      this.fetchData();
      this.fetchCount();
    });
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
        ...values
      };
      this.fetchData(params);
      this.fetchCount(params);
    }
  };

  onShowSizeChange = (current, size) => {
    // console.log('TCL: TableList -> onShowSizeChange -> current, size', current, size);
    const values = this.getValues();
    const params = {
      size,
      page: current - 1,
      ...values
    };
    this.fetchData(params);
    this.fetchCount(params);
  };

  getValues = () => {
    const { getFields } = this.props;
    const values = getFields();
    const { inpatientNO, name, recordstate, edd } = values;
    const params = {
      'inpatientNO.contains': inpatientNO,
      'name.contains': name,
      'recordstate.equals': recordstate || undefined,
      'edd.equals': edd ? moment(edd).format('YYYY-MM-DD') : edd,
    };
    return params;
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`输入关键字`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon={<LegacyIcon type="search" />}
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
      <LegacyIcon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),

    onFilter: (value, record) => {
      if (record[dataIndex]) {
        return record[dataIndex]
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
    render: text => (
      <div className={styles.textOver}>
        <Highlighter
          className={styles.textOver}
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text && text.toString()}
        />
      </div>
    ),
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {
    const { visible, current } = this.state;
    const { loading, count, pregnancies, pagination: { size, page } } = this.props;

    return (
      <div className={styles.tableList}>
        <Table
          bordered
          size="small"
          rowKey="id"
          loading={loading.effects['pregnancy/fetchPregnancies']}
          dataSource={pregnancies}
          columns={this.columns}
          // onChange={this.onChange}
          pagination={{
            hideOnSinglePage: false,
            total: count,
            current: page + 1,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total, range) => `共 ${total} 条`,
            onChange: this.onChange,
            onShowSizeChange: this.onShowSizeChange,
          }}
        />
        {visible ? (
          <EditModal
            visible={visible}
            dataSource={current}
            onCancel={this.hideEdit}
            onUpdate={this.handleUpdate}
          />
        ) : null}
      </div>
    );
  }
}

export default connect(({ loading, pregnancy }) => ({
  pagination: pregnancy.pagination,
  count: pregnancy.count,
  pregnancies: pregnancy.pregnancies,
  loading: loading,
}))(TableList);