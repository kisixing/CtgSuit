/*
 * @Description: 上下布局，主要页面布局 header-main
 * @Author: Zhong Jun
 * @Date: 2019-09-23 20:34:58
 */

import React, { Component, Fragment } from 'react';
import { AntdThemeManipulator } from '@lianmed/components';

import { Layout, Menu, Icon, Button, Modal, Avatar, Spin, Select, notification } from 'antd';
import { connect } from 'dva';
import { router } from 'umi';
import withRouter from 'umi/withRouter';
import Link from 'umi/link';
import store from 'store';
import { ipcRenderer } from 'electron';
import HeaderDropdown from '@/components/HeaderDropdown';
import config from '@/utils/config';
// import logo from '../assets/logo.png';
import styles from './BasicLayout.less';
import Beds from './Beds';
import Tabs from './Tabs';
import settingStore from "@/utils/SettingStore";
import { WsService } from "@lianmed/lmg";

window.gg = (str) => {
  ipcRenderer.send('printWindow', 'http://www.orimi.com/pdf-test.pdf')
}


const EWsStatus = WsService.wsStatus
const settingData = settingStore.cache
const colors = AntdThemeManipulator.colors
const { Header, Footer, Content } = Layout;
const joinSymbol = ' x '

class BasicLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: '',
    };
    const ws = new WsService(settingData);
    ws.connect();
    this.colorIndex = ~~(Math.random() * colors.length) >> 5;
    this.interval = null;
  }

  componentDidMount() {

    const { dispatch } = this.props;
    dispatch({
      type: 'global/fetchAccount',
    });
    dispatch({
      type: 'list/getlist',
    });
    dispatch({
      type: 'ws/connectWs',
    });
    // send ipcMain
    ipcRenderer.send('clear-all-store', {
      name: 'clear all stroe!!!',
      age: '18',
      clearAll: () => store.clearAll(),
    });
    // 每1min请求一次床位信息列表
    // this.interval = setInterval(() => this.updateBeds(), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updateBeds = () => {
    this.props.dispatch({
      type: 'list/updateBeds',
    });
  };

  handleMenuClick = key => {
    this.setState({
      current: key,
    });
    // let timestamp = Date.parse(new Date());
    if (key === '操作说明') {
      ipcRenderer.send('newWindow', '操作说明');
    }
    if (key === '档案管理') {
      router.push('/a');
    }
    if (key === '系统设置') {
      router.push('/s');
    }
    if (key === '孕产妇管理') {
      router.push('/p');
    }
  };

  onMenuClick = e => {
    const { key } = e;
    this.setState({ current: key });
    if (key === 'logout') {
      // 退出系统，但不注销登录信息，再次登录直接进入主页
      Modal.confirm({
        centered: true,
        title: '警告',
        content: '确认退出系统？',
        okText: '确认',
        cancelText: '取消',
        onOk: function () {
          // 清除sessionStorage
          // store.clearAll();
          // 退出登录，关闭应用
          ipcRenderer.send('closeMainWindow');
        },
      });
    }
    if (key === 'signout') {
      // 注销登录信息，跳转到登录界面。下次打开应用回到登录界面
      Modal.confirm({
        centered: true,
        title: '警告',
        content: '确认退出登录？',
        okText: '确认',
        cancelText: '取消',
        onOk: function () {
          // 清除sessionStorage
          store.clearAll();
          // 退出登录，回到登录页面
          router.push('/user/login');
        },
      });
    }
    if (key === 'userinfo') {
      router.push('/account');
    }
  };

  user = key => {
    const { account, loading } = this.props;

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {/* <Menu.Item key="userinfo">
          <Icon type="user" />
          账户设置
        </Menu.Item> */}
        <Menu.Item key="signout">
          <Icon type="user" />
          注销登录
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          退出系统
        </Menu.Item>
      </Menu>
    );
    return (
      <Spin
        wrapperClassName={styles.loading}
        spinning={loading.effects['global/fetchAccount']}
        key={key}
      >
        <HeaderDropdown overlay={menu} key={key}>
          <span className={`${styles.action} ${styles.account}`}>
            <Avatar size="small" className={styles.avatar} src={account.imageUrl} alt="avatar">
              {account.login && account.login.substr(0, 1).toUpperCase()}
            </Avatar>
            <span className={styles.name}>{account.login}</span>
          </span>
        </HeaderDropdown>
      </Spin>
    );
  };

  ListLayout = () => {
    const { listLayout, listLayoutOptions, dispatch } = this.props;
    const renderText = _ => _.join(joinSymbol);
    const menu = listLayoutOptions.map(_ => {
      return <Select.Option key={renderText(_)}>{renderText(_)}</Select.Option>;
    });
    return (
      <Select
        size="small"
        value={renderText(listLayout)}
        style={{ width: 70 }}
        onChange={value => {
          dispatch({
            type: 'setting/setListLayout',
            payload: { listLayout: value.split(joinSymbol).map(_ => +_) },
          });
        }}
      >
        {menu}
      </Select>
    );
  };

  menus = () => {
    // ['操作说明', 'question-circle'],
    return (
      <Fragment>
        {[
          ['档案管理', 'ordered-list', '/archives'],
          ['系统设置', 'setting', '/setting'],
          ['孕产妇管理', 'usergroup-add', '/pregnancy'],
          ['用户信息', 'user'],
        ].map(([title, icon, path]) => {
          if (title === '用户信息') {
            return this.user(icon);
          }
          return (
            <Button
              key={icon}
              onClick={e => {
                this.handleMenuClick(title);
              }}
              icon={icon}
              type={this.props.location.pathname === path ? 'default' : 'primary'}
            >
              {title}
            </Button>
          );
        })}
      </Fragment>
    );
  };

  render() {
    const primaryColor = settingData.theme || colors[this.colorIndex];
    const { children, wsStatus } = this.props;
    const wsStatusColor =
      wsStatus === EWsStatus.Pendding
        ? 'transparent'
        : wsStatus === EWsStatus.Success
          ? 'green'
          : 'red';
    return (
      <Layout
        className={styles.container}
        onClickCapture={e => {
          if (wsStatus !== EWsStatus.Success) {
            // e.stopPropagation()
            notification.warning({
              message: '未建立链接, 请联系支持人员',
            });
          }
        }}
      >
        <Header className={styles.header}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Link to="/" className={styles.logo}>
              {/* <img alt="logo" src={logo} /> */}
              <h1>胎监工作站</h1>
            </Link>
            <div style={{ display: 'flex', lineHeight: '24px', justifyContent: 'space-around' }}>
              <this.ListLayout />
              <div
                style={{
                  marginLeft: 6,
                  borderRadius: 2,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Spin spinning={wsStatus === EWsStatus.Pendding}>
                  {
                    <div
                      style={{
                        background: wsStatusColor,
                        borderRadius: 10,
                        cursor: 'pointer',
                        width: 20,
                        height: 20,
                      }}
                    ></div>
                  }
                </Spin>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden', margin: '6px' }}>
              <Beds {...this.props} />
              <div className={styles.actionBar}>{this.menus()}</div>
            </div>
            <Tabs {...this.props} />
          </div>
        </Header>
        <Content className={styles.main}>{children}</Content>
        <Footer className={styles.footer}>
          <span className={styles.question} onClick={() => ipcRenderer.send('newWindow', '操作说明')}>
            <Icon type="question-circle" />
          </span>
          <span>
            Copyright <Icon type="copyright" /> {config.copyright}
          </span>
          <AntdThemeManipulator
            primaryColor={primaryColor}
            placement="topLeft"
            onChange={color => {
              settingStore.set('theme', color);
            }}
          />
        </Footer>
      </Layout>
    );
  }
}

export default connect(({ global, list, loading, setting, ws, ...rest }) => ({
  loading: loading,
  account: global.account || {},
  pageData: list.pageData,
  page: list.page,
  listData: list.listData,
  listLayout: setting.listLayout,
  listLayoutOptions: setting.listLayoutOptions,
  wsStatus: ws.status,
  wsData: ws.data,
}))(withRouter(BasicLayout));
