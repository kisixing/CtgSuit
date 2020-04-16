import { useState, useEffect } from 'react';

import request from '@/utils/request';
import { Modal } from "antd";


export function useJb(pregnancyId: number, pvId: string) {


    const [jbLoading, setJbLoading] = useState(false)


    const jb = () => {
        Modal.confirm({
            content: '此操作将解除档案和孕妇的绑定，请谨慎操作！',
            onCancel() {

            },
            onOk() {
                setJbLoading(true)

                request.delete(`/prenatal-visits/${pvId}`)

            },
            cancelText:'取消',
            okText:'确定'

        })
    }

    useEffect(() => {
        if (jbLoading && !pregnancyId) {
            setJbLoading(false)
        }
    }, [pregnancyId, pvId])


    return { jbLoading, jb }

}
