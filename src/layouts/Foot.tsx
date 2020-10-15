import VersionModal from "@/components/VersionModal";
import { printPdf } from "@/utils";
import config from '@/utils/config';
import settingStore from "@/utils/SettingStore";
import { BgColorsOutlined, FileDoneOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { AntdThemeManipulator } from '@lianmed/components';
import { Button, DatePicker, Layout, message, Modal, Popover } from 'antd';
import { connect } from "dva";
import { ipcRenderer } from 'electron';
import React, { memo, useRef, useState } from 'react';
import store from 'store';
import muted from "../assets/muted.png";
import LayoutSetting from './LayoutSetting';

const styles = require('./BasicLayout.less')

const cache = settingStore.cache
const colors = AntdThemeManipulator.colors
const { Footer } = Layout;

const v = cache.inspectable ? '1.0.1.0' : __VERSION

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
  const primaryColor = cache.theme || colors[colorIndex];
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
          <Button icon={<BgColorsOutlined />} style={{border:'none',color:'#fff'}} type="link"/>
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
          style={{border:'none',color:'#fff'}}
          onClick={() => ipcRenderer.send('newWindow', 'help')}
          type="link"
        />
        {/* <Button
          icon={<FileDoneOutlined />}
          type="link"
          style={{border:'none'}}
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
        /> */}
      </span>
      <span>
        <span>{config.copyright}</span>
        <span style={{ padding: '0 4px 0 8px' }} title="当前版本">
          v{v}
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
