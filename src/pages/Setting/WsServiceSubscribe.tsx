import React, { useState, useEffect } from 'react';
import { IBed } from "@/types";
import { Checkbox, Button } from "antd";
import store from "@/utils/SettingStore";
import { WsService } from "@lianmed/lmg";
interface IProps {
    data: IBed[];
    [x: string]: any
}

const C = (props: IProps) => {


    const [editable, setEditable] = useState(false)
    const [selected, setSelected] = useState<string[]>([])
    const refresh = () => {
        store.get('area_devices').then((res: string) => {
            console.log('zzz', res)
            res && setSelected(res.split(','))
        })
    }
    const commit = () => {
        const str = selected.join(',')
        store.set('area_devices', str).then(status => {
            status && WsService._this.send(JSON.stringify(
                {
                    name: "area_devices",
                    data: str
                }
            ))
        })
    }
    const cancel = () => {
        setEditable(false)
        refresh()
    }
    const comfirm = () => {
        setEditable(false)
        commit()
    }

    useEffect(() => {
        refresh()
    }, [])
    return (
        <div style={{}} >
            <div style={{ fontWeight: 600, lineHeight: '40px', marginBottom: '24px' }}>
                <span>子机订阅</span>

                {
                    editable ? (
                        <>
                            <Button style={{ marginLeft: 10 }} type="primary" onClick={comfirm}>确认</Button>
                            <Button style={{ marginLeft: 10 }} onClick={cancel}>取消</Button>
                        </>
                    ) : (
                            <Button style={{ marginLeft: 10 }} onClick={() => setEditable(!editable)}>编辑</Button>
                        )
                }
            </div>
            <Checkbox.Group disabled={!editable} onChange={(e: string[]) => setSelected(e)} value={selected}>
                {
                    [...new Set(props.data.map(_ => _.bedname.slice(0, _.bedname.indexOf('-'))))]
                        .map(_ => {
                            return <Checkbox value={_} key={_}>{_}</Checkbox>
                        })
                }
            </Checkbox.Group>
        </div>
    );
};

export default C