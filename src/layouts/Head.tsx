import { Layout } from 'antd';
import { connect } from 'dva';
import React, { memo } from 'react';
// import logo from '../assets/logo.png';
import Beds from './Beds';
import Menus from "./Menus";
import Tabs from './Tabs';
const styles = require('./BasicLayout.less')

const { Header } = Layout;
const H = ({ headCollapsed }) => {
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

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            position: 'relative',
          }}
        >
          <div
            style={{
              display: headCollapsed ? 'none' : 'flex',
              flex: 1,
              marginBottom: 10,
              transition: 'all .2s',
            }}
          >
            <Beds />
            <Menus />
          </div>
          <Tabs />
        </div>
      </Header>
    );
}

export default connect(({ setting }: any) => ({ headCollapsed: setting.headCollapsed }))(memo(H));
