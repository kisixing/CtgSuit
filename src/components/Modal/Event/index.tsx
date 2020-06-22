import { get, post } from "@lianmed/request";
import { Button, Input, Modal, Table } from 'antd';
import moment from "moment";
import React, { useEffect, useState } from 'react';
interface IProps {
    visible: boolean
    onCancel: () => void
    docid: string
    disabled?: boolean
}
interface IDataItem {
    createDate: string
    docid: string
    eventtype: string
    id: number
    note: string
    recorder: string
}
export const EventModal = (props: IProps) => {
    const { visible, onCancel, docid, disabled } = props;
    const [data, setData] = useState<IDataItem[]>([])
    const [note, setNote] = useState('')
    useEffect(() => {
        visible && fetchData()
    }, [visible])
    const fetchData = () => {


        get('/events', {
            params: {
                'docid.equals': docid
            }
        }).then((r: IDataItem[]) => r && setData(r.map(_ => ({ ..._, createDate: moment(_.createDate).format('YYYY-MM-DD mm:ss') }))))
    }
    return (
        <Modal
            width={900}
            getContainer={false}
            centered
            destroyOnClose
            visible={visible}
            okText="确定"
            cancelText="取消"
            bodyStyle={{ paddingRight: '48px' }}
            onCancel={onCancel}
            onOk={() => {

            }}
            title="事件记录"
            footer={null}
        >
            <Table size="small" bordered dataSource={data} columns={[
                {
                    dataIndex: 'createDate',
                    title: '记录时间'
                },
                {
                    dataIndex: 'note',
                    title: '记录内容',
                    width: 600
                },
                {
                    dataIndex: 'recorder',
                    title: '操作人'

                }
            ]} />
            <div style={{ position: 'relative' }}>

                <Input.TextArea rows={4} disabled={disabled} value={note} onChange={e => setNote(e.target.value)} placeholder="请输入事件记录内容" />
                <Button type="primary" size="small" style={{ position: 'absolute', right: 10, bottom: 10 }} onClick={
                    () => {
                        post('/events', {
                            data: {
                                docid,
                                note
                            }
                        })
                            .then(() => {
                                fetchData()
                                setNote('')
                            })
                    }
                }>
                    <span>确认</span>
                </Button>
            </div>
        </Modal >
    );
}

export default EventModal;


