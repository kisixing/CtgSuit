import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Icon, Popover } from "antd";
import { qrcode } from '@lianmed/utils'
import { connect, DispatchProp } from 'dva';
import Table from "./Table";
import useStupidConcat from './useStupidConcat'
import store from '@/utils/SettingStore'
console.log('qqq', qrcode)
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

    const comfirm = () => {
        setEditable(false)
        dispatch({ type: 'subscribe/setData', data: selected })
    }
    const remove = (key: string) => {
        const data = [...selected]
        data.splice(data.indexOf(key), 1)
        setSelected(data)
    }
    const { list } = useStupidConcat()

    return (
        <div style={{}} >
            <div style={{ lineHeight: '30px' }}>已订阅列表</div>

            <Row gutter={6}>
                <Col span={20}>
                    <div style={{
                        position: 'relative', background: 'var(--theme-shadow-color)', borderRadius: 4, cursor: editable ? 'auto' : 'not-allowed'
                    }}>
                        <div style={{ height: 140, overflow: 'scroll', padding: 4, }}>
                            {
                                selected.map(id => {
                                    const _ = list.find(_ => _.deviceno === id)
                                    if (!_) return null
                                    const deviceno = _.deviceno
                                    return (
                                        <Button onClick={e => { remove(deviceno) }} disabled={!editable} size="small" style={{ margin: '0 4px 4px 0' }} key={deviceno}>
                                            {`${_.areaname}：${_.bedname}`}
                                            {
                                                editable && (
                                                    <Icon type="close">

                                                    </Icon>
                                                )
                                            }
                                        </Button>
                                    )
                                })
                            }
                        </div>
                        {
                            editable && (
                                <Icon type="close" onClick={() => setSelected([])} style={{ position: 'absolute', right: 10, bottom: 10, background: '#999', color: '#fff', padding: 6, borderRadius: '100%' }}>

                                </Icon>
                            )
                        }
                    </div>

                    {
                        editable && <Table onAdd={data => setSelected([...new Set(selected.concat(data))])} />
                    }

                </Col>
                <Col span={4}>
                    <Button style={{ marginBottom: 6, width: 74 }} type="primary" onClick={() => editable ? comfirm() : setEditable(!editable)}>{editable ? '确认' : '编辑'}</Button><br />
                    {
                        editable ? (
                            <Button style={{ marginBottom: 6, width: 74 }} type="danger" onClick={cancel}>取消</Button>
                        ) : (
                                <QR placement="right" trigger="hover">
                                    <Button>二维码</Button>
                                </QR>
                            )
                    }

                </Col>
            </Row>
        </div >
    );
};


const S = connect((state: any) => ({ subscribeData: state.subscribe.data }))(C)
export const QR = connect((state: any) => ({ subscribeData: state.subscribe.data }))(
    (props: { subscribeData: string[], [x: string]: any }) => {
        const { subscribeData, children, ...others } = props
        const [src, setSrc] = useState('')
        useEffect(() => {
            qrcode.toDataURL(` subscribe_${store.getSync('area_type')}_${subscribeData.join(',')}`).then(_ => setSrc(_))
        }, [])
        return (
            <Popover {...others} content={<img style={{ width: 100, height: 100 }} src={src} />} trigger="click">
                {
                    children
                }
            </Popover>
        )
    }
)

export default S