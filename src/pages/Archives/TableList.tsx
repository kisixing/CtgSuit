import Event from "@/components/Modal/Event";
import request from '@/utils/request';
import settingStore from "@/utils/SettingStore";
import { MultiParamDisplay } from "@lianmed/pages/lib/Ctg/MultiParamDisplay";
import { event } from '@lianmed/utils';
import { Button, DatePicker, Form, Input, Table } from 'antd';
import { connect } from 'dva';
import { ipcRenderer } from "electron";
import moment from 'moment';
import { stringify } from 'qs';
import React, { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import store from 'store';
import Analysis from '../Workbench/Analysis';
import Shell from '../Workbench/Analysis/Shell';
import PrintPreview from '../Workbench/PrintPreview';
import CreateRecordModal from './CreateRecordModal';
import ReportPreview from "./ReportPreview";
import styles from './TableList.less';
import { IPrenatalVisit } from "@lianmed/f_types";
type TVisibleType = 'create' | 'print' | 'analysis' | 'report' | 'multiParam' | 'event'

const STORE_SIZE_KEY = 'archiveSize'
function TableList(props) {

  const { router, fetchCtgData } = props;

  const [page, setPage] = useState(1)
  const [size, setSize] = useState(store.get(STORE_SIZE_KEY) || 5)
  const [count, setCount] = useState(0
  )
  const [dataSource, setDataSource] = useState([])

  const [visibleType, setVisibleType] = useState<TVisibleType>(null)
  const [type, setType] = useState('edit')
  const [current, setCurrent] = useState({})
  const [selected, setSelected] = useState<IPrenatalVisit>({})
  const [searchText, setSearchText] = useState('')
  const ok = useRef(null)
  const toPlay = useRef<Function>(null)
  const formRef = useRef(null)
  const audioId = useRef(null)

  const ward = store.get('ward');
  const isIn = (ward || {}).wardType === 'in'
  const noLabel = isIn ? '住院号' : '卡号'
  const noKey = isIn ? 'inpatientNO' : 'cardNO';

  const [form] = Form.useForm()
  const [wardId, setWardId] = useState(ward && ward.wardId ? ward.wardId : undefined)





  const columns: any = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      ...getColumnSearchProps('name'),
    },
    {
      title: noLabel,
      dataIndex: noKey,
      key: noKey,
      width: 100,
      render: (text, record) => (
        <div style={{ width: '84px' }} className={styles.textOver}>
          {record.pregnancy && record.pregnancy[noKey]}
        </div>
      ),
    },
    isIn && {
      title: '床号',
      dataIndex: 'bedNumber',
      key: 'bedNumber',
      width: 100,
      render: (text, record) => record.pregnancy && record.pregnancy.bedNO,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 70,
      render: (text, record) => record.pregnancy && record.pregnancy.age,
      // sorter: (a, b) => parseInt(a.age) - parseInt(b.age),
    },
    {
      title: '孕周',
      dataIndex: 'gestationalWeek',
      key: 'gestationalWeek',
      width: 70,
    },
    {
      title: '日期',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 150,
      render: (text, record) => {
        const startTime = record.ctgexam && record.ctgexam.startTime;
        const timeStr = moment(startTime).format('YYYY-MM-DD HH:mm:ss');
        return timeStr;
      },
      // sorter: (a, b) => moment(a.startTime) - moment(b.startTime),
    },
    {
      title: 'GP',
      dataIndex: 'GP',
      key: 'GP',
      width: 65,
      align: 'center',
      render: (text, record) => {
        if (record.pregnancy) {
          const { gravidity, parity } = record.pregnancy;
          return `${gravidity ? gravidity : 1} / ${parity ? parity : 0}`;
        }
        return null;
      },
    },
    {
      title: '档案号',
      dataIndex: 'comment',
      key: 'comment',
      width: 150,
      render: (text, record) => record.ctgexam.note,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 240,
      align: 'center',
      render: (text, record) => {
        const ctgexam = record.ctgexam;
        const hasSigned = !!ctgexam.report;
        const signable = true || !!ctgexam.signable;
        const isMother = ctgexam && (ctgexam.type === 'mother');
        return (

          <span>
            <Button type="link" size="small" onClick={(e) => showEventVisible(e, record)}>
              <span>事件记录</span>
            </Button>
            <Button type="link" size="small" disabled={!settingStore.cache.analysable} onClick={e => showAnalysis(e, record)}>
              <span>电脑分析</span>
            </Button>
            <Button type="link" size="small" disabled={!signable} onClick={(e) => showPrint(e, record)}>
              <span>{hasSigned ? '重新生成' : '报告生成'}</span>
            </Button>
            <Button type="link" size="small" disabled={!hasSigned} onClick={(e) => showReport(e, record)}>
              <span>查看</span>
            </Button>
            <Button type="link" size="small" onClick={(e) => showMultiParam(e, record)} disabled={!isMother}>
              <span>多参</span>
            </Button>
            {/* <Divider type="vertical" /> */}
            {/* <span className="delete-link" onClick={() => switchFullscreen(record)}>
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
  ].filter(_ => !!_); // .map(_ => ({ ..._, align: 'center' }));

  useEffect(() => {

    function play(id, second = 0) {
      second = Math.ceil(second)
      console.log('play', id)
      if (id) {
        // audioId = '21_1_200524155151_1'
        audioId.current = id
        ipcRenderer.send('audioPlay', `load`, { second, audioId: id })
        if (ok.current) {
          ipcRenderer.send('audioPlay', `play`, { second, audioId: id })
        } else {
          toPlay.current = () => ipcRenderer.send('audioPlay', `play`, { second, audioId: id })
        }
      } else {
        ipcRenderer.send('audioPlay', 'stop', { second })
      }
    }
    function signed(id) {
      fetchRecords()
      // setSelected({})
    }
    init()
    event
      .on('signed', signed)
      // 用户点击播放
      .on('ctg:replay', play)
    ipcRenderer.on('audioPlay', (e, text) => {
      if (!current) return
      console.log('___', text)
      switch (text) {
        case '开始播放':
          event.emit('ctg:canReplay', audioId)
          break;
        case '文件导入成功':
          toPlay.current && toPlay.current()
          toPlay.current = null
          ok.current = true
          break;
        case '文件获取失败':
          toPlay.current = null
          ok.current = false
          break;

        default:
          break;
      }
    })
    return () => {
      event
        .off('signed', signed)
        .off('ctg:replay', play)
      ipcRenderer.send('audioPlay', 'stop', { second: 0 })
    }
  }, [])

  useEffect(() => {
    fetchRecords()
    store.set(STORE_SIZE_KEY, size)
  }, [page, size])


  function init() {
    // 默认请求近一周的数据
    // eslint-disable-next-line no-undef

    // 初始化页脚信息，重第一页开始


    // 获取列表count
    fetchCount();
    // 获取列表
    // fetchRecords();
  }

  async function fetchRecords() {

    const params = getValues()

    const string = stringify({ ...params });
    request.get(
      `/prenatal-visitspage?CTGExamId.specified=true&pregnancyId.specified=true${
      string ? '&' : ''
      }${string}`,
    ).then(res => setDataSource(res))

  };

  async function fetchCount() {
    const params = getValues()
    const string = stringify({ ...params });
    const c = await request.get(
      `/prenatal-visits/count?CTGExamId.specified=true&pregnancyId.specified=true${
      string ? '&' : ''
      }${string}`,
    );
    setCount(c)
  };

  function showModal(t: TVisibleType, record) {
    setCurrent(record)
    handleRow(record);
    setVisibleType(t)
  };

  function showPrint(e, record) {
    e.stopPropagation();

    showModal('print', record)
  };

  function showReport(e, record) {
    e.stopPropagation();

    showModal('report', record)

  };
  function showEventVisible(e, record) {
    e.stopPropagation();

    showModal('event', record)
  };
  function showAnalysis(e, record) {
    e.stopPropagation();

    showModal('analysis', record)
  };
  function showMultiParam(e, record) {
    e.stopPropagation();

    showModal('multiParam', record)
  };

  function handleCancel() {
    setVisibleType(null)
  };

  function saveFormRef(f) {
    formRef.current = f;
  };

  // 创建档案
  function handleOk(item: IPrenatalVisit) {

    setVisibleType(null)

  };

  // 单机行事件
  function handleRow(record) {
    const docid = record.ctgexam.note
    if ((selected.ctgexam && selected.ctgexam.note) !== docid) {
      // 当前点击的档案详情
      // 获取监护图曲线信息
      fetchCtgData(record)
    }
    setSelected(record)


  };

  // function switchFullscreen(record) {
  //   const { dispatch, isFullscreen } = props;
  //   dispatch({
  //     type: 'archives/updateState',
  //     payload: {
  //       isFullscreen: !isFullscreen,
  //     },
  //   });
  //   handleRow(record);
  // };

  function getColumnSearchProps(dataIndex) {
    return ({
      // filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      //   <div style={{ padding: 8 }}>
      //     <Input
      //       ref={node => {
      //         searchInput = node;
      //       }}
      //       placeholder="输入搜索值..."
      //       value={selectedKeys[0]}
      //       onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
      //       onPressEnter={() => handleSearch(selectedKeys, confirm)}
      //       style={{ marginBottom: 8, display: 'block' }}
      //     />
      //     <Button
      //       type="primary"
      //       onClick={() => handleSearch(selectedKeys, confirm)}
      //       icon={<LegacyIcon type="search" />}
      //       size="small"
      //       style={{ width: 90, marginRight: 8 }}
      //     >
      //       搜索
      //     </Button>
      //     <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
      //       重置
      //     </Button>
      //   </div>
      // ),
      // filterIcon: filtered => (
      //   <LegacyIcon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
      // ),
      // onFilter: (value, record) => {
      //   let attributeValue = record[dataIndex];
      //   if (dataIndex === 'name' || dataIndex === 'age' || dataIndex === 'outpatientNO') {
      //     attributeValue = record['pregnancy'][dataIndex];
      //   }
      //   if (attributeValue) {
      //     return attributeValue
      //       .toString()
      //       .toLowerCase()
      //       .includes(value.toLowerCase());
      //   }
      // },
      // onFilterDropdownVisibleChange: visible => {
      //   if (visible) {
      //     setTimeout(() => searchInput.select());
      //   }
      // },
      render: (text, record) => (
        <div style={{ width: '134px' }} className={styles.textOver}>
          <Highlighter
            className={styles.textOver}
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0, width: '134px' }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={
              record.pregnancy && record.pregnancy.name ? record.pregnancy.name.toString() : ''
            }
          />
        </div>
      ),
    });
  }

  // // 帅选条件的搜索事件
  // function handleSearch(selectedKeys, confirm) {
  //   confirm();
  //   setSearchText(selectedKeys[0])
  // };

  // // 帅选条件的重置事件
  // function handleReset(clearFilters) {
  //   clearFilters();
  //   setSearchText('')

  // };

  // 分页器onchange
  function onChange(page, size) {
    setPage(page)
    setSize(size)
  };



  // 获取form表单值
  function getValues() {
    const query = router.location.query;
    const values = form.getFieldsValue();

    let { startTime, endTime, name, bedNO } = values;

    if (startTime) {
      startTime = moment(startTime).format('YYYY-MM-DD');
    }
    if (endTime) {
      endTime = moment(endTime).format('YYYY-MM-DD');
    }
    const params = {
      page: page - 1,
      size,
      sort: 'visitDate,asc',
      'visitDate.greaterOrEqualThan': startTime,
      'visitDate.lessOrEqualThan': endTime,
      'areaNO.equals': wardId, // 病区
      'pregnancyId.equals': query.pregnancyId || undefined,
      'name.contains': name || undefined,
      [`${noKey}.contains`]: values[noKey] || undefined,
      ...(isIn ? { 'bedNO.contains': bedNO || undefined } : {})
    };

    return params;
  };



  // 检索
  const handleSubmit = e => {
    // e.preventDefault();
    setWardId(undefined);
    fetchCount()
    fetchRecords()
    setPage(1)
  };

  // 重置表单
  const handleReset = () => {
    form.resetFields();
  };

  const { loading, } = props;


  // 档案号
  const docID = selected.ctgexam && selected.ctgexam.note;
  // 监护开始时间
  const startTime = selected.ctgexam && selected.ctgexam.startTime;
  // 住院号
  const inpatientNO = selected.pregnancy && selected.pregnancy[noKey];
  // 姓名
  const name = selected.pregnancy && selected.pregnancy.name;
  // 年龄
  const age = selected.pregnancy && selected.pregnancy.age;
  // 孕周
  const gestationalWeek = selected && selected.gestationalWeek;

  return <>
    <Form
      layout="inline"
      className={styles.form}
      onFinish={handleSubmit}
      form={form}
      initialValues={{
        startTime: __DEV__ ? moment('2019-1-1') : moment().subtract(7, 'd'),
        endTime: moment(),
      }}
    >
      <Form.Item label="开始日期" name="startTime">
        <DatePicker
          allowClear
          format="YYYY-MM-DD"
          placeholder="请选择开始日期"
          style={{ width: 136 }}
        />
      </Form.Item>
      <Form.Item label="结束日期" name="endTime">
        <DatePicker
          allowClear
          format="YYYY-MM-DD"
          placeholder="请选择结束日期"
        />
      </Form.Item>
      <Form.Item label="姓名" name="name">
        <Input
          allowClear
          placeholder="请输入姓名"
        />
      </Form.Item>
      <Form.Item label={noLabel} name={noKey}>
        <Input
          allowClear
          placeholder={`请输入${noLabel}`}
        />
      </Form.Item>
      {
        isIn && (
          <Form.Item label="床号" name="bedNO">
            <Input
              allowClear
              placeholder="请输入床号"
            />
          </Form.Item>
        )
      }
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading.effects['archives/fetchRecords']}
        >
          搜索
            </Button>
        <Button onClick={handleReset}>重置</Button>
      </Form.Item>
    </Form>
    <div className={styles.tableList}>
      <Table
        bordered
        size="small"
        scroll={{ x: 1280, y: 204 }}
        columns={columns}
        dataSource={dataSource}
        onRow={record => {
          // 当存在action时，会触发多个事件
          return {
            onClick: event => handleRow(record), // 点击行
            onDoubleClick: event => { },
          };
        }}
        loading={loading.effects['archives/fetchRecords']}
        rowKey="id"
        rowClassName={record =>
          record.id === selected.id ? styles.selectedRow : ''
        }
        rowSelection={{
          // columnWidth: '67px',
          columnTitle: '选中',
          type: 'radio',
          selectedRowKeys: [selected.id],
          onSelect: (record, selected, selectedRows) =>
            handleRow(record),
        }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          total: count,
          current: page,
          defaultPageSize: 5,
          pageSize: size,
          pageSizeOptions: ['5', '10', '20', '30', '40'],
          showTotal: (total, range) => `共 ${total} 条`,
          onChange: onChange,
          onShowSizeChange: onChange,
          className: '',
          style: {
            float: 'right',
            paddingTop: '4px'

          }
        }}
      />
      {visibleType === 'create' ? (
        <CreateRecordModal
          type={type}
          visible={visibleType === 'create'}
          wrappedComponentRef={saveFormRef}
          onCancel={handleCancel}
          onOk={handleOk}
          dataSource={selected}
        />
      ) : null}
      {visibleType === 'print' ? (
        <PrintPreview
          visible={visibleType === 'print'}
          onCancel={handleCancel}
          docid={docID}
          startTime={startTime}
          inpatientNO={inpatientNO}
          name={name}
          age={age}
          gestationalWeek={gestationalWeek}
        />
      ) : null}
      {visibleType === 'analysis' ? (
        <Analysis
          visible={visibleType === 'analysis'}
          onCancel={handleCancel}
          docid={docID}
          startTime={startTime}
          inpatientNO={inpatientNO}
          name={name}
          age={age}
          gestationalWeek={gestationalWeek}
        />
      ) : null}
      {visibleType === 'multiParam' && (
        <Shell
          visible={visibleType === 'multiParam'}
          onCancel={handleCancel}
          docid={docID}
          startTime={startTime}
          inpatientNO={inpatientNO}
          name={name}
          age={age}
          gestationalWeek={gestationalWeek}>
          <MultiParamDisplay docid={docID} />
        </Shell>

      )}
      {visibleType === 'report' ? (
        <ReportPreview
          visible={visibleType === 'report'}
          onCancel={handleCancel}
          docid={docID}
          report={selected.ctgexam && selected.ctgexam.report}
          inpatientNO={inpatientNO}
          name={name}
          age={age}
          startTime={startTime}
          gestationalWeek={gestationalWeek}
        />
      ) : null}
      <Event docid={docID} visible={visibleType === 'event'} onCancel={handleCancel} disabled readonly />

    </div>
  </>;
}

export default connect(({ archives, loading, router }: any) => ({
  loading: loading,
  router,
}))(TableList);