import request from '@/utils/request';
import '@ant-design/compatible/assets/index.css';
import { WsService, ICacheItem } from '@lianmed/lmg/lib/services/WsService';
import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import SoundMultiModal from './SoundMultiModal'
import ReplaceProbe from './ReplaceProbe'
import { event } from '@lianmed/utils';
const socket = WsService._this;

interface IProps {
    data: ICacheItem
    setMaskVisible: (v: boolean) => void
}

export const RenderMaskIn = (props: IProps) => {
    const { data, setMaskVisible } = props
    const [visibleArr, setVisibleArr] = useState([true, !!data.replaceProbeTipData])

    const { device_no, bed_no, id } = data
    console.log('RenderMaskIn', props)
    const fn = () => {

    }
    const cancel = (n: number) => {
        visibleArr[n] = false
        setVisibleArr([...visibleArr])
    }
    const start = () => {
        event.emit(`item_start:${id}`,)
    }
    const contentArr = [
        <SoundMultiModal onCancel={() => cancel(0)} volumeData={null} data={data} fetel_num={1} />,
        <ReplaceProbe onCancel={() => {
            cancel(1);
            data.replaceProbeTipData = null
        }} data={data} />
    ]
    useEffect(() => {
        if (!visibleArr.some(_ => _)) {
            setMaskVisible(false)
            console.log('renderItem sb')
        }
    }, [visibleArr])
    return (
        <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {
                visibleArr.reduceRight((pre, cur, idx) => {
                    if (pre) {
                        return pre
                    }
                    if (cur) {
                        return (contentArr[idx] || null)
                    }
                    return null
                }, null as any)
            }
        </div>
    );
}



