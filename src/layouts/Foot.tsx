import React, { memo, useRef } from 'react';
import { AntdThemeManipulator } from '@lianmed/components';

import { Layout, Button, Popover } from 'antd';
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

    const theme = useRef(null)
    const colorIndex = ~~(Math.random() * colors.length) >> 5;
    const primaryColor = settingData.theme || colors[colorIndex];

    return (

        <Footer className={styles.footer}>
            <span>
                <LayoutSetting />
                <Popover content={
                    <AntdThemeManipulator.P colors={colors} onChange={e => theme.current.handleChange(e)} triangle='hide' styles={{ default: { card: { boxSizing: 'content-box' } } }} />
                }
                    onVisibleChange={(e) => e && theme.current.click && theme.current.click()}
                >
                    <Button icon="bg-colors" type="primary" />

                </Popover>
                <AntdThemeManipulator
                    ref={theme}
                    style={{ display: 'none' }}
                    primaryColor={primaryColor}
                    onChange={color => {
                        settingStore.set('theme', color);
                    }}
                />

            </span>

            {/* <span>
                Copyright <Icon type="copyright" style={{ margin: '0 4px' }} /> {config.copyright}
            </span> */}
            <span>

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
        </Footer>
    );
}

export default memo(Foot)
