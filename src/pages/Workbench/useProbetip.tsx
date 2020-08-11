import { WsService } from '@lianmed/lmg';
import { event } from "@lianmed/utils";
import { useEffect } from "react";
const socket = WsService._this;



export default (dispatch: any) => {

    useEffect(() => {

        const on_replace_probe_tip = (unitId) => {

            // item cbs
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
        const replace_probe_tip_key = `item_probetip_wait_to_call`

        event
            .on(replace_probe_tip_key, on_replace_probe_tip)
        return () => {
            event
                .off(replace_probe_tip_key, on_replace_probe_tip)
        }
    }, [])
    return []
}