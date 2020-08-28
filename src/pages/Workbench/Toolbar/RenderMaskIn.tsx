import '@ant-design/compatible/assets/index.css';
import { ICacheItem, WsService } from '@lianmed/lmg/lib/services/WsService';
import { event } from '@lianmed/utils';
import React, { useEffect, useState } from 'react';
import ReplaceProbe from './ReplaceProbe';
import SoundMultiModal from './SoundMultiModal';
const socket = WsService._this;

interface IProps {
    data: ICacheItem
    setMaskVisible: (v: boolean) => void
}

export const RenderMaskIn = (props: IProps) => {
    const { data, setMaskVisible } = props
    const [visibleArr, setVisibleArr] = useState([true, !!(data.replaceProbeTipData || data.addProbeTipData)])
    const { device_no, bed_no, id } = data

    useEffect(() => {
        const fn = _id => {

            if (id === _id) {

                visibleArr[1] = true
                setVisibleArr([...visibleArr])
            }
        }
        event.on('item_probetip_wait_to_call', fn)
        return () => {
            event.off('item_probetip_wait_to_call', fn)
        }
    }, [id, visibleArr])
    const cancel = (n: number) => {
        visibleArr[n] = false
        setVisibleArr([...visibleArr])
    }

    const contentArr = [
        <SoundMultiModal onCancel={() => cancel(0)} data={data} />,
        <ReplaceProbe onCancel={() => {
            cancel(1);
        }} data={data} />
    ]
    useEffect(() => {
        if (!visibleArr.some(_ => _)) {
            setMaskVisible(false)
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



