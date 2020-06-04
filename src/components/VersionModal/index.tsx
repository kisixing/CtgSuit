import React, { useState, useEffect } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Checkbox } from 'antd';
import SettingStore from '@/utils/SettingStore';
const cache = SettingStore.cache
declare var __VERSION: string;
declare var __VERSION_MANIFEST: string[]
interface IProps {
}
const v = cache.inspectable ? '1.0.1.0' : __VERSION
export const VersionModal = (props: IProps) => {
    const [visible, setVisible] = useState(false)
    const [noAlert, setNoAlert] = useState(false)
    useEffect(() => {
        const isNew = v !== localStorage.getItem('version')
        setVisible(isNew)
    }, [])


    return !!__VERSION_MANIFEST && !!__VERSION_MANIFEST.length && (
        <Modal
            maskClosable={false}
            destroyOnClose
            visible={visible}
            title={`${v}版本更新说明`}
            cancelText={null}
            onCancel={() => {
                setVisible(false)
                // localStorage.setItem('version', __VERSION)
            }}
            onOk={() => {
                setVisible(false)
                noAlert && localStorage.setItem('version', v)
            }}
        >
            <ol>
                {
                    __VERSION_MANIFEST.map((_, i) => {
                        return <li key={i}>{i + 1}、{_}</li>
                    })

                }
                <Checkbox style={{ marginTop: 20 }} value={noAlert} onChange={e => setNoAlert(e.target.checked)}>不再提示</Checkbox>

            </ol>
        </Modal>
    )
}

export default VersionModal;

