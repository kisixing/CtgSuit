/*
 * @Description: 上下布局，主要页面布局 header-main
 * @Author: Zhong Jun
 * @Date: 2019-09-23 20:34:58
 */

import React, { Component, Fragment } from 'react';
import { Layout, Menu, Icon, Button } from 'antd';
import router from 'umi/router';
import Link from 'umi/link';
import logo from '../assets/logo.png';
import styles from './BasicLayout.less';
import { connect } from 'react-redux';

const { Header, Footer, Content } = Layout;

class BasicLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: '',
    };
  }

  handleMenuClick = key => {
    this.setState({
      current: key,
    });
    if (key === '操作说明') {
      router.push('/testCtg');
    }
    if (key === '档案管理') {
      router.push('/Archives');
    }
    if (key === '系统设置') {
      router.push('/setting');
    }
    if (key === '退出') {
    }
  };

  menus = () => {
    return (
      <>
        {[
          ['系统设置', 'setting'],
          ['退出', 'logout'],
          ['操作说明', 'question-circle'],
          ['档案管理', 'ordered-list'],
        ].map(([title, icon]) => {
          return (
            <Button
              key={Math.random()}
              onClick={e => {
                this.handleMenuClick(title);
              }}
              icon={icon}
              type={this.state.current === title ? 'dashed' : 'primary'}
            >
              {title}
            </Button>
          );
        })}
        {/* <Menu.Item key="Guide">
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
        </Menu.Item> */}
      </>
    );
  };

  render() {
    const { children, pageData, page, dispatch, listData } = this.props;
    return (
      <Layout className={styles.container}>
        <Header className={styles.header}>
          <Link to="/" className={styles.logo}>
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
                    type={page === index ? 'dashed' : 'primary'}
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
            Copyright <Icon type="copyright" /> 2019 莲印医疗科技
          </Fragment>
        </Footer>
      </Layout>
    );
  }
}

BasicLayout.propTypes = {};

export default connect(({ list }) => {
  return {
    pageData: list.pageData,
    page: list.page,
    listData: list.listData,
  };
})(BasicLayout);
