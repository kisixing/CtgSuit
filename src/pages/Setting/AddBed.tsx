import React, { useState } from "react";
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Upload, message, Button, Input } from 'antd';
import { WrappedFormUtils } from "antd/lib/form/Form";
// import { request } from "@lianmed/utils";
import request from '@/utils/request';



const FormPage = (props: any) => {
    const { onOk } = props
    const [loading, setLoading] = useState(false)
    const form: WrappedFormUtils = props.form
    const { getFieldDecorator } = form;

    const submit = (e) => {
        const values = form.getFieldsValue()
        // values.file = values.file[0].
        const data = { ...values, status: '1' }
        setLoading(true)
        request.post('/bedinfos', { data }).then(r => {
            setLoading(false)
            onOk()
        })
    }

    return (

        <Form onSubmit={data => console.log(data)} {...{
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
        }
        }>



            <Form.Item label="bedname">{getFieldDecorator('bedname')(<Input />)}</Form.Item>
            <Form.Item label="deviceno">{getFieldDecorator('deviceno')(<Input />)}</Form.Item>
            <Form.Item label="subdevice">{getFieldDecorator('subdevice')(<Input />)}</Form.Item>
            <Form.Item label="bedno">{getFieldDecorator('bedno')(<Input />)}</Form.Item>
            <Form.Item label="type">{getFieldDecorator('type')(<Input />)}</Form.Item>
            <Form.Item label=" " colon={false}><Button onClick={submit} loading={loading}>新增</Button></Form.Item>
        </Form >
    );
}

export default Form.create<any>()(FormPage);
