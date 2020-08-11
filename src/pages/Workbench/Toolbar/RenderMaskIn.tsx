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
    useEffect(() => {
        event.on('item_probetip_wait_to_call', _id => {
            if (id === _id) {
                visibleArr[1] = true
                setVisibleArr([...visibleArr])
            }
        })
    }, [id, visibleArr])
    const cancel = (n: number) => {
        visibleArr[n] = false
        setVisibleArr([...visibleArr])
    }
    const start = () => {
        event.emit(`item_start:${id}`,)
    }
    const contentArr = [
        <SoundMultiModal onCancel={() => cancel(0)} data={data} fetel_num={1} />,
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
            <div style={{ background: '#fff', padding: 12, boxShadow: '0 0 6px 2px #777', borderRadius: 2, overflow: 'hidden' }}>
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
        </div>
    );
}



