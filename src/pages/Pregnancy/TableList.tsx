import { SearchOutlined } from '@ant-design/icons';
import { Button, Divider, /* Popconfirm, */ Input, Table } from 'antd';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { router } from 'umi';
import EditModal from './EditModal';
import styles from './TableList.less';
const statusMap = {
  10: '住院',
  20: '出院',
  30: '门诊',
}


const TableList = (props) => {
  const { loading, pregnancies, pagination, fetchData, updateItem, isOut } = props;
  const [visible, setVisible] = useState(false)
  const [current, setCurrent] = useState<any>({})
  const [searchText, setsearchText] = useState('')
  const searchInput = useRef<Input>()
  const noKey = isOut ? 'cardNO' : 'inpatientNO';
  const noLabel = isOut ? '卡号' : '住院号';



  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`输入关键字`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          搜索
        </Button>
        <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          重置
        </Button>
      </div>
    ),

    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
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
        setTimeout(() => searchInput.current.select());
      }
    },
    render: text => (
      <div className={styles.textOver}>
        <Highlighter
          className={styles.textOver}
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      </div>
    ),
  });

  const columns: any = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      // sorter: (a, b) => {
      //   if (a.name && b.name) {
      //     return a.name.length - b.name.length;
      //   }
      // },
      // ...getColumnSearchProps('name'),
    },
    {
      title: noLabel,
      dataIndex: noKey,
      key: noKey,
      width: 200,
      // sorter: (a, b) => a[noKey] - b[noKey],
      // ...getColumnSearchProps(noKey),
    },
    true && {
      title: '床号',
      dataIndex: 'bedNO',
      key: 'bedNO',
      // sorter: (a, b) => a.bedNO - b.bedNO,
      // ...getColumnSearchProps('bedNO'),
    },
    {
      // TODO render 名称
      // 10 住院中  20 出院 30门诊
      title: '入院状态',
      dataIndex: 'recordstate',
      key: 'recordstate',
      render: text => statusMap[text] || '',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      // sorter: (a, b) => a.age - b.age,
    },
    {
      title: '孕次',
      dataIndex: 'gravidity',
      key: 'gravidity',
      // sorter: (a, b) => a.gravidity - b.gravidity,
    },
    {
      title: '产次',
      dataIndex: 'parity',
      key: 'parity',
      // sorter: (a, b) => a.parity - b.parity,
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
      render: text => (text ? [...text].map((_, i) => (i > 2 && i < 7) ? '*' : _).join('') : null),

    },
    // {
    //   title: '住址',
    //   dataIndex: 'address',
    //   key: 'address',
    //   width: 200,
    //   ...getColumnSearchProps('address'),
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
              onClick={() => showEdit(record)}
            >
              编辑
            </span>
            <Divider type="vertical" />
            <span
              className="primary-link"
              onClick={() => handleSearchArchives(record)}
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



  const hideEdit = () => {
    setVisible(false)
  };

  const showEdit = record => {
    setCurrent(record)
    setVisible(true)

  };

  const handleSearchArchives = record => {
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

  const handleUpdate = values => {
    updateItem(values)
  };

  // 分页器onchange
  const onChange = (current, pageSize) => {
    // 以是否有pageSize区分触发区域
    if (pageSize) {
      // console.log('onChange --> params', page, pageSize);
      let params = {
        pageSize,
        current,
      };

      fetchData(params);
      // fetchCount(params);
    }
  };

  const onShowSizeChange = (current, pageSize) => {
    // console.log('TCL: TableList -> onShowSizeChange -> current, size', current, size);
    let params = {
      pageSize,
      current,
    };

    fetchData(params);
    // fetchCount(params);
  };

  // const getValues = () => {
  //   const { getFields } = props;
  //   const values = getFields();
  //   const { inpatientNO, name, recordstate, edd } = values;
  //   const params = {
  //     'inpatientNO.contains': inpatientNO,
  //     'name.contains': name,
  //     'recordstate.equals': recordstate || undefined,
  //     'edd.equals': edd ? moment(edd).format('YYYY-MM-DD') : edd,
  //   };
  //   return params;
  // }



  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setsearchText(selectedKeys[0])

  };

  const handleReset = clearFilters => {
    clearFilters();
    setsearchText('')
  };


  return (
    <div className={styles.tableList}>
      <Table
        bordered
        size="small"
        rowKey="id"
        loading={loading}
        dataSource={pregnancies}
        columns={columns}
        // onChange={onChange}
        pagination={{
          // current: page + 1,
          ...pagination,
          hideOnSinglePage: false,
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total, range) => `共 ${total} 条`,
          onChange: onChange,
          onShowSizeChange: onShowSizeChange,
        }}
      />
      {visible ? (
        <EditModal
          visible={visible}
          dataSource={current}
          onCancel={hideEdit}
          onUpdate={handleUpdate}
        />
      ) : null}
    </div>
  );
}

export default TableList