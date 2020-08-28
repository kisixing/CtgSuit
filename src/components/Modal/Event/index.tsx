import { get, post } from "@lianmed/request";
import { Button, Input, Modal, Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { formatTime } from "@lianmed/utils/lib/fn/moment";
interface IProps {
    visible: boolean
    onCancel: () => void
    docid: string
    disabled?: boolean
    readonly?: boolean
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
    const { visible, onCancel, docid, disabled, readonly } = props;
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
        }).then((r: IDataItem[]) => r && setData(r.map(_ => ({ ..._, createDate: formatTime(_.createDate) }))))
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
            {
                !readonly && (
                    <div style={{ position: 'relative' }}>

                        <Input.TextArea maxLength={50} rows={4} disabled={disabled} value={note} onChange={e => setNote(e.target.value)} placeholder="请输入事件记录内容" />
                        <Button type="primary" size="small" style={{ position: 'absolute', right: 10, bottom: 10 }} onClick={
                            () => {
                                if (!note) {
                                    message.warning({ content: '事件记录为空！' })
                                } else {
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
                            }
                        }>
                            <span>保存</span>
                        </Button>
                    </div>
                )
            }
        </Modal >
    );
}

export default EventModal;


