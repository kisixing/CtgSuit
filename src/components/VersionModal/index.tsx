import React, { useState, useEffect } from 'react';
import { Modal, Form, Checkbox } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';

declare var __VERSION: string;
declare var __VERSION_MANIFEST: string[]
interface IProps {
    form: WrappedFormUtils
}

export const VersionModal = (props: IProps) => {
    const [visible, setVisible] = useState(false)
    const [noAlert, setNoAlert] = useState(false)
    useEffect(() => {
        const isNew = __VERSION !== localStorage.getItem('version')
        setVisible(isNew)
    }, [])


    return !!__VERSION_MANIFEST && (
        <Modal
            maskClosable={false}
            destroyOnClose
            visible={visible}
            title={`${__VERSION}版本更新说明`}
            cancelText={null}
            onCancel={() => {
                setVisible(false)
                // localStorage.setItem('version', __VERSION)
            }}
            onOk={() => {
                setVisible(false)
                noAlert && localStorage.setItem('version', __VERSION)
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

export default Form.create<IProps>()(VersionModal);

