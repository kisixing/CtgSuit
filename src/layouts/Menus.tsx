import React, { useCallback } from 'react';

import { Button } from 'antd';
import { router } from 'umi';
import withRouter from 'umi/withRouter';
import { ipcRenderer } from 'electron';
// import logo from '../assets/logo.png';
import request from '@/utils/request';
import Account from "./Account";
const styles = require('./BasicLayout.less')

const M = (props: any) => {
    const handleMenuClick = useCallback(
        key => {
            request.get('/account')
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
        },
        []
    )

    return (
        <div className={styles.actionBar}>

            {[
                ['档案管理', 'ordered-list', '/archives'],
                ['系统设置', 'setting', '/setting'],
                ['孕产妇管理', 'usergroup-add', '/pregnancy'],
                ['用户信息', 'user'],
            ].map(([title, icon, path]) => {
                if (title === '用户信息') {
                    return <Account key={icon} />;
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
        </div>
    );
}

export default withRouter(M);
