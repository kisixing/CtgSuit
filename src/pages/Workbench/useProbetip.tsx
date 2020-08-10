import React, { useEffect, useCallback, useRef, MutableRefObject } from "react";
import ReactDOM from 'react-dom';
import { event } from "@lianmed/utils";
import { _end } from './Toolbar/index';
import { Button, Modal } from "antd";
import { setItemCbs } from "@/utils";
import { WsService } from '@lianmed/lmg';
const socket = WsService._this;



export default (dispatch: any) => {

    useEffect(() => {

        const on_replace_probe_tip = (unitId, docid, data) => {

            // item cbs

            setItemCbs(unitId, () => {
                event.emit(`item_probetip:${unitId}`)
                setItemCbs(unitId, null)
            })
            dispatch({
                type: 'list/setPageByUnitId', unitId,
            });
            // item cbs
            // Modal.success({
            //     content: (
            //         <>

            //             <Button type="danger" onClick={() => { _end(device_no, bed_no, docid); Modal.destroyAll() }}>结束监护</Button>
            //             <Button type="primary" onClick={() => { socket.replace_probe(+device_no, +bed_no, data); Modal.destroyAll() }}>更换探头</Button>
            //             <Button onClick={() => Modal.destroyAll()}>取消</Button>
            //         </>
            //     ),
            // });
        }
        const replace_probe_tip_key = `item_probetip`

        event
            .on(replace_probe_tip_key, on_replace_probe_tip)
        return () => {
            event
                .off(replace_probe_tip_key, on_replace_probe_tip)
        }
    }, [])
    return []
}