import React, { memo } from 'react';

import { Layout } from 'antd';

// import logo from '../assets/logo.png';
import Beds from './Beds';
import Tabs from './Tabs';

import Menus from "./Menus";
const styles = require('./BasicLayout.less')



const { Header } = Layout;

const H = () => {



    return (

        <Header className={styles.header}>
            {/* <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Link to="/workbench" className={styles.logo}>
                    <span>胎监工作站</span>
                </Link>
                <div style={{ display: 'flex', lineHeight: '24px', justifyContent: 'space-around' }}>
                    <LayoutSetting />
                </div>
            </div> */}

            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', flex: 1 }}>
                    <Beds />
                    <Menus />
                </div>
                <Tabs />
            </div>
        </Header>


    );
}

export default memo(H);
