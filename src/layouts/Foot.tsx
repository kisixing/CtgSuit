import React, { memo, useRef } from 'react';
import { Layout, Button, Popover, Icon } from 'antd';
import { ipcRenderer } from 'electron';

import { AntdThemeManipulator } from '@lianmed/components';
import settingStore from "@/utils/SettingStore";
import VersionModal from "@/components/VersionModal";
import config from '@/utils/config';
import LayoutSetting from './LayoutSetting';

const styles = require('./BasicLayout.less')

const settingData = settingStore.cache
const colors = AntdThemeManipulator.colors
const { Footer } = Layout;
declare var __VERSION: string;
declare var __VERSION_MANIFEST: string;
// console.log('__VERSION_MANIFEST', __VERSION_MANIFEST)

const Foot = (props: any) => {

    const theme = useRef(null)
    const colorIndex = ~~(Math.random() * colors.length) >> 5;
    const primaryColor = settingData.theme || colors[colorIndex];

    return (
      <Footer className={styles.footer}>
        <span>
          <LayoutSetting />
          <Popover
            content={
              <AntdThemeManipulator.P
                colors={colors}
                onChange={e => theme.current.handleChange(e)}
                triangle="hide"
                styles={{ default: { card: { boxSizing: 'content-box' } } }}
              />
            }
            onVisibleChange={e =>
              e && theme.current.click && theme.current.click()
            }
          >
            <Button icon="bg-colors" type="primary" />
          </Popover>
          <AntdThemeManipulator
            ref={theme}
            style={{ display: 'none' }}
            primaryColor={primaryColor}
            onChange={color => {
              settingStore.setSync('theme', color);
            }}
          />
          {/* <QR>
                    <Button icon="qrcode" type="primary">

                    </Button>
                </QR> */}
          <Button
            icon="question-circle"
            type="primary"
            onClick={() => ipcRenderer.send('newWindow', '操作说明')}
          />
        </span>
        <span>
          <span>{config.copyright}</span>
          <span style={{ padding: '0 4px 0 8px' }} title="当前版本">
            v{__VERSION}
          </span>
        </span>
        <VersionModal />
      </Footer>
    );
}

export default memo(Foot)
