import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Icon, Popover, Icon } from "antd";
import { qrcode } from '@lianmed/utils'
import { connect, DispatchProp } from 'dva';
import Table from "./Table";
import useStupidConcat from './useStupidConcat'
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
            <div style={{ lineHeight: '30px' }}>已订阅列表</div>

            <Row gutter={6}>
                <Col span={20}>
                    <div style={{
                        position: 'relative', overflow: 'scroll', background: 'var(--theme-shadow-color)', padding: 4, borderRadius: 4, height: 140, cursor: editable ? 'auto' : 'not-allowed'
                    }}>
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
                        {
                            editable && (
                                <Icon type="close" onClick={() => setSelected([])} style={{ position: 'absolute', right: 0, bottom: 0, background: '#999', color: '#fff', padding: 2, borderRadius: '100%' }}>

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
                        editable && (
                            <>
                                <Button style={{ marginBottom: 6, width: 74 }} type="danger" onClick={cancel}>取消</Button><br />
                            </>
                        )
                    }
                    <QR placement="right" trigger="click" text="aa">
                        <Button>二维码</Button>
                    </QR>
                </Col>
            </Row>
        </div >
    );
};


const S = connect((state: any) => ({ subscribeData: state.subscribe.data, data: [...new Set(state.list.rawData.map(_ => `${_.areaname}-${_.bedname}-${_.deviceno}`))] }))(C)
export const QR = (props: { text: string='', [x: string]: any }) => {
    const {text,children,...others} = props
    const [src, setSrc] = useState('')
    useEffect(()=>{
        qrcode.toDataURL(text).then(_ => setSrc(_))
    },[])
    return (
    <Popover placement="right" {...others} content={<img style={{ width: 100, height: 100 }} src={src} />} trigger="click">
        {
            children
        }
    </Popover>
    )
}
export default S