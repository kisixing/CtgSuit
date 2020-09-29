/**
 * 胎监主页PDA建档/绑定弹窗
 */
import '@ant-design/compatible/assets/index.css';
import { ICacheItem, WsService } from '@lianmed/lmg/lib/services/WsService';
// import { request } from '@lianmed/utils';
import { event } from '@lianmed/utils';
import { Button, Divider, InputNumber, Modal, Tag } from 'antd';
import React, { useState, useEffect } from 'react';
import store from "store";
import { Ctg } from '@lianmed/lmg';
import { useCtgData } from '@lianmed/pages/lib/Ctg/Analyse';
import { post } from "@lianmed/request";
import { obvue } from "@lianmed/f_types";

const socket = WsService._this;
interface IProps {

  onCancel: () => void
  data: ICacheItem

}
const DELAY_TIME_KEY = 'DELAY_TIME_KEY'
const ReplaceProbe = ({ data, onCancel }: IProps) => {
  const { device_no, bed_no, id, replaceProbeTipData, addProbeTipData, timeEndworkTipData, isUncreated, docid } = data
  const [time, setTime] = useState((store.get(DELAY_TIME_KEY) || 10) as number)
  const [info, setInfo] = useState('')
  function cancel() {
    onCancel()
    data.addProbeTipData = null
    data.replaceProbeTipData = null
    data.timeEndworkTipData = null
  }
  if (!(data.addProbeTipData || data.replaceProbeTipData || data.timeEndworkTipData)) {
    onCancel()
  }
  const { ctgData } = useCtgData(docid)
  ctgData.selectBarHidden = true
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (timeEndworkTipData) {
      post(`/ctg-exams-analyse`, {
        data: { docid, mark: 'Sogc', start: 0, end: data.index / 2, fetal: 1 },
      }).then((r: obvue.ctg_exams_analyse) => {
        const { analysis: { ltv, acc } } = r

        if (ltv <= 5 || acc.filter(_ => _.reliability >= 50).length < 2) {
          setInfo('温馨提示：建议延长监护时间。')
        }

      }).catch(() => setInfo('温馨提示：建议延长监护时间。'))
    }
  }, [timeEndworkTipData, docid])
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
        {info && (
          <div style={{ position: 'relative', height: 0 }}>
            <Tag color="blue" style={{ position: 'absolute', margin: '0 auto', left: 0, right: 0, width: 180, bottom: 20 }}>{info}</Tag>
          </div>
        )}
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
