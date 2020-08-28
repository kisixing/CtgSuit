/**
 * 胎监主页PDA建档/绑定弹窗
 */
import '@ant-design/compatible/assets/index.css';
import { ICacheItem, WsService } from '@lianmed/lmg/lib/services/WsService';
// import { request } from '@lianmed/utils';
import { event } from '@lianmed/utils';
import { Button, Divider } from 'antd';
import React from 'react';



const socket = WsService._this;
interface IProps {

  onCancel: () => void
  data: ICacheItem

}
const ReplaceProbe = ({ data, onCancel }: IProps) => {
  const { device_no, bed_no, id, replaceProbeTipData, addProbeTipData, isUncreated } = data
  function cancel() {
    onCancel()
    data.addProbeTipData = null
    data.replaceProbeTipData = null
  }
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

  return addProbeTipData ? (

    <div >
      <div style={{ marginBottom: 24 }}>发现宫缩探头拔出，请操作：</div>

      <Button onClick={add} type="primary">加入监护</Button>
      <Divider type="vertical" />

      <Button onClick={onCancel}>取消</Button>
    </div>
  ) : (!!replaceProbeTipData &&
    <div >
      <div style={{ marginBottom: 24 }}>探头卡回基座，请操作：</div>
      <Button type="primary" onClick={end}>结束监护</Button>
      <Divider type="vertical" />
      <Button onClick={replace}>更换探头</Button>
      <Divider type="vertical" />
      <Button onClick={cancel}>取消</Button>
    </div>
    )
}

export default (ReplaceProbe)
