import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Card, Col, Button, Tag, Modal } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import cx from 'classnames';

import L from '@lianmed/lmg';
import CollectionCreateForm from './CollectionCreateForm';
import Analysis from './Analysis';
import PrintModal from './PrintModal';
import Partogram from './Partogram';
import { mapStatusToColor, mapStatusToText } from '@/constant';
import styles from './Item.less';

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
    this.suitObject = {suit:null}
    this.ref = React.createRef();
  }

  toggleTool = () => {
    const { showSetting } = this.state;
    this.setState({ showSetting: !showSetting });
  };

  showModal = name => {
    console.log('123456', name)
    this.setState({ [name]: true });
  };

  handleCancel = name => {
    this.setState({ [name]: false });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  handleCreate = () => {
    const { dispatch } = this.props;
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'list/createPregnancies',
        payload: { ...values },
      });
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  start = item => {
    Modal.confirm({
      centered: true,
      title: '提示',
      content: `确认 床号：${item.index}，姓名：${item.name} 开始监护？`,
      okText: '确认',
      cancelText: '取消',
      onOk: function() {},
    });
  }

  end = item => {
    Modal.confirm({
      centered: true,
      title: '提示',
      content: `确认 床号：${item.index}，姓名：${item.name} 停止监护？`,
      okText: '确认',
      cancelText: '取消',
      onOk: function() {},
    });
  }

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
          onClick={() => {
            const el = ReactDOM.findDOMNode(this.ref.current);

            if (document.fullscreenElement) {
              document.exitFullscreen().then(()=>{
              this.suitObject.suit.resize()
              });
            } else {
              el.requestFullscreen().then(()=>{
              this.suitObject.suit.resize()
              });
            }
          }}
        ></Button>
      </div>
    );
  };

  renderTilte = item => {
    return (
      <div className={styles.title}>
        床号: <span>{item.bedno }</span>
        住院号: <span>{item.documentno }</span>
        姓名: <span>{item.bedname}</span>
        {/* 年龄: <span>{item.age}</span> */}
        开始时间: <span>{new Date(item.updateTime).toLocaleDateString()}</span>
      </div>
    );
  };

  render() {
    const { itemHeight, itemSpan, dataSource, outPadding } = this.props;
    const { showSetting, visible, analysisVisible, printVisible, partogramVisible } = this.state;
    const {data} = dataSource
    return (
      <Col
        span={itemSpan}
        className={styles.col}
        ref={this.ref}
        style={{ padding: outPadding, height: itemHeight }}
      >
        <div className={cx(styles.toolbar, { [styles.show]: showSetting })}>
          <Button icon="user-add" type="link" onClick={() => this.showModal('visible')}>
            建档
          </Button>
          <Button icon="play-circle" type="link" onClick={() => this.start(dataSource)}>
            开始监护
          </Button>
          <Button icon="pause-circle" type="link" onClick={() => this.end(dataSource)}>
            停止监护
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
          <L data={data} mutableSuitObject={this.suitObject}></L>
        </Card>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          dataSource={dataSource}
        />
        <Analysis
          wrappedComponentRef={this.analysisRef}
          visible={analysisVisible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          dataSource={dataSource}
        />
        <PrintModal
          wrappedComponentRef={this.printRef}
          visible={printVisible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          dataSource={dataSource}
        />
        <Partogram
          wrappedComponentRef={this.printRef}
          visible={partogramVisible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          dataSource={dataSource}
        />
      </Col>
    );
  }
}

export default connect(({ loading }) => ({
  loading: loading,
}))(WorkbenchItem);
