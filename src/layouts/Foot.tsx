import React, { Component } from 'react';
import { AntdThemeManipulator } from '@lianmed/components';

import { Layout,  Icon, } from 'antd';
import { ipcRenderer } from 'electron';
import config from '@/utils/config';
// import logo from '../assets/logo.png';

import settingStore from "@/utils/SettingStore";
import { QR } from "@/pages/Setting/Subscribe/index";

const styles = require('./BasicLayout.less')

const settingData = settingStore.cache
const colors = AntdThemeManipulator.colors
const { Footer } = Layout;

const Foot = (props: any) => {


    const colorIndex = ~~(Math.random() * colors.length) >> 5;
    const primaryColor = settingData.theme || colors[colorIndex];

    return (

        <Footer className={styles.footer}>
            <span />
            <span>
                Copyright <Icon type="copyright" style={{ margin: '0 4px' }} /> {config.copyright}
            </span>
            <span>
                <QR>
                    <Icon
                        type="qrcode"
                        className={styles.question}
                    />
                </QR>
                <Icon
                    type="question-circle"
                    className={styles.question}
                    onClick={() => ipcRenderer.send('newWindow', '操作说明')}
                />
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
