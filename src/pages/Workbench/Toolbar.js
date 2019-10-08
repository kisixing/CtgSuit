/*
 * @Description: 监控窗口工具条toolbar
 * @Author: Zhong Jun
 * @Date: 2019-10-07 16:14:11
 */
import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Link from 'umi/link';
import cx from 'classnames';

import CollectionCreateForm from './CollectionCreateForm';
import Analysis from './Analysis';
import PrintPreview from './PrintPreview';
import Partogram from './Partogram';
import styles from './Item.less';
import { WsConnect } from '@/services/WsConnect';
const socket = WsConnect._this;

class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSetting: false,
      visible: false, // 建档modal
      analysisVisible: false, // 电脑分析modal
      printVisible: false,
      partogramVisible: false,
      isCreated: false, // 默认未建档
      isMonitor: false, // 是否已经开始监护
    };
  }

  componentDidMount() {
    const { dataSource: { data }, documentno, pregnancy } = this.props;
    // 判断是否已建档
    const isCreated = data && pregnancy && pregnancy.id && documentno === data.docid;
    // 判断是否已开始监护
    const isMonitor = data && data.starttime !== '';
    this.setState({ isCreated, isMonitor });
  }

  toggleTool = () => {
    const { showSetting } = this.state;
    this.setState({ showSetting: !showSetting });
  };

  showModal = name => {
    this.setState({ [name]: true });
  };

  handleCancel = name => {
    this.setState({ [name]: false });
  };

  handleCreate = item => {
    // 建档/确定action
    const { dispatch } = this.props;
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      // 新建孕册
      dispatch({
        type: 'list/createPregnancy',
        payload: { ...values },
        callback: res => {
          if (res && res.id) {
            // console.log('call back', res); // 请求完成后返回的结果
            const {
              data: { starttime, docid },
            } = item;
            const d = {
              visitType: values.visitTime,
              visitTime: moment(values.values).format(),
              gestationalWeek: values.gestationalWeek,
              pregnancy: {
                id: res.id,
              },
              ctgexam: {
                startTime: moment(starttime),
                endTime: null,
                result: null,
                note: docid, // docid
                diagnosis: null,
                report: null,
              },
            };
            // 新建档案, 在modal模块写
            dispatch({
              type: 'archives/create',
              payload: d,
            });
          }
        },
      });
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  start = item => {
    const { deviceno, bedno, bedname } = item;
    const _this = this;
    console.log('start Device -- ', item);
    Modal.confirm({
      centered: true,
      title: <span className="confirm-title">提示</span>,
      content: <span className="confirm-content">{`确认床号: ${bedname} 开始监护 ?`}</span>,
      okText: '确认',
      cancelText: '取消',
      onOk: function() {
        socket.startwork(deviceno, bedno);
        _this.setState({ isMonitor: true });
        // this.props.dispatch({
        //   type: 'archives/updateExams',
        //   payload: {},
        // });
      },
    });
  };

  // 停止监护
  end = item => {
    const { isCreated } = this.state;
    const _this = this;
    const { deviceno, bedno, bedname, pregnancy, data, prenatalVisit = {} } = item;
    if (isCreated) {
      // 已经建档
      const pregnancyId = pregnancy.id;
      console.log('end Device -- ', item);
      Modal.confirm({
        centered: true,
        title: <span className="confirm-title">提示</span>,
        content: <span className="confirm-content">{`确认床号: ${bedname} 停止监护 ?`}</span>,
        okText: '确认',
        cancelText: '取消',
        onOk: function() {
          socket.endwork(deviceno, bedno);
          this.props.dispatch({
            type: 'archives/updateExams',
            payload: {
              id: prenatalVisit.id,
              pregnancy: {
                id: pregnancyId,
              },
              ctgexam: {
                ...prenatalVisit.ctgexam,
                endTime: moment(),
                note: data.docid,
              },
            },
            callback: res => {
              if (res && res.id) {
                // 将监护状态改为未监护状态
                _this.setState({ isMonitor: false });
              }
            },
          });
        },
      });
    } else {
      // 未建档，直接调用web socket
      socket.endwork(deviceno, bedno);
      _this.setState({ isMonitor: false });
    }
  };

  render() {
    const { dataSource, showSettingBar, ...rest } = this.props;
    const {
      showSetting,
      visible,
      analysisVisible,
      printVisible,
      partogramVisible,
      isCreated,
      isMonitor,
    } = this.state;

    return (
      <>
        <div className={cx(styles.toolbar, { [styles.show]: showSetting })}>
          {isMonitor ? (
            <Button icon="pause-circle" type="link" onClick={() => this.end(dataSource)}>
              停止监护
            </Button>
          ) : (
              <Button icon="play-circle" type="link" onClick={() => this.start(dataSource)}>
                开始监护
            </Button>
            )}
          <Button
            icon="user-add"
            type="link"
            disabled={isCreated}
            onClick={() => this.showModal('visible')}
          >
            {isCreated ? '已建档' : '建档'}
          </Button>
          <Button icon="pie-chart" type="link" onClick={() => this.showModal('analysisVisible')}>
            电脑分析
          </Button>
          <Button icon="printer" type="link" onClick={() => this.showModal('printVisible')}>
            打印
          </Button>
          <Button icon="line-chart" type="link" onClick={() => this.showModal('partogramVisible')}>
            产程图
          </Button>
          <Link to="">
            <Button icon="reconciliation" type="link">
              事件记录
            </Button>
          </Link>
        </div>
        <div className={styles.actionButton} style={{ opacity: showSetting || showSettingBar ? 1 : 0 }}>
          <Button
            icon={showSetting ? 'left' : 'right'}
            shape={showSetting ? 'circle' : null}
            style={{ boxShadow: '#aaa 3px 3px 5px 1px' }}
            type="primary"
            onClick={this.toggleTool}
          ></Button>
        </div>
        {visible ? (
          <CollectionCreateForm
            {...rest}
            wrappedComponentRef={form => (this.formRef = form)}
            visible={visible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            dataSource={dataSource}
          />
        ) : null}
        <Analysis
          wrappedComponentRef={form => (this.analysisRef = form)}
          visible={analysisVisible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          dataSource={dataSource}
        />
        <PrintPreview
          wrappedComponentRef={form => (this.printRef = form)}
          visible={printVisible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          dataSource={dataSource}
        />
        <Partogram
          wrappedComponentRef={form => (this.partogramRef = form)}
          visible={partogramVisible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          dataSource={dataSource}
        />
      </>
    );
  }
}

export default connect(({ loading, item }) => ({
  pregnancy: item.pregnancy,
  loading: loading,
}))(Toolbar);
