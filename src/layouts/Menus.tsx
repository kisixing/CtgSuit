// import logo from '../assets/logo.png';
// import request from '@/utils/request';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Button } from 'antd';
// import { ipcRenderer } from 'electron';
import React, { useCallback } from 'react';
import { router } from 'umi';
import withRouter from 'umi/withRouter';
import Account from "./Account";


const styles = require('./BasicLayout.less')

const M = (props: any) => {
    const handleMenuClick = useCallback(
        path => {
            // request.get('/account')
            // let timestamp = Date.parse(new Date());
            router.push(path);

        },
        []
    )

    return (
        <div className={styles.actionBar}>

            {[
                ['主页', 'home', '/workbench'],
                ['报表统计', 'ordered-list', '/statistics'],
                ['档案管理', 'fileText', '/archives'],
                ['系统设置', 'setting', '/setting'],
                ['病人管理', 'usergroup-add', '/pregnancy'],
                ['用户信息', 'user'],
            ].map(([title, icon, path]) => {
                if (title === '用户信息') {
                    return <Account key={icon} />;
                }
                return (
                    <Button
                        key={icon}
                        onClick={e => {
                            handleMenuClick(path);
                        }}
                        icon={<LegacyIcon type={icon} />}
                        type={props.location.pathname === path ? 'primary' : 'link'}
                    >
                        {title}
                    </Button>
                );
            })}
        </div>
    );
}

export default withRouter(M);
