import React, { useState, useEffect, useCallback } from 'react';
import { Checkbox, Button, Row, Col, Input } from "antd";
import request from "@lianmed/request";
import store from "@/utils/SettingStore";
import { connect, DispatchProp } from 'dva';
import Table from "./Table";
interface IProps extends DispatchProp {
    subscribeData?: string[]
    [x: string]: any;
}

const C = (props: IProps) => {

    const { subscribeData, dispatch } = props
    const [editable, setEditable] = useState(false)
    const [selected, setSelected] = useState<string[]>([])
    const [areano, setAreano] = useState(store.getSync('areano'))
    const [list, setList] = useState([])
    useEffect(() => {
        setSelected(subscribeData)
    }, [subscribeData])
    const fetchList = useCallback(() => {
        request.get(`/bedinfos?${areano ? 'areano.equals=' + areano : ''}`).then(res => {
            setList(res)
        })

    }, [])

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
    const all = () => {
        setSelected(list.map(_ => _.slice(_.lastIndexOf('-') + 1)))

    }
    const empty = () => {
        setSelected([])
    }


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
                        < Checkbox.Group disabled={!editable
                        } onChange={(e: string[]) => setSelected(e)} value={selected}>
                            {
                                list.map(_ => {
                                    const lastIndex = _.lastIndexOf('-')
                                    const name = _.slice(0, lastIndex)
                                    const deviceno = _.slice(lastIndex + 1)
                                    return <Checkbox value={deviceno} key={deviceno}>{name}</Checkbox>
                                })
                            }
                        </Checkbox.Group>
                    </div>

                    <Table />

                </Col>
                <Col span={4}>
                    <Button style={{ marginBottom: 6, width: 74 }} onClick={() => editable ? confirm() : setEditable(!editable)}>{editable ? '确认' : '编辑'}</Button><br />
                    <Button style={{ marginBottom: 6, width: 74 }} onClick={cancel}>重置</Button><br />
                    <Button onClick={cancel}>二维码</Button><br />
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