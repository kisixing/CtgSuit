import React, { useState } from 'react';
import {  Button,   Table, Input } from "antd";
import store from "@/utils/SettingStore";
import { connect, DispatchProp } from 'dva';
import { TableRowSelection } from 'antd/lib/table';
import useStupidConcat from './useStupidConcat'
import { IBed } from '@/types';
interface IProps extends DispatchProp {
    subscribeData?: string[]
    [x: string]: any;
}

const C = (props: IProps) => {

    const { subscribeData, dispatch } = props
    const [selected, setSelected] = useState<string[]>([])
    const [areano, setAreano] = useState<string>(store.getSync('areano') as string)

    const { list, fetchList } = useStupidConcat(areano)

    // useEffect(() => {
    //     setSelected(subscribeData)
    // }, [subscribeData])



    const rowSelection: TableRowSelection<IBed> = {
        onChange: (selectedRowKeys: string[], selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelected(selectedRowKeys)
        },
        // getCheckboxProps: record => ({
        //     disabled: record.name === 'Disabled User', // Column configuration not to be checked
        //     name: record.name,
        // }),
        selectedRowKeys: selected
    };

    return (


        <>
            <div style={{ margin: '20px 0 10px' }}>
                <Input value={areano} onChange={e => setAreano(e.target.value)} style={{ width: 140 }} placeholder="输入病区号" />
                <Button style={{ marginLeft: 6 }} type="primary" onClick={fetchList}>搜索</Button>
                <Button style={{ marginLeft: 6 }} type="primary" onClick={() => dispatch({ type: 'subscribe/setData', data: selected.concat(subscribeData) })}>添加</Button>

            </div>
            <Table scroll={{ y: 440 }} size="small" rowSelection={rowSelection} columns={columns} dataSource={list} rowKey="deviceno" pagination={false} />
        </>


    );
};

export default connect((state: any) => ({ subscribeData: state.subscribe.data }))(C)
const columns = [
    {
        title: '病区号',
        dataIndex: 'areano',
        key: 'areano',
    },
    {
        title: '病区名',
        dataIndex: 'areaname',
        key: 'areaname',
    },
    {
        title: '设备号',
        dataIndex: 'deviceno',
        key: 'deviceno',
    },
    {
        title: '设备名',
        dataIndex: 'bedname',
        key: 'bedname',
    },
    {
        title: '子机号',
        dataIndex: 'bedno',
        key: 'bedno',
    },
];