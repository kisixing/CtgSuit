import '@ant-design/compatible/assets/index.css';
import { Form } from 'antd';
import React, { FunctionComponent } from 'react';
import { formItemLayout } from './utils';



const Parameter: FunctionComponent = () => {
    const [form] = Form.useForm()

    return (
        <Form form={form} layout="horizontal" {...formItemLayout} >
            <div >{Parameter.displayName}</div>

        </Form>
    );
}
Parameter.displayName = '多参数设置'
export default Parameter
