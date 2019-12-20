import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Radio, Input, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';

declare var __VERSION: string;
declare var __VERSION_MANIFEST: { details: string[], version: string }[];
interface IProps {
    form: WrappedFormUtils
}

export const SignModal = (props: IProps) => {
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const isNew = __VERSION !== localStorage.getItem('version')
        setVisible(isNew)
    }, [])

    const target = __VERSION_MANIFEST.find(_ => _.version === __VERSION)
    return (
        target && target.details && (
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
                        target && target.details.map((_, i) => {
                            return <li>{i + 1}、{_}</li>
                        })

                    }
                </ol>

            </Modal>
        )
    );
}

export default Form.create<IProps>()(SignModal);

