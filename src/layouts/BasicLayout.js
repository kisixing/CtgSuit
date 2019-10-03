/*
 * @Description: 上下布局，主要页面布局 header-main
 * @Author: Zhong Jun
 * @Date: 2019-09-23 20:34:58
 */

import React, { Component, Fragment } from 'react';
import { Layout, Menu, Icon, Button, Modal, Avatar, Spin } from 'antd';
import { connect } from 'dva';
import { router } from 'umi';
import Link from 'umi/link';
import store from 'store';
import { ipcRenderer } from 'electron';
import HeaderDropdown from '@/components/HeaderDropdown';

import config from '@/utils/config';
// import logo from '../assets/logo.png';
import styles from './BasicLayout.less';
import Beds from './Beds';
import Tabs from './Tabs';
const { Header, Footer, Content } = Layout;

class BasicLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/fetchAccount',
    });
    dispatch({
      type: 'list/getlist',
    });
    // send ipcMain
    ipcRenderer.send('clear-all-store', {
      name: 'clear all stroe!!!',
      age: '18',
      clearAll: () => store.clearAll(),
    });
  }

  handleMenuClick = key => {
    this.setState({
      current: key,
    });
    if (key === '操作说明') {
      // router.push('/testCtg');
      ipcRenderer.send('newWindow', '新窗口');
    }
    if (key === '档案管理') {
      router.push('/Archives');
    }
    if (key === '系统设置') {
      router.push('/setting');
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
        onOk: function() {
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
        onOk: function() {
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
        <Menu.Item key="userinfo">
          <Icon type="user" />
          账户设置
        </Menu.Item>
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
            <Avatar
              size="small"
              className={styles.avatar}
              src={account.imageUrl}
              alt="avatar"
            >
              {account.login && account.login.substr(0, 1).toUpperCase()}
            </Avatar>
            <span className={styles.name}>{account.login}</span>
          </span>
        </HeaderDropdown>
      </Spin>
    );
  };

  menus = () => {
    return (
      <Fragment>
        {[
          ['档案管理', 'ordered-list', '/Archives'],
          ['系统设置', 'setting', '/setting'],
          ['操作说明', 'question-circle'],
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
    const { children } = this.props;
    return (
      <Layout className={styles.container}>
        <Header className={styles.header}>
          <Link to="/" className={styles.logo}>
            {/* <img alt="logo" src={logo} /> */}
            <h1>胎监工作站</h1>
          </Link>

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
          <Fragment>
            Copyright <Icon type="copyright" /> {config.copyright}
          </Fragment>
        </Footer>
      </Layout>
    );
  }
}

export default connect(({ global, list, loading }) => ({
  loading: loading,
  account: global.account || {},
  pageData: list.pageData,
  page: list.page,
  listData: list.listData,
}))(BasicLayout);
