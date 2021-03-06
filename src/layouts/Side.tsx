import React, { Component } from 'react';
import { Layout, Menu, Icon, Button } from 'antd';
import { connect } from 'dva';
import withRouter from 'umi/withRouter';
const styles = require('./BasicLayout.less')
import Link from 'umi/link';


const Side = (props: any) => {



    return (


        <Layout.Sider trigger={null} collapsible collapsed={true}>
            <Link to="/workbench" className={styles.logo}>
                {/* <img alt="logo" src={logo} /> */}
                <span>胎监工作站</span>
            </Link>


            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
    


                {[
                    ['档案管理', 'ordered-list', '/archives'],
                    ['系统设置', 'setting', '/setting'],
                    ['孕产妇管理', 'usergroup-add', '/pregnancy'],
                    ['用户信息', 'user'],
                ].map(([title, icon, path]) => {
                    // if (title === '用户信息') {
                    //     return user(icon);
                    // }
                    return (
                        <Menu.Item
                            key={icon}
                            onClick={e => {
                                // handleMenuClick(title);
                            }}
                            // type={props.location.pathname === path ? 'default' : 'primary'}
                        >
                            <Icon type={icon} />
                            <span>{title}</span>
                        </Menu.Item>
                    )
                })}
            </Menu>
        </Layout.Sider>


    );
}

export default connect(({ global, list, loading, setting, ws, subscribe, ...rest }: any) => ({
    wsStatus: ws.status,

}))(withRouter(Side));
