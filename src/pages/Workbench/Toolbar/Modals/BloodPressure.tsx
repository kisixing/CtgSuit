import '@ant-design/compatible/assets/index.css';
import { ICacheItem, WsService } from '@lianmed/lmg/lib/services/WsService';
import { Button, InputNumber, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import store from "store";

const BLOODPRESSURE_INTERVAL = 'BLOODPRESSURE_INTERVAL'
const socket = WsService._this;

interface IProps {
    visible: boolean
    data: ICacheItem
    onCancel: () => void
}

export const BloodPressure = (props: IProps) => {
    const { visible, onCancel, data } = props;
    const [timeInterval, setTimeInterval] = useState(store.get(BLOODPRESSURE_INTERVAL) || 5)
    const [autoVisible, setAutoVisible] = useState(false)
    const { isauto_blood_pressure, id } = data


    function sendBloodPressure(isAuto: 0 | 1 | 2 | 3, time = 0) {
        socket.sendBloodPressure(id, isAuto, time)
        onCancel()
    }
    return (
        <Modal
            getContainer={false}
            centered
            destroyOnClose
            visible={visible}

            onCancel={onCancel}

            footer={isauto_blood_pressure ?
                (
                    <>
                        <Button onClick={onCancel}>取消</Button>
                        <Button type="primary" onClick={() => {
                            sendBloodPressure(3)
                        }}>确定</Button>
                    </>
                ) : (
                    <>
                        <Button type="primary" onClick={() => {
                            sendBloodPressure(0)
                        }}>手动测量</Button>
                        <Button type="primary" onClick={() => setAutoVisible(true)}>自动测量</Button>
                    </>
                )}
        >
            {
                isauto_blood_pressure ? '提示: 是否停止定时测量血压' : '提示: 请选择血压测量方式'
            }
            <Modal
                getContainer={false}
                centered
                okText="确定" cancelText="取消" visible={autoVisible}
                onCancel={() => setAutoVisible(false)}
                onOk={() => {
                    sendBloodPressure(2, timeInterval)
                    setAutoVisible(false)
                }}>
                <span>设置测量时间间隔：</span>
                <InputNumber min={5} max={60} value={timeInterval} onChange={v => {
                    setTimeInterval(v);
                    store.set(BLOODPRESSURE_INTERVAL, v)
                }} />
                <span>分钟</span>
            </Modal>
        </Modal >
    );
}

export default BloodPressure;


