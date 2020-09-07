import { SoundOutlined, VerticalAlignMiddleOutlined } from "@ant-design/icons";
import { BedStatus, ICacheItem, WsService } from '@lianmed/lmg/lib/services/WsService';
// import { request } from '@lianmed/utils';
import { event } from '@lianmed/utils';
import { Button, Slider } from 'antd';
import React, { useState } from 'react';

const socket = WsService._this;

interface IProps {
  onCancel: () => void
  data: ICacheItem
  simple?: boolean
}

export const SoundMultiModal = (props: IProps) => {
  let { onCancel, data, simple } = props;
  const { id, device_no, bed_no, status, fetal_num, batterylowArr, disableStartWork, is_include_toco, vol, MuteArr } = data
  // const [muteSet, setMuteSet] = useState(MuteArr)
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
    console.log('item_probetip_to_call cancel sound int');

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


        <div style={{ display: 'flex', height: 80 }}>
          {
            Array(fetal_num).fill(0).map((_, i) => {
              const islow = batterylowArr[i]
              const isMute = MuteArr[i]
              return (
                <Button onClick={() => {

                  socket.mute_volume(device_no, bed_no, i + 1, +!isMute)

                }} key={i} style={{ marginRight: 10, width: 80, height: 80, cursor: 'pointer', border: '1px solid #ccc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <SoundOutlined style={{ fontSize: 38, color: isMute ? 'blue' : '#666' }} />
                  <div style={{ fontSize: 12, marginTop: 4, color: islow ? 'red' : '#333' }}>
                    <span>FHR{i + 1}</span>
                    {
                      islow && <span>电量不足</span>
                    }
                  </div>

                </Button>
              )
            })
          }
        </div>

        <div style={{ display: 'flex', alignItems: 'center', padding: '10px 0' }}>
          <span style={{ width: 120, fontSize: 18 }}>音量：</span>
          <Slider defaultValue={vol} onAfterChange={v => {
            socket.change_volume(device_no, bed_no, v as number)
          }} />
          {
            !!simple || (
              <>
                <Button type="primary" onClick={start} disabled={disableStartWork} style={{ margin: '0 12px' }}>开始</Button>

                <Button onClick={cancel}>取消</Button>
              </>
            )
          }
        </div>



      </div>
      {
        !!is_include_toco && !simple && <Button onClick={zero} style={{ cursor: 'pointer', background: '#fff', position: 'absolute', border: '1px solid #ccc', top: 0, right: 0, width: 80, height: 80, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {/* 
        <Radio onClick={e => radioClick(2)} style={radioStyle} checked={radioValue === 2}>
          <span style={{ fontSize: 18 }}>双胎</span>
        </Radio>
        <Radio onClick={e => radioClick(3)} style={radioStyle} checked={radioValue === 3}>
          <span style={{ fontSize: 18 }}>三胎</span>
        </Radio> */}
          <VerticalAlignMiddleOutlined style={{ fontSize: 40, color: 'blue' }} />
          <div style={{ marginTop: 4 }}>宫缩调零</div>
        </Button>
      }
    </div>
  );
}

export default (SoundMultiModal);