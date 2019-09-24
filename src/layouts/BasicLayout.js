/*
 * @Description: 上下布局，主要页面布局 header-main
 * @Author: Zhong Jun
 * @Date: 2019-09-23 20:34:58
 */

import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import router from 'umi/router';
import Link from 'umi/link';
import logo from '../assets/logo.png';
import styles from './BasicLayout.less';

const { Header, Footer, Content } = Layout;
const { SubMenu } = Menu;

class BasicLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: '',
    };
  }

  handleMenuClick = e => {
    console.log('click ', e);
    const { key, item } = e;
    this.setState({
      current: key,
    });
    if (key === 'Guide') {
    }
    if (key === 'Archives') {
      router.push('/Archives');
    }
    if (key === 'Setting') {
      router.push('/setting');
    }
    if (key === 'Logout') {
    }
  };

  menus = () => {
    return (
      <Menu
        onClick={this.handleMenuClick}
        selectedKeys={[this.state.current]}
        mode="horizontal"
        className={styles.menus}
      >
        <Menu.Item key="Guide">
          <Icon type="question-circle" />
          操作说明
        </Menu.Item>
        <Menu.Item key="Archives">
          <Icon type="ordered-list" />
          档案管理
        </Menu.Item>
        <Menu.Item key="Setting">
          <Icon type="setting" />
          系统设置
        </Menu.Item>
        <Menu.Item key="Logout">
          <Icon type="logout" />
          退出
        </Menu.Item>
      </Menu>
    );
  };

  render() {
    const { children } = this.props;
    return (
      <Layout className={styles.container}>
        <Header className={styles.header}>
          <Link to="/" className={styles.logo}>
            <img alt="logo" src={logo} />
            <h1>胎监</h1>
          </Link>
          <div className={styles.devices}>
            <div className={styles.wrapper}>

            </div>
            <div className={styles.title}>子机状态</div>
          </div>
          <div className={styles.actionBar}>{this.menus()}</div>
        </Header>
        <Content>{children}</Content>
        <Footer className={styles.footer}>Footer</Footer>
      </Layout>
    );
  }
}

BasicLayout.propTypes = {};

export default BasicLayout;
