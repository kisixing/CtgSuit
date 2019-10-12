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
      // isMonitor: false, // 是否已经开始监护
    };
  }

  componentDidMount() {
    const {
      dataSource: { data, documentno, pregnancy },
    } = this.props;
    // 判断是否已建档
    const isCreated =
      pregnancy && pregnancy.id && data && documentno === data.docid;
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
    const _this = this;
    const { dispatch, setShowTitle } = this.props;
    setShowTitle(true);
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
              callback: res => {
                if (res && res.id) {
                  _this.setState({ isCreated: true });
                }
              },
            });
          }
        },
      });
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  start = item => {
    const { deviceno, bedno } = item;
    socket.startwork(deviceno, bedno);
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
      _this.setState({ isCreated: false });
    }
  };

  // 重定向打开建档窗口
  redirectCreate = () => {
    this.setState({
      confirmVisible: false,
      visible: true
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
        {/* {confirmVisible ? (
          <ModalConfirm
            visible={confirmVisible}
            dataSource={dataSource}
            content={
              isMonitor ? `确认床号: ${bedname} 停止监护 ?` : `确认床号: ${bedname} 开始监护 ?`
            }
            onCancel={this.handleCancel}
            onOk={isMonitor ? this.end : this.start}
          />
        ) : null} */}
        <ModalConfirm
          visible={confirmVisible}
          dataSource={dataSource}
          content={
            isMonitor ? (
              isCreated ? (
                `确认床号: ${bedname} 停止监护 ?`
              ) : (
                  <span>
                    床号: {bedname} 即将停止监护，但还
                  <span style={{ color: '#f00' }}>未建立档案</span>
                    ，建档请选择“建档”按钮，放弃请选择“放弃存档”按钮 ?
                </span>
                )
            ) : (
                `确认床号: ${bedname} 开始监护 ?`
              )
          }
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
