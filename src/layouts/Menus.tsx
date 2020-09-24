// import logo from '../assets/logo.png';
// import request from '@/utils/request';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Button } from 'antd';
import { HomeFilled, FundFilled, FolderFilled, SettingFilled, MedicineBoxFilled } from '@ant-design/icons';
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
                ['主页', <HomeFilled />, '/workbench'],
                ['报表统计', <FundFilled />, '/statistics'],
                ['系统设置', <SettingFilled />, '/setting'],
                ['档案管理', <FolderFilled />, '/archives'],
                ['病人管理', <MedicineBoxFilled />, '/pregnancy'],
                ['用户信息', <></>, 'user'],
                // ['主页', 'home', '/workbench'],
                // ['报表统计', 'ordered-list', '/statistics'],
                // ['档案管理', 'fileText', '/archives'],
                // ['系统设置', 'setting', '/setting'],
                // ['病人管理', 'usergroup-add', '/pregnancy'],
                // ['用户信息', 'user'],
            ].map(([title, icon, path]) => {
                if (title === '用户信息') {
                    return <Account key={'user'} />;
                }
                return (
                    <Button
                        key={path as string}
                        onClick={e => {
                            handleMenuClick(path);
                        }}
                        icon={icon}
                        type={props.location.pathname === path ? 'link' : 'link'}
                        style={{ color: props.location.pathname === path ? 'var(--theme-color)' : 'var(--customed-font)' }}
                    >
                        {title}
                    </Button>
                );
            })}
        </div>
    );
}

export default withRouter(M);
