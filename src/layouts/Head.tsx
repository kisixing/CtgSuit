import React, { useState } from 'react';

import { Layout, Menu, Icon, Button, Modal, Avatar, Spin, Select } from 'antd';
import { connect } from 'dva';
import { router } from 'umi';
import withRouter from 'umi/withRouter';
import Link from 'umi/link';
import store from 'store';
import { ipcRenderer } from 'electron';
import HeaderDropdown from '@/components/HeaderDropdown';
// import logo from '../assets/logo.png';
import Beds from './Beds';
import Tabs from './Tabs';
import LayoutSetting from "./LayoutSetting";

const styles = require('./BasicLayout.less')



const { Header } = Layout;

const H = (props: any) => {






    const handleMenuClick = key => {

        // let timestamp = Date.parse(new Date());
        if (key === '操作说明') {
            ipcRenderer.send('newWindow', '操作说明');
        }
        if (key === '档案管理') {
            router.push('/archives');
        }
        if (key === '系统设置') {
            router.push('/setting');
        }
        if (key === '孕产妇管理') {
            router.push('/pregnancy');
        }
    };

    const onMenuClick = e => {
        const { key } = e;

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

    const user = key => {
        const { account, loading } = props;

        const menu = (
            <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
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




    const menus = () => {
        // ['操作说明', 'question-circle'],
        return (
            <>
                {[
                    ['档案管理', 'ordered-list', '/archives'],
                    ['系统设置', 'setting', '/setting'],
                    ['孕产妇管理', 'usergroup-add', '/pregnancy'],
                    ['用户信息', 'user'],
                ].map(([title, icon, path]) => {
                    if (title === '用户信息') {
                        return user(icon);
                    }
                    return (
                        <Button
                            key={icon}
                            onClick={e => {
                                handleMenuClick(title);
                            }}
                            icon={icon}
                            type={props.location.pathname === path ? 'default' : 'primary'}
                        >
                            {title}
                        </Button>
                    );
                })}
            </>
        );
    };


    return (

        <Header className={styles.header}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Link to="/workbench" className={styles.logo}>
                    {/* <img alt="logo" src={logo} /> */}
                    <h1>胎监工作站</h1>
                </Link>
                <div style={{ display: 'flex', lineHeight: '24px', justifyContent: 'space-around' }}>
                    <LayoutSetting />
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', flex: 1 }}>
                    <Beds {...props} />
                    <div className={styles.actionBar}>{menus()}</div>
                </div>
                <Tabs />
            </div>
        </Header>


    );
}

export default connect(({ global, loading, }: any) => ({
    loading: loading,
    account: global.account || {},

}))(withRouter(H));
