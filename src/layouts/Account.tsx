import React, { } from 'react';

import { Menu, Icon, Modal, Avatar, Spin } from 'antd';
import { connect } from 'dva';
import { router } from 'umi';
import store from 'store';
import { ipcRenderer } from 'electron';
import HeaderDropdown from '@/components/HeaderDropdown';
// import logo from '../assets/logo.png';

const styles = require('./BasicLayout.less')




const A = (props: any) => {

    const { account, loading } = props;






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

    };


    const menu = (
        <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
            <Menu.Item key="signout">
                <Icon type="user" />
                <span>注销登录</span>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout">
                <Icon type="logout" />
                <span>退出系统</span>
            </Menu.Item>
        </Menu>
    );
    return (
        <Spin
            wrapperClassName={styles.loading}
            // spinning={loading.effects['global/fetchAccount']}
            spinning={false}
        >
            <HeaderDropdown overlay={menu} >
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







export default connect(({ global, loading, }: any) => ({
    // loading: loading,
    account: global.account || {},

}))(A);
