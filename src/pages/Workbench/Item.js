import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Card, Col, Button } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import cx from 'classnames';

import L from '@lianmed/lmg';
import CollectionCreateForm from './CollectionCreateForm';
import { mapStatusToColor } from '@/constant';
import styles from './Item.less';

class WorkbenchItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSetting: false,
      visible: false,
    };
    this.ref = React.createRef();
    this.isFull = false;
  }

  toggleTool = () => {
    const { showSetting } = this.state;
    this.setState({ showSetting: !showSetting });
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
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

      console.log('Received values of form: ', values);
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

  renderTilte = (index, name, age) => {
    return (
      <div className={styles.title}>
        <span>【{index + 1}】</span>
        床号：
        <span>{index + 1}</span>
        住院号：
        <span>{12122121}</span>
        姓名：
        <span style={{ color: '#000' }}>{name}</span>
        年龄：
        <span style={{ color: '#000' }}>{age}</span>
        开始时间：
      </div>
    );
  };

  render() {
    const { index, name, age, itemHeight, itemSpan, status, dataSource } = this.props;
    const { showSetting, visible } = this.state;

    return (
      <Col span={itemSpan} className={styles.col} ref={this.ref}>
        <div className={cx(styles.toolbar, { [styles.show]: showSetting })}>
          <Button icon="user-add" type="link" onClick={this.showModal}>
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
          <Link to="">
            <Button icon="pie-chart" type="link">
              电脑分析
            </Button>
          </Link>
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
          title={this.renderTilte(index, name, age)}
          size="small"
          headStyle={{ background: mapStatusToColor[status] }}
          className={styles.card}
          extra={this.renderExtra()}
          bodyStyle={{
            padding: 0,
            flex: 1,
            height: itemHeight,
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
      </Col>
    );
  }
}

export default connect(({ loading }) => ({
  loading: loading,
}))(WorkbenchItem);
