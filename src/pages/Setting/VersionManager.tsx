import React, { useState } from "react";
import { Form, Upload, message, Button, Icon, Input } from 'antd';
import { WrappedFormUtils } from "antd/lib/form/Form";
import { request } from "@lianmed/utils";

const AliyunOSSUpload = (props: { [x: string]: any }) => {
    const [OSSData, setOSSData] = useState<any>({})


    const onChange = ({ fileList }) => {
        const { onChange } = props;
        console.log('Aliyun OSS:', fileList);
        if (onChange && fileList.length > 0) {
            onChange([fileList[fileList.length - 1]]);
        }
    };

    const onRemove = file => {
        const { value, onChange } = props;

        const files = value.filter(v => v.url !== file.url);

        if (onChange) {
            onChange(files);
        }
    };

    const transformFile = file => {
        debugger
        const suffix = file.name.slice(file.name.lastIndexOf('.'));
        const filename = Date.now() + suffix;
        file.url = OSSData.dir + filename;

        return file;
    };

    const getExtraData = file => {

        return {
            key: file.url,
            OSSAccessKeyId: OSSData.accessId,
            policy: OSSData.policy,
            Signature: OSSData.signature,
        };
    };



    const { value } = props;
    const p = {
        name: 'file',
        fileList: value,
        // action: OSSData.host,
        onChange: onChange,
        onRemove: onRemove,
        transformFile: transformFile,
        data: getExtraData,
    };
    return (
        <Upload  {...p} beforeUpload={e => { console.log(22, e); return false }} >
            <Button>
                <Icon type="upload" /> <span>Click to Upload </span>
            </Button>

        </Upload>
    );
}

const FormPage = (props: any) => {
    const [loading, setLoading] = useState(false)
    const form: WrappedFormUtils = props.form
    const { getFieldDecorator } = form;

    const submit = (e) => {
        const fd = new FormData()
        const values = form.getFieldsValue()
        // values.file = values.file[0].
        const data = Object.entries(values)
            .filter(([k, v]) => !!v)
            .reduce((a, [k, v]) => {
                if (k === 'file') {
                    v = v[0].originFileObj
                }
                a.append(k, v)
                return a
            }, fd);
        setLoading(true)
        request.post('/upload', { data }).then(r => {
            setLoading(false)

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
            <Form.Item label="file">{getFieldDecorator('file')(<AliyunOSSUpload />)}</Form.Item>
            <Form.Item label="name">{getFieldDecorator('name')(<Input />)}</Form.Item>
            <Form.Item label="type">{getFieldDecorator('type')(<Input />)}</Form.Item>
            <Form.Item label="uri">{getFieldDecorator('uri')(<Input />)}</Form.Item>
            <Form.Item label="description">{getFieldDecorator('description')(<Input.TextArea />)}</Form.Item>
            <Form.Item label=" " colon={false}><Button onClick={submit} loading={loading}>上传</Button></Form.Item>
        </Form >
    );
}

export default Form.create()(FormPage);
