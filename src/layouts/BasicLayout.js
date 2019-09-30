/*
 * @Description: 上下布局，主要页面布局 header-main
 * @Author: Zhong Jun
 * @Date: 2019-09-23 20:34:58
 */

import React, { Component, Fragment } from 'react';
import { Layout, Menu, Icon, Button, Modal, Avatar } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import store from 'store';
import { ipcRenderer } from 'electron';
import HeaderDropdown from '@/components/HeaderDropdown';

import config from '@/utils/config';
import logo from '../assets/logo.png';
import styles from './BasicLayout.less';

const { Header, Footer, Content } = Layout;

class BasicLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: '',
    };
  }

  componentDidMount() {
    this.props.dispatch({ type: 'list/getlist' });
    // send ipcMain
    ipcRenderer.send('clear-all-store', {
      name: 'clear all stroe!!!',
      age: '18',
      clearAll: store.clearAll(),
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
    if (key === '退出系统') {
      // store.clearAll();
      ipcRenderer.send('closeMainWindow');
      // Modal.confirm({
      //   title: '警告',
      //   content: '确认退出系统？',
      //   okText: '确认',
      //   cancelText: '取消',
      //   onOk: function() {
      //     // 清除sessionStorage
      //     store.clearAll();
      //     // 退出登录，返回到登录界面
      //     // router.push('./user/login');
      //     // 退出登录，关闭应用
      //     ipcRenderer.send('closeMainWindow');
      //   },
      // });
    }
  };

  onMenuClick = e => {
    const { key } = e;
    this.setState({ current: key });
    console.log('onMenuClick', e);
  };

  user = key => {
    const currentUser = (this.props.currentUser && this.props.currentUser.data) || {};
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
      <HeaderDropdown overlay={menu} key={key}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar">
            {currentUser.name}
          </Avatar>
          <span className={styles.name}>{currentUser.name}</span>
        </span>
      </HeaderDropdown>
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
    const { children, pageData, page, dispatch, listData } = this.props;
    return (
      <Layout className={styles.container}>
        <Header className={styles.header}>
          <Link to="/workbench" className={styles.logo}>
            <img alt="logo" src={logo} />
            <h1>胎监工作站</h1>
          </Link>

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden', margin: '6px' }}>
              <div className={styles.devices}>
                {listData.map(({ index, id, pageIndex, status }) => {
                  const mapStatusToType = ['danger', 'default', 'primary'];
                  return (
                    <Button
                      key={id}
                      size="small"
                      style={{
                        marginLeft: 4,
                        marginTop: 4,
                        padding: 0,
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      type={mapStatusToType[status]}
                      onClick={() => {
                        dispatch({ type: 'list/setPageItems', page: pageIndex });
                        router.push('/workbench');
                      }}
                    >
                      {index + 1}
                    </Button>
                  );
                })}
              </div>
              <div className={styles.actionBar}>{this.menus()}</div>
            </div>
            <div style={{ display: 'flex', lineHeight: '24px' }}>
              {pageData.map(([left, rigth], index) => {
                return (
                  <Button
                    key={Math.random()}
                    onClick={e => {
                      dispatch({ type: 'list/setPageItems', page: index });
                    }}
                    style={{ margin: '4px' }}
                    size="small"
                    type={page === index ? 'default' : 'primary'}
                  >
                    {left}~{rigth}
                  </Button>
                );
              })}
            </div>
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

BasicLayout.propTypes = {};

export default connect(({ global, list, loading }) => ({
  currentUser: global.currentUser,
  pageData: list.pageData,
  page: list.page,
  listData: list.listData,
}))(BasicLayout);
