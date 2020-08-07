import request from '@/utils/request';
import '@ant-design/compatible/assets/index.css';
import { WsService, ICacheItem } from '@lianmed/lmg/lib/services/WsService';
import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import SoundMultiModal from './SoundMultiModal'
import { event } from '@lianmed/utils';
const socket = WsService._this;

interface IProps {
    data: ICacheItem
    setMaskVisible: (v: boolean) => void
}

export const RenderMaskIn = (props: IProps) => {
    const { data, setMaskVisible } = props
    const { device_no, bed_no, id } = data
    console.log('RenderMaskIn', props)
    const fn = () => {

    }
    const cancel = () => {
        socket.cancelalloc(device_no, bed_no)
        setMaskVisible(false)
    }
    const start = () => {
        event.emit(`item_start:${id}`,)
    }
    return (
        <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <SoundMultiModal onCancel={cancel} start={start} volumeData={null} fetel_num={1} deviceno={device_no} bedno={bed_no} />
        </div>
    );
}



