import React, { useEffect, useState } from 'react';
import { Button, Modal, Radio, Slider, Switch, Form, message } from 'antd';
import { SoundOutlined } from "@ant-design/icons";
// import { request } from '@lianmed/utils';
import { event } from '@lianmed/utils';

import { WsService, ICacheItem, BedStatus } from '@lianmed/lmg/lib/services/WsService';
const socket = WsService._this;

interface IProps {
  onCancel: () => void
  fetel_num: number
  data: ICacheItem
}

export const SoundMultiModal = (props: IProps) => {
  let { onCancel, fetel_num, data } = props;
  const { id, device_no, bed_no, status } = data
  fetel_num = 1
  const [muteSet, setMuteSet] = useState(new Set<number>())
  const [radioValue, setRadioValue] = useState(1)
  const start = () => {
    event.emit(`item_start:${id}`,)
  }
  const cancel = () => {
    socket.cancelalloc(device_no, bed_no)
    onCancel()
  }
  function radioClick(v) {
    if (v === radioValue) {
      v = 1
    }
    socket.add_fhr(device_no, bed_no, v).then(({ res, fetal_num }) => {
      setRadioValue(v)
    })
    setMuteSet(new Set(Array.from(muteSet).filter(_ => _ <= v)))
  }

  if ([BedStatus.Working, BedStatus.Uncreated].includes(status)) {
    onCancel()
  }
  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };
  return (

    <div style={{ display: 'flex', minWidth: 420, background: '#fff', padding: 6 }}>
      <div style={{ flex: 1, padding: '0 10px' }}>


        <div style={{ display: 'flex' }}>
          {
            Array(radioValue).fill(0).map((_, i) => {
              i = i + 1
              const isMute = muteSet.has(i)
              return (
                <div onClick={() => {
                  if (isMute) {
                    muteSet.delete(i)
                  } else {
                    muteSet.add(i)
                  }
                  socket.mute_volume(device_no, bed_no, i, +!isMute)

                  setMuteSet(new Set(muteSet))
                }} key={i} style={{ marginRight: 10, width: 80, height: 80, cursor: 'pointer', borderRadius: 4, border: '1px solid #ccc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <SoundOutlined style={{ fontSize: 38, color: isMute ? '#666' : 'blue' }} />
                  <span>FHR{i}</span>
                </div>
              )
            })
          }
        </div>

        <div style={{ display: 'flex', alignItems: 'center', padding: '10px 0' }}>
          <span style={{ width: 80, fontSize: 18 }}>音量：</span>
          <Slider onAfterChange={v => {
            socket.change_volume(device_no, bed_no, v as number)
          }} />
        </div>



      </div>
      <div>

        <Radio onClick={e => radioClick(2)} style={radioStyle} checked={radioValue === 2}>
          <span style={{ fontSize: 18 }}>双胎</span>
        </Radio>
        <Radio onClick={e => radioClick(3)} style={radioStyle} checked={radioValue === 3}>
          <span style={{ fontSize: 18 }}>三胎</span>
        </Radio>
        <Button size="small" type="primary" onClick={start}>确定</Button>
        <br />

        <Button size="small" onClick={cancel}>取消</Button>
      </div>
    </div>
  );
}

export default (SoundMultiModal);
