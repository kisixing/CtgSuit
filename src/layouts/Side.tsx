import React, { Component } from 'react';
import { Layout, Menu, Icon, } from 'antd';
import { connect } from 'dva';
import withRouter from 'umi/withRouter';


const Side = (props: any) => {



    return (


        <Layout.Sider trigger={null} collapsible >
            <div className="logo" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1">
                    <Icon type="user" />
                    <span>nav 1</span>
                </Menu.Item>
                <Menu.Item key="2">
                    <Icon type="video-camera" />
                    <span>nav 2</span>
                </Menu.Item>
                <Menu.Item key="3">
                    <Icon type="upload" />
                    <span>nav 3</span>
                </Menu.Item>
            </Menu>
        </Layout.Sider>


    );
}

export default connect(({ global, list, loading, setting, ws, subscribe, ...rest }: any) => ({
    wsStatus: ws.status,

}))(withRouter(Side));
