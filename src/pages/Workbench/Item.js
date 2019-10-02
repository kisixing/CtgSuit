import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Card, Col, Button } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import cx from 'classnames';

import L from '@lianmed/lmg';
import CollectionCreateForm from './CollectionCreateForm';
import Analysis from './Analysis';
import { mapStatusToColor } from '@/constant';
import styles from './Item.less';

class WorkbenchItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSetting: false,
      visible: false, // 建档modal
      analysisVisible: false, // 电脑分析modal
    };
    this.ref = React.createRef();
    this.isFull = false;
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

  renderExtra = data => {
    return (
      <div className={styles.extra}>
        {/* <Button title="关闭" icon="close" size="small" type="link"></Button> */}
        <Button
          title="全屏展示"
          icon="fullscreen"
          size="small"
          type="link"
          onClick={() => {
            const el = ReactDOM.findDOMNode(this.ref.current);
            if (this.isFull) {
              document.body.requestFullscreen().then(() => {
                this.isFull = false;
              });
            } else {
              el.requestFullscreen().then(() => {
                this.isFull = true;
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
        床号: <span>【{item.index + 1}】</span>
        住院号: <span>{item.index + 1}</span>
        姓名: <span>{item.name}</span>
        年龄: <span>{item.age}</span>
        开始时间: <span>{item.startTime}</span>
      </div>
    );
  };

  render() {
    const { itemHeight, itemSpan, dataSource, outPadding } = this.props;
    const { showSetting, visible, analysisVisible } = this.state;

    return (
      <Col span={itemSpan} className={styles.col} ref={this.ref} style={{ padding: outPadding }}>
        <div className={cx(styles.toolbar, { [styles.show]: showSetting })}>
          <Button icon="user-add" type="link" onClick={() => this.showModal('visible')}>
            建档
          </Button>
          <Link to="">
            <Button icon="play-circle" type="link">
              开始监护
            </Button>
          </Link>
          <Link to="">
            <Button icon="pause-circle" type="link">
              停止监护
            </Button>
          </Link>
          <Button icon="pie-chart" type="link" onClick={() => this.showModal('analysisVisible')}>
            电脑分析
          </Button>
          <Link to="">
            <Button icon="printer" type="link">
              打印
            </Button>
          </Link>
          <Link to="">
            <Button icon="line-chart" type="link">
              产程图
            </Button>
          </Link>
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
          headStyle={{ background: mapStatusToColor[dataSource.status] }}
          className={styles.card}
          extra={this.renderExtra()}
          bodyStyle={{
            padding: 0,
            flex: 1,
            height: this.isFull ? '100%' : itemHeight,
          }}
        >
          <L data={null}></L>
        </Card>
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          dataSource={dataSource}
        />
        <Analysis
          wrappedComponentRef={this.saveFormRef}
          visible={analysisVisible}
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
