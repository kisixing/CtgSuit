import React, { useEffect, useState } from 'react';
import { Button, Modal, Radio, Slider, Switch, Form, message } from 'antd';
import { SoundOutlined, VerticalAlignMiddleOutlined } from "@ant-design/icons";
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
  const { id, device_no, bed_no, status, fetal_num } = data
  fetel_num = 1
  const [muteSet, setMuteSet] = useState(new Set<number>())
  // const [radioValue, setRadioValue] = useState(1)
  const start = () => {
    event.emit(`item_start:${id}`,)
  }
  const zero = () => {
    event.emit(`item_zero:${id}`,)
  }
  const cancel = () => {
    socket.cancelalloc(device_no, bed_no)
    onCancel()
  }
  // function radioClick(v) {
  //   if (v === radioValue) {
  //     v = 1
  //   }
  //   socket.add_fhr(device_no, bed_no, v).then(({ res, fetal_num }) => {
  //     setRadioValue(v)
  //   })
  //   setMuteSet(new Set(Array.from(muteSet).filter(_ => _ <= v)))
  // }

  if ([BedStatus.Working, BedStatus.Uncreated].includes(status)) {
    onCancel()
  }
  // const radioStyle = {
  //   display: 'block',
  //   height: '30px',
  //   lineHeight: '30px',
  // };
  return (

    <div style={{ display: 'flex', minWidth: 400, position: 'relative' }}>
      <div style={{ flex: 1 }}>


        <div style={{ display: 'flex' }}>
          {
            Array(fetal_num).fill(0).map((_, i) => {
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
                }} key={i} style={{ marginRight: 10, width: 80, height: 80, cursor: 'pointer', border: '1px solid #ccc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <SoundOutlined style={{ fontSize: 38, color: isMute ? '#666' : 'blue' }} />
                  <span>FHR{i}</span>
                </div>
              )
            })
          }
        </div>

        <div style={{ display: 'flex', alignItems: 'center', padding: '10px 0' }}>
          <span style={{ width: 120, fontSize: 18 }}>音量：</span>
          <Slider onAfterChange={v => {
            socket.change_volume(device_no, bed_no, v as number)
          }} />
          <Button type="primary" onClick={start} style={{ margin: '0 12px' }}>开始</Button>

          <Button onClick={cancel}>取消</Button>
        </div>



      </div>
      <div onClick={zero} style={{cursor:'pointer', background:'#eee',position: 'absolute', top: 0, right: 0, width: 80, height: 80, display: 'flex',flexDirection:'column' ,justifyContent: 'center', alignItems: 'center' }}>
        {/* 
        <Radio onClick={e => radioClick(2)} style={radioStyle} checked={radioValue === 2}>
          <span style={{ fontSize: 18 }}>双胎</span>
        </Radio>
        <Radio onClick={e => radioClick(3)} style={radioStyle} checked={radioValue === 3}>
          <span style={{ fontSize: 18 }}>三胎</span>
        </Radio> */}
        <VerticalAlignMiddleOutlined style={{fontSize:40}}/>
        <div style={{marginTop:4}}>宫缩调零</div>
      </div>
    </div>
  );
}

export default (SoundMultiModal);
