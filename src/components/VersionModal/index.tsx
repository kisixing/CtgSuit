import React, { useState, useEffect } from 'react';
import { Modal, Form } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';

declare var __VERSION: string;
declare var __VERSION_MANIFEST: string[]
interface IProps {
    form: WrappedFormUtils
}

export const SignModal = (props: IProps) => {
    const [visible, setVisible] = useState(false)
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
                localStorage.setItem('version', __VERSION)
            }}
            onOk={() => {
                setVisible(false)
                localStorage.setItem('version', __VERSION)
            }}
        >
            <ol>
                {
                    __VERSION_MANIFEST.map((_, i) => {
                        return <li key={i}>{i + 1}、{_}</li>
                    })

                }
            </ol>

        </Modal>
    )
}

export default Form.create<IProps>()(SignModal);

