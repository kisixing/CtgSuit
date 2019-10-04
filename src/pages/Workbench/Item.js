import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Card, Col, Button, Tag, Modal, Switch } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Link from 'umi/link';
import cx from 'classnames';
import { event } from '@lianmed/utils';
import { Ctg as L } from '@lianmed/lmg';
import CollectionCreateForm from './CollectionCreateForm';
import Analysis from './Analysis';
import PrintModal from './PrintModal';
import Partogram from './Partogram';
import { mapStatusToColor, mapStatusToText } from '@/constant';
import styles from './Item.less';
import { WsConnect } from '@/services/WsConnect';
const socket = WsConnect._this;

class WorkbenchItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSetting: false,
      visible: false, // 建档modal
      analysisVisible: false, // 电脑分析modal
      printVisible: false,
      partogramVisible: false,
    };
    this.suitObject = { suit: null };
    this.ref = React.createRef();
  }

  fullScreen() {
    const el = ReactDOM.findDOMNode(this.ref.current);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen();
    }
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
        type: 'list/createPregnancies',
        payload: { ...values },
        callback: (res) => {
          if (res && res.id) {
            console.log('call back', res); // 请求完成后返回的结果
            const id = res.id;
            const {
              data: { starttime },
            } = item;
            const d = {
              visitType: values.visitTime,
              visitTime: moment(values.values).format(),
              gestationalWeek: values.gestationalWeek,
              pregnancy: {
                id: id,
              },
              ctgexam: {
                startTime: starttime,
                endTime: null,
                result: null,
                note: null,
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
        }
      });
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  start = item => {
    const { deviceno, bedno } = item;
    Modal.confirm({
      centered: true,
      title: '提示',
      content: `确认 床号：${item.index} 开始监护？`,
      okText: '确认',
      cancelText: '取消',
      onOk: function() {
        socket.startwork(deviceno, bedno);
      },
    });
  };

  end = item => {
    const { deviceno, bedno } = item;
    console.log('4444444', item)
    Modal.confirm({
      centered: true,
      title: '提示',
      content: `确认 床号：${item.index} 停止监护？`,
      okText: '确认',
      cancelText: '取消',
      onOk: function() {
        socket.endwork(deviceno, bedno);
        this.props.dispatch({
          type: 'archives/updateExams',
          payload: {}
        });
      },
    });
  };

  renderExtra = status => {
    return (
      <div className={styles.extra}>
        {/* <Button title="关闭" icon="close" size="small" type="link"></Button> */}
        <Tag color={mapStatusToColor[status]}>{mapStatusToText[status]}</Tag>
        <Button
          title="全屏展示"
          icon="fullscreen"
          size="small"
          type="link"
          onClick={this.fullScreen.bind(this)}
        ></Button>
        <Switch defaultChecked />
      </div>
    );
  };

  renderTilte = item => {
    return (
      <div className={styles.title}>
        床号: <span>{item.bedno}</span>
        住院号: <span>{item.documentno}</span>
        姓名: <span>{item.bedname}</span>
        {/* 年龄: <span>{item.age}</span> */}
        开始时间: <span>{new Date(item.updateTime).toLocaleDateString()}</span>
      </div>
    );
  };

  fullScreenEvent = () => {
    this.suitObject.suit.resize();
  };

  componentDidUpdate() {
    const { dispatch, fullScreenId, dataSource } = this.props;
    if (fullScreenId === dataSource.unitId) {
      this.fullScreen();
      dispatch({ type: 'list/setState', payload: { fullScreenId: null } });
    }
  }

  componentDidMount() {
    const { dispatch, fullScreenId, dataSource } = this.props;
    if (fullScreenId === dataSource.unitId) {
      this.fullScreen();
      dispatch({ type: 'list/setState', payload: { fullScreenId: null } });
    }
    document.addEventListener('fullscreenchange', this.fullScreenEvent);
  }

  componentWillUnmount() {
    event.off('fullScreen', this.cb);
    document.removeEventListener('fullscreenchange', this.fullScreenEvent);
  }

  render() {
    const { itemHeight, itemSpan, dataSource, outPadding, ...rest } = this.props;
    const { showSetting, visible, analysisVisible, printVisible, partogramVisible } = this.state;
    const { data, documentno, pregnancy } = dataSource;
    console.log('123456', dataSource);

    return (
      <Col
        span={itemSpan}
        className={styles.col}
        ref={this.ref}
        style={{ padding: outPadding, height: itemHeight }}
      >
        <div className={cx(styles.toolbar, { [styles.show]: showSetting })}>
          <Button icon="play-circle" type="link" onClick={() => this.start(dataSource)}>
            开始监护
          </Button>
          <Button icon="pause-circle" type="link" onClick={() => this.end(dataSource)}>
            停止监护
          </Button>
          <Button icon="user-add" type="link" onClick={() => this.showModal('visible')}>
            {documentno && pregnancy && pregnancy.id ? '已建档' : '建档'}
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
        <div className={styles.actionButton}>
          <Button
            icon={showSetting ? 'left' : 'right'}
            shape={showSetting ? 'circle' : null}
            style={{ boxShadow: '#aaa 3px 3px 5px 1px' }}
            type="primary"
            onClick={this.toggleTool}
          ></Button>
        </div>
        <Card
          hoverable
          title={this.renderTilte(dataSource)}
          size="small"
          className={styles.card}
          extra={this.renderExtra(dataSource.status)}
          bodyStyle={{ padding: 0, height: 'calc(100% - 40px)' }}
        >
          <L data={data} mutableSuitObject={this.suitObject} itemHeight={itemHeight}></L>
        </Card>
        <CollectionCreateForm
          wrappedComponentRef={form => (this.formRef = form)}
          {...rest}
          visible={visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          dataSource={dataSource}
        />
        <Analysis
          wrappedComponentRef={form => (this.analysisRef = form)}
          visible={analysisVisible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          dataSource={dataSource}
        />
        <PrintModal
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
      </Col>
    );
  }
}

export default connect(({ loading, item }) => ({
  pregnancy: item.pregnancy,
  loading: loading,
}))(WorkbenchItem);
