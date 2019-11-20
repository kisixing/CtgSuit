import React, { useState, useEffect } from 'react';
import { Checkbox, Button } from "antd";

import { connect, DispatchProp } from 'dva';
interface IProps extends DispatchProp {
    subscribeData?: string[]
    data: string[];
    [x: string]: any;
}

const C = (props: IProps) => {

    const { subscribeData, dispatch, data } = props
    const [editable, setEditable] = useState(false)
    const [selected, setSelected] = useState<string[]>([])

    useEffect(() => {
        setSelected(subscribeData)
    }, [subscribeData])


    const cancel = () => {
        setEditable(false)
        setSelected(subscribeData)
    }

    const comfirm = () => {
        setEditable(false)
        dispatch({ type: 'subscribe/setData', data: selected })
    }


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
                {data.map(_ => {
                    return <Checkbox value={_} key={_}>{_}</Checkbox>
                })
                }
            </Checkbox.Group>
        </div>
    );
};

export default connect((state: any) => ({ subscribeData: state.subscribe.data, data: [...new Set(state.list.rawData.map(_ => _.deviceno))] }))(C)