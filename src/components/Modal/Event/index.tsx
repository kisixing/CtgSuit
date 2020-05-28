import { WsService } from '@lianmed/lmg/lib/services/WsService';
import { Modal, Table, Input } from 'antd';
import React, { useState, useEffect } from 'react';
import { post, get } from "@lianmed/request";
import { formatDate } from "@lianmed/utils";
import moment from "moment";
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
            footer={null}
        >
            <Table size="small" dataSource={data} columns={[
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

            <Input.TextArea disabled={disabled} value={note} onChange={e => setNote(e.target.value)} onPressEnter={() => {
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
            }} placeholder="按回车提交" />
        </Modal >
    );
}

export default EventModal;


