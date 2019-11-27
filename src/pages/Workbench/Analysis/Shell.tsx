import React from 'react';
import { Modal } from 'antd';

import moment from 'moment';


interface IProps extends React.Props<any> {
    docid: string
    visible: boolean
    onCancel: () => void
    inpatientNO: string
    name: string
    age: number
    startTime: string
    gestationalWeek: string
}
function Shell({ visible, onCancel, docid = '', name = '', age = 0, startTime = '', inpatientNO = '', gestationalWeek = '', children }: IProps) {
    return (
        <Modal
            maskClosable={false}
            getContainer={false}
            destroyOnClose
            centered
            width="92%"
            footer={null}
            bodyStyle={{ height: "80vh" }}
            visible={visible}
            title={
                <div >
                    <span>档案号：{docid}</span>
                    {/* <span>档案号：{(dataSource.ctgexam && dataSource.ctgexam.note) || dataSource.documentno}</span> */}
                    <span>住院号：{inpatientNO}</span>
                    {/* <span>住院号：{(dataSource.pregnancy && dataSource.pregnancy.inpatientNO)}</span> */}
                    <span>姓名：{name}</span>
                    {/* <span>姓名：{dataSource.pregnancy && dataSource.pregnancy.name}</span> */}
                    <span>年龄：{age}</span>
                    {/* <span>年龄：{dataSource.pregnancy && dataSource.pregnancy.age}</span> */}
                    <span>孕周： {gestationalWeek}</span>
                    {/* <span>孕周： {dataSource.gestationalWeek}</span> */}
                    <span>监护日期：{startTime && moment(startTime).format('YYYY-MM-DD HH:mm:ss')}
                        {/* <span>监护日期：{dataSource.ctgexam && dataSource.ctgexam.startTime && moment(dataSource.ctgexam.startTime).format('YYYY-MM-DD HH:mm:ss')} */}
                    </span>
                </div>
            }

            onCancel={onCancel}
        >
            {children}
        </Modal>
    );
}

export default Shell;
