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
    gestationalWeek?: string
}
function Shell({ visible, onCancel, docid = '', name = '', age = 0, startTime = '', inpatientNO = '', gestationalWeek = '', children }: IProps) {
    const S = props => <span style={{marginRight:6}} {...props}>{props.children}</span>
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
                    <S>档案号：{docid}</S>
                    {/* <span>档案号：{(dataSource.ctgexam && dataSource.ctgexam.note) || dataSource.documentno}</span> */}
                    <S>住院号：{inpatientNO}</S>
                    {/* <span>住院号：{(dataSource.pregnancy && dataSource.pregnancy.inpatientNO)}</span> */}
                    <S>姓名：{name}</S>
                    {/* <span>姓名：{dataSource.pregnancy && dataSource.pregnancy.name}</span> */}
                    <S>年龄：{age}</S>
                    {/* <span>年龄：{dataSource.pregnancy && dataSource.pregnancy.age}</span> */}
                    <S>孕周： {gestationalWeek}</S>
                    {/* <span>孕周： {dataSource.gestationalWeek}</span> */}
                    <S>监护日期：{startTime && moment(startTime).format('YYYY-MM-DD HH:mm:ss')}
                        {/* <S>监护日期：{dataSource.ctgexam && dataSource.ctgexam.startTime && moment(dataSource.ctgexam.startTime).format('YYYY-MM-DD HH:mm:ss')} */}
                    </S>
                </div>
            }

            onCancel={onCancel}
        >
            {children}
        </Modal>
    );
}

export default Shell;
