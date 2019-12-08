import React from 'react';
import { AntdThemeManipulator } from '@lianmed/components';

import { Layout, Button, } from 'antd';
import { ipcRenderer } from 'electron';
// import logo from '../assets/logo.png';

import settingStore from "@/utils/SettingStore";
import { QR } from "@/pages/Setting/Subscribe/index";
import LayoutSetting from "./LayoutSetting";

const styles = require('./BasicLayout.less')

const settingData = settingStore.cache
const colors = AntdThemeManipulator.colors
const { Footer } = Layout;

const Foot = (props: any) => {


    const colorIndex = ~~(Math.random() * colors.length) >> 5;
    const primaryColor = settingData.theme || colors[colorIndex];

    return (

        <Footer className={styles.footer}>
            <span>
                <LayoutSetting />
                <QR>
                    <Button icon="qrcode" type="primary">

                    </Button>
                </QR>
                <Button
                    icon="question-circle"
                    type="primary"
                    onClick={() => ipcRenderer.send('newWindow', '操作说明')}
                />
            </span>

            {/* <span>
                Copyright <Icon type="copyright" style={{ margin: '0 4px' }} /> {config.copyright}
            </span> */}
            <span>
                <AntdThemeManipulator
                    primaryColor={primaryColor}
                    placement="topLeft"
                    onChange={color => {
                        settingStore.set('theme', color);
                    }}
                />


            </span>
        </Footer>
    );
}

export default Foot
