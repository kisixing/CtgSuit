import React, { memo, useRef, useEffect, useState, useCallback } from 'react';
import { BgColorsOutlined, QuestionCircleOutlined, FileDoneOutlined } from '@ant-design/icons';
import { Layout, Button, Popover, Modal, DatePicker, message } from 'antd';
import { ipcRenderer } from 'electron';

import { AntdThemeManipulator } from '@lianmed/components';
import settingStore from "@/utils/SettingStore";
import VersionModal from "@/components/VersionModal";
import config from '@/utils/config';
import LayoutSetting from './LayoutSetting';
import { printPdf } from "@/utils";
import store from 'store'
import muted from "../assets/muted.png";
import { connect } from "dva";
const styles = require('./BasicLayout.less')

const settingData = settingStore.cache
const colors = AntdThemeManipulator.colors
const { Footer } = Layout;
declare var __VERSION: string;


const PrintModal = ({ printCb, printVisible, setPrintVisible, setStartTime, setEndTime }) => {
  return (
    <Modal maskClosable={false} footer={null} visible={printVisible} onCancel={() => setPrintVisible(false)} >
      <span>开始日期</span> <DatePicker onChange={e => setStartTime(e.format('YYYY-MM-DD'))} />
      <span style={{ marginLeft: 10 }}>结束日期</span> <DatePicker onChange={e => setEndTime(e.format('YYYY-MM-DD'))} />
      <div style={{ overflow: 'hidden', marginTop: 20, clear: 'both' }}>
        <Button onClick={printCb} style={{ float: 'right', }}>打印</Button>
      </div>
    </Modal>
  )
}


const Foot = (props: any) => {
  const { alarm_muted } = props.setting
  const theme = useRef(null)
  const colorIndex = ~~(Math.random() * colors.length) >> 5;
  const primaryColor = settingData.theme || colors[colorIndex];
  const [printVisible, setPrintVisible] = useState(false)
  const [startTime, setStartTime] = useState<string>(null)
  const [endTime, setEndTime] = useState<string>(null)
  const printCb = () => {
    const ward = store.get('ward') || { wardId: '' };
    if (!(endTime && startTime)) {
      return message.info('请输入时间')
    }
    const url = `/prenatal-visits-report?startTime=${startTime}&endTime=${endTime}&areaNo=${ward.wardId}`
    console.log('print', url)
    printPdf(url)
  }

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
          <Button icon={<BgColorsOutlined />} type="primary" />
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
          icon={<QuestionCircleOutlined />}
          type="primary"
          onClick={() => ipcRenderer.send('newWindow', 'help')}
        />
        <Button
          icon={<FileDoneOutlined />}
          type="primary"
          onClick={() => {
            setPrintVisible(true)
            // request.post('/prenatal-visits-report', {
            //   data: {
            //     startTime: '2019-12-10',
            //     endTime: '2019-12-30',
            //     areaNo: '22670'

            //   }
            // })
          }}
        />
      </span>
      <span>
        <span>{config.copyright}</span>
        <span style={{ padding: '0 4px 0 8px' }} title="当前版本">
          v{__VERSION}
        </span>
      </span>
      <span style={{ marginRight: 4 }}>
        {
          alarm_muted && <img src={muted} width="14" />
        }
      </span>
      <VersionModal />
      <PrintModal setPrintVisible={setPrintVisible} printCb={printCb} printVisible={printVisible} setEndTime={setEndTime} setStartTime={setStartTime} />
    </Footer>
  );
}

export default memo(connect(
  ({ setting }: any) => ({
    setting
  })
)(Foot))
