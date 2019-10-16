/*
 * @Description: 监控窗口工具条toolbar
 * @Author: Zhong Jun
 * @Date: 2019-10-07 16:14:11
 */
import React, { Component } from 'react';
import { Button, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import cx from 'classnames';

import CollectionCreateForm from './CollectionCreateForm';
import Analysis from './Analysis';
import PrintPreview from './PrintPreview';
import Partogram from './Partogram';
import ModalConfirm from './ModalConfirm';
import styles from './Item.less';
import { WsService } from '@lianmed/lmg';
const socket = WsService._this;

class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSetting: false,
      visible: false, // 建档modal
      analysisVisible: false, // 电脑分析modal
      printVisible: false,
      partogramVisible: false,
      confirmVisible: false,
      isCreated: false, // 默认未建档
      isMonitor: false, // 是否已经开始监护
      isStopMonitorWhenCreated: false,
    };
  }

  componentDidMount() {
    const {
      dataSource: { data, documentno, pregnancy },
    } = this.props;
    // 判断是否已建档
    const isCreated = pregnancy && pregnancy.id && data && documentno === data.docid;
    this.setState({ isCreated });
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
    const { dispatch, setShowTitle } = this.props;
    setShowTitle(true);
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      // 新建孕册 后台检验孕册是否已经存在
      // ture -> 提示孕册已经存在，是否
      const pregnancyId = values.id;
      const {
        data: { starttime, docid },
      } = item;
      const d = {
        visitType: values.visitTime,
        visitTime: moment(values.values).format(),
        gestationalWeek: values.gestationalWeek,
        pregnancy: {
          id: '',
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
      if (pregnancyId) {
        // 调入孕册信息后获取的 有孕册pregnancyId
        const data = { ...d, pregnancy: { id: pregnancyId } };
        this.newArchive(data)
        this.end(item);
      } else {
        // 无孕册pregnancyId 新建孕册获取pregnancyId
        dispatch({
          type: 'list/createPregnancy',
          payload: { ...values },
          callback: res => {
            if (res && res.id) {
              // 新建孕册成功
              const data = { ...d, pregnancy: { id: res.id } };
              // 新建档案
              this.newArchive(data);
              this.end(item);
            } else {
              // 孕册存在，取到孕册信息
              message.info('改患者信息已存在！');
            }
          },
        });
      }

      form.resetFields();
      this.setState({
        visible: false,
        isStopMonitorWhenCreated: false
      });
    });
  };

  newArchive = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'archives/create',
      payload: params,
      callback: res => {
        if (res && res.id) {
          this.setState({ isCreated: true });
        }
      },
    });
  };

  start = item => {
    const { deviceno, bedno } = item;
    socket.startwork(deviceno, bedno);
    this.setState({ isCreated: false });
  };

  // 停止监护
  end = item => {
    const { isCreated } = this.state;
    const { dispatch, setShowTitle } = this.props;
    const _this = this;
    const { deviceno, bedno, pregnancy, data, documentno, prenatalVisit = {} } = item;
    // const isCreated = pregnancy && pregnancy.id && data && documentno === data.docid;
    socket.endwork(deviceno, bedno);
    if (isCreated) {
      // 已经建档 ,修改结束时间
      const pregnancyId = pregnancy.id;
      dispatch({
        type: 'archives/update',
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
            _this.setState({
              isMonitor: false,
              isCreated: false,
            });
            setShowTitle(false);
          }
        },
      });
    } else {
      // 未建档提示简单保存或者放弃保存
      this.setState({ isCreated: false });
    }
  };

  // 重定向打开建档窗口
  redirectCreate = () => {
    this.setState({
      isStopMonitorWhenCreated: true,
      confirmVisible: false,
      visible: true,
    });
  };

  render() {
    const { dataSource, showSettingBar, ...rest } = this.props;
    const {
      showSetting,
      visible,
      analysisVisible,
      printVisible,
      partogramVisible,
      confirmVisible,
      isCreated,
      // isMonitor,
    } = this.state;
    const { data, bedname, pregnancy, documentno } = dataSource;

    const isMonitor = data && data.status === 1;
    // const isCreated = pregnancy && pregnancy.id && data && documentno === data.docid;

    return (
      <>
        <div className={cx(styles.toolbar, { [styles.show]: showSetting })}>
          {isMonitor ? (
            <Button
              icon="pause-circle"
              type="link"
              onClick={() => this.showModal('confirmVisible')}
            >
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
            disabled={isCreated || !isMonitor}
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
          <Button
            disabled={!isCreated}
            icon="line-chart"
            type="link"
            onClick={() => this.showModal('partogramVisible')}
          >
            产程图
          </Button>
          {/* <Link to="">
            <Button icon="reconciliation" type="link">
              事件记录
            </Button>
          </Link> */}
        </div>
        <div
          className={styles.actionButton}
          style={{ opacity: showSetting || showSettingBar ? 1 : 0 }}
        >
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
        {printVisible ? (
          <PrintPreview
            wrappedComponentRef={form => (this.printRef = form)}
            visible={printVisible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            dataSource={dataSource}
          />
        ) : null}
        <Partogram
          wrappedComponentRef={form => (this.partogramRef = form)}
          visible={partogramVisible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          dataSource={dataSource}
        />
        <ModalConfirm
          visible={confirmVisible}
          dataSource={dataSource}
          isCreated={isCreated}
          isMonitor={isMonitor}
          onCancel={this.handleCancel}
          onOk={this.end}
          onCreate={this.redirectCreate}
        />
      </>
    );
  }
}

export default connect(({ loading, item }) => ({
  pregnancy: item.pregnancy,
  loading: loading,
}))(Toolbar);
