import React, { useState } from 'react';

import { UserOutlined, LogoutOutlined, FormOutlined, StarFilled } from "@ant-design/icons";
import { Menu, Modal, Avatar, Spin } from 'antd';
import { connect } from 'dva';
import { router } from 'umi';

import { ipcRenderer } from 'electron';
import HeaderDropdown from '@/components/HeaderDropdown';
// import logo from '../assets/logo.png';
import ChangePassword from "@/components/ChangePassword";

const styles = require('./BasicLayout.less')

const A = (props: any) => {
  const { account, loading, isAdmin } = props;
  const [changPassWordVisible, setChangPassWordVisible] = useState(false)
  const onMenuClick = e => {
    const { key } = e;

    if (key === 'logout') {
      // 退出系统，注销登录信息，再次登录进入主页
      Modal.confirm({
        centered: true,
        title: '警告',
        content: '确认退出系统？',
        okText: '确认',
        cancelText: '取消',
        onOk: function () {
          // 清除sessionStorage
          localStorage.removeItem(require('@lianmed/utils').TOKEN_KEY)
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
        content: '确认重新登录系统？',
        okText: '确认',
        cancelText: '取消',
        onOk: function () {
          // 清除sessionStorage
          // store.clearAll();
          localStorage.removeItem(require('@lianmed/utils').TOKEN_KEY)
          // 退出登录，回到登录页面
          router.push('/user/login');
        },
      });
    }

  };

  const menu = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item disabled style={{ color: '#555' }}>
        {account.firstName}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="signout">
        <UserOutlined />
        <span>切换用户</span>
      </Menu.Item>
      <Menu.Item key="logout">
        <LogoutOutlined />
        <span>退出系统</span>
      </Menu.Item>
      <Menu.Item onClick={() => setChangPassWordVisible(true)}>
        <FormOutlined />
        <span>修改密码</span>
      </Menu.Item>
    </Menu>
  );
  return (
    <Spin
      wrapperClassName={styles.loading}
      // spinning={loading.effects['global/fetchAccount']}
      spinning={false}
    >
      <HeaderDropdown overlay={menu}>
        <span className={`${styles.action} ${styles.account}`}>
          {
            <Avatar
              size="small"
              className={styles.avatar}
              src={account.imageUrl}
              alt="avatar"
            // icon={<StarFilled />}
            >
              {
                (account.firstName || '').substr(0, 1).toUpperCase()
              }

            </Avatar>
          }
          <span title={account.firstName} className={styles.name}>
            {isAdmin ? '管理员' : '普通用户'}
          </span>
        </span>
      </HeaderDropdown>
      <ChangePassword
        visible={changPassWordVisible}
        onCancel={() => setChangPassWordVisible(false)}
      />
    </Spin>
  );
};

export default connect(({ global, loading, }: any) => ({
  // loading: loading,
  account: global.account || {},
  isAdmin: global.isAdmin
}))(A);
