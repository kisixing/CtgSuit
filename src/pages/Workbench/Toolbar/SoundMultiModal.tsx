import React, { useEffect, useState } from 'react';
import { Button, Modal, Radio, Slider, Switch, Form, message } from 'antd';
import { SoundOutlined } from "@ant-design/icons";
// import { request } from '@lianmed/utils';
import { WsService, IVolumeData } from '@lianmed/lmg/lib/services/WsService';
const socket = WsService._this;

interface IProps {
  onCancel: () => void
  start: () => void
  volumeData: IVolumeData
  deviceno: number
  bedno: number
  fetel_num: number
}

export const SoundMultiModal = (props: IProps) => {
  let { deviceno, volumeData, onCancel, bedno, fetel_num, start } = props;
  fetel_num = 1
  const [form] = Form.useForm()
  const [muteSet, setMuteSet] = useState(new Set<number>())
  const [radioValue, setRadioValue] = useState(1)
  function radioClick(v) {
    if (v === radioValue) {
      v = 1
    }
    socket.add_fhr(deviceno, bedno, v).then(({ res, fetal_num }) => {
      setRadioValue(v)
    })
    setMuteSet(new Set(Array.from(muteSet).filter(_ => _ <= v)))
  }

  useEffect(() => {
    if (volumeData) {
      const { vol, fetel_num } = volumeData
      const data = Array(fetel_num).fill(0).reduce((p, c, i) => {
        const n = i + 1
        const k = `isMute${n}`
        p[k] = !!volumeData[k]
        return p
      }, { vol })
      form.setFieldsValue(data)
    }
  }, [volumeData])

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
                  socket.mute_volume(deviceno, bedno, i, +!isMute)

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
          <span style={{ width: 80, fontSize: 20 }}>音量：</span>
          <Slider onAfterChange={v => {
            socket.change_volume(deviceno, bedno, v as number)
          }} />
        </div>



      </div>
      <div>

        <Radio onClick={e => radioClick(2)} style={radioStyle} checked={radioValue === 2}>
          <span>双胎</span>
        </Radio>
        <Radio onClick={e => radioClick(3)} style={radioStyle} checked={radioValue === 3}>
          <span>三胎</span>
        </Radio>
        <Button size="small" type="primary" onClick={start}>确定</Button>
        <br />
        <Button size="small" onClick={onCancel}>取消</Button>
      </div>
    </div>
  );
}

export default (SoundMultiModal);
