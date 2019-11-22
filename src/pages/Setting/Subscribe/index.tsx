import React, { useState, useEffect } from 'react';
import {  Button, Row, Col, Icon, Popover } from "antd";

import { connect, DispatchProp } from 'dva';
import Table from "./Table";
import useStupidConcat from './useStupidConcat'
interface IProps extends DispatchProp {
    subscribeData?: string[]
    [x: string]: any;
}

const C = (props: IProps) => {

    const { subscribeData, dispatch } = props
    const [editable, setEditable] = useState(false)
    const [selected, setSelected] = useState<string[]>([])
    useEffect(() => {
        setSelected(subscribeData)
    }, [subscribeData])

    const cancel = () => {
        setEditable(false)
        setSelected(subscribeData)
    }
    useEffect(() => {
    }, [])
    const comfirm = () => {
        setEditable(false)
        dispatch({ type: 'subscribe/setData', data: selected })
    }
    const remove = (key: string) => {
        const data = [...selected]
        data.splice(data.indexOf(key), 1)
        console.log(data)
        setSelected(data)
    }
    const { list } = useStupidConcat()

    return (
        <div style={{}} >
            <div style={{ fontWeight: 600, lineHeight: '40px' }}>
                <span>子机订阅</span>

                {/* {
                    editable ? (
                        <>
                            <Button style={{ marginLeft: 10 }} onClick={empty}>全空</Button>
                            <Button style={{ marginLeft: 10 }} onClick={all}>全选</Button>
                            <Button style={{ marginLeft: 10 }} type="primary" onClick={comfirm}>确认</Button>
                        </>
                    ) : (
                        )
                } */}
            </div>
            <Row gutter={6}>
                <Col span={20}>
                    <div style={{
                        padding: 10, border: '2px solid var(--theme-color)', borderRadius: 4, height: 110, cursor: editable ? 'auto' : 'not-allowed'
                    }}>
                        {
                            selected.map(id => {
                                const _ = list.find(_ => _.deviceno === id)
                                if (!_) return null
                                const deviceno = _.deviceno
                                return (
                                    <Button onClick={e => { remove(deviceno) }} disabled={!editable} size="small" style={{ margin: '0 4px 4px 0' }} key={deviceno}>
                                        {`${_.areaname}：${_.bedname}`}
                                        <Icon type="close"></Icon>
                                    </Button>
                                )
                            })
                        }
                    </div>

                    <Table />

                </Col>
                <Col span={4}>
                    <Button style={{ marginBottom: 6, width: 74 }} onClick={() => editable ? comfirm() : setEditable(!editable)}>{editable ? '确认' : '编辑'}</Button><br />
                    <Button style={{ marginBottom: 6, width: 74 }} onClick={cancel}>重置</Button><br />
                    <Popover placement="right" content={<img style={{width:100,height:100}} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAAEYCAIAAAAI7H7bAAAEfUlEQVR4nO3dS24bQRAFQdHQ/a9M38AqwOly9zBiLYg/JHrz0PN6v99fwN/59b/fADyBkCAgJAgICQJCgoCQICAkCAgJAkKCgJAgICQIfE/+6PV6/ev3cbLJHPHSr+jBH60yHKM6kSAgJAgICQJCgoCQICAkCAgJAkKCgJAgICQICAkCo63dxKX341VDsmq0Nvwaw3+V+PBf/8uJBAkhQUBIEBASBIQEASFBQEgQEBIEhAQBIUFASBDItnYTyzeknTYAC9/P8rQv8exf34kEASFBQEgQEBIEhAQBIUFASBAQEgSEBAEhQUBIEFjd2j3Y5v144ctRcSJBQEgQEBIEhAQBIUFASBAQEgSEBAEhQUBIEBASBGztGtUtasMR3WlX9uFEgoCQICAkCAgJAkKCgJAgICQICAkCQoKAkCAgJAgICQKro9UPn1p++K2Oz/71nUgQEBIEhAQBIUFASBAQEgSEBAEhQUBIEBASBIQEgWxr9+FDssnHn4zNwq+xekvVaz2bEwkCQoKAkCAgJAgICQJCgoCQICAkCAgJAkKCgJAg8Hr2bWNPtbmjY8KJBAEhQUBIEBASBIQEASFBQEgQEBIEhAQBIUFASBBY3dodePnbxOZbWh7IHbjZO+06vuFrOZEgICQICAkCQoKAkCAgJAgICQJCgoCQICAkCAgJAqvPkK1Ga8P50+Zqq/poZoSV5RmhEwkCQoKAkCAgJAgICQJCgoCQICAkCAgJAkKCgJAg8OR77W4ckoUfbdPysO3AYacTCQJCgoCQICAkCAgJAkKCgJAgICQICAkCQoKAkCAgJAhkF0RWHnxD4qV3X25+/KHlQeqEEwkCQoKAkCAgJAgICQJCgoCQICAkCAgJAkKCgJAgkF0QedpNi1+7b2l52TVx2h7PBZHAD4QEASFBQEgQEBIEhAQBIUFASBAQEgSEBAEhQWD1YcwPduDWrnLgRztw2OlEgoCQICAkCAgJAkKCgJAgICQICAkCQoKAkCAgJAiMtnbLz3U9zeaQ7MAHrS6/1qWLRCcSBIQEASFBQEgQEBIEhAQBIUFASBAQEgSEBAEhQeC7+keXTqSqsdnyTWub68fql7306cBDTiQICAkCQoKAkCAgJAgICQJCgoCQICAkCAgJAkKCQLa1m1i+H+/G+d+DrxBcvteuumpv+H6cSBAQEgSEBAEhQUBIEBASBIQEASFBQEgQEBIEhAQBIUFgdbT6YJc+07paiIbrz+pfhW9pwokEASFBQEgQEBIEhAQBIUFASBAQEgSEBAEhQUBIELC1a1z6MOYD538TB+7xnEgQEBIEhAQBIUFASBAQEgSEBAEhQUBIEBASBIQEgdWt3Y1PRx6qll2Xjt8mwo+2+cDmIScSBIQEASFBQEgQEBIEhAQBIUFASBAQEgSEBAEhQeB16cNPN21OBJe/6s1ff/nKPvfawX2EBAEhQUBIEBASBIQEASFBQEgQEBIEhAQBIUFgtLUD/syJBAEhQUBIEBASBIQEASFBQEgQEBIEhAQBIUFASBAQEgR+AwAEHzh5cZZFAAAAAElFTkSuQmCC" />} trigger="click">
                        <Button onClick={cancel}>二维码</Button><br />

                    </Popover>
                </Col>
            </Row>
        </div >
    );
};

export default connect((state: any) => ({ subscribeData: state.subscribe.data, data: [...new Set(state.list.rawData.map(_ => `${_.areaname}-${_.bedname}-${_.deviceno}`))] }))(C)
const columns = [
    {
        title: '病区号',
        dataIndex: 'areano',
        key: 'areano',
    },
    {
        title: '病区名',
        dataIndex: 'areaname',
        key: 'areaname',
    },
    {
        title: '设备号',
        dataIndex: 'deviceno',
        key: 'deviceno',
    },
    {
        title: '设备名',
        dataIndex: 'bedname',
        key: 'bedname',
    },
    {
        title: '子机号',
        dataIndex: 'bedno',
        key: 'bedno',
    },
];