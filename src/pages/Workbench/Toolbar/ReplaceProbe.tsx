/**
 * 胎监主页PDA建档/绑定弹窗
 */
import '@ant-design/compatible/assets/index.css';
import { ICacheItem, WsService } from '@lianmed/lmg/lib/services/WsService';
// import { request } from '@lianmed/utils';
import { event } from '@lianmed/utils';
import { Button, Divider, InputNumber, Modal } from 'antd';
import React, { useState } from 'react';
import store from "store";
import { Ctg } from '@lianmed/lmg';
import { useCtgData } from '@lianmed/pages/lib/Ctg/Analyse';


const socket = WsService._this;
interface IProps {

  onCancel: () => void
  data: ICacheItem

}
const DELAY_TIME_KEY = 'DELAY_TIME_KEY'
const ReplaceProbe = ({ data, onCancel }: IProps) => {
  const { device_no, bed_no, id, replaceProbeTipData, addProbeTipData, timeEndworkTipData, isUncreated, docid } = data
  const [time, setTime] = useState((store.get(DELAY_TIME_KEY) || 10) as number)
  function cancel() {
    onCancel()
    data.addProbeTipData = null
    data.replaceProbeTipData = null
    data.timeEndworkTipData = null
  }
  const { ctgData } = useCtgData(docid)
  ctgData.selectBarHidden = true
  const [visible, setVisible] = useState(false)
  if (isUncreated) {
    cancel()
  }
  const end = () => {
    event.emit(`item_close:${id}`)
    cancel()
  }
  const replace = () => {
    socket.replace_probe(device_no, bed_no)
    cancel()
  }
  const add = () => {
    socket.add_probe(device_no, bed_no)
    cancel()
  }
  const delay_endwork = () => {
    store.set(DELAY_TIME_KEY, time)
    socket.delay_endwork(device_no, bed_no, time)
    cancel()
  }
  const R = [
    !!addProbeTipData && (
      <>
        <div style={{ marginBottom: 24 }}>发现宫缩探头拔出，请操作：</div>

        <Button onClick={add} type="primary">加入监护</Button>
        <Divider type="vertical" />

        <Button onClick={cancel}>取消</Button>
      </>
    ),
    !!replaceProbeTipData && (
      <>
        <div style={{ marginBottom: 24 }}>探头卡回基座，请操作：</div>
        <Button type="primary" onClick={end}>结束监护</Button>
        <Divider type="vertical" />
        <Button onClick={replace}>更换探头</Button>
        <Divider type="vertical" />
        <Button onClick={cancel}>取消</Button>
      </>
    ),
    !!timeEndworkTipData && (
      <>
        <div style={{ marginBottom: 24 }}>监护时间到，请操作：<Button style={{ float: 'right' }} onClick={() => setVisible(true)}>查看曲线</Button></div>
        <Button type="primary" onClick={end}>结束监护</Button>
        <Divider type="vertical" />
        <Button onClick={delay_endwork}>延长监护</Button>
        <Divider type="vertical" />
        <span >延长时间：</span>
        <InputNumber min={5} max={1000} step={5} value={time} onChange={setTime} formatter={v => v && `${v}${'分钟'}`}
          parser={v => v.replace('分钟', '')} />
      </>
    ),
  ].find(_ => !!_)
  return (
    <>
      {R || null}
      <Modal width="92%" bodyStyle={{ height: "80vh" }} visible={visible} onCancel={() => setVisible(false)} footer={null} title="查看曲线">
        {visible && <Ctg data={ctgData} suitType={1} />}
      </Modal>
    </>
  )
}

export default (ReplaceProbe)
