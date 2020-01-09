import React, { useState } from 'react';
import { Button, Table, Input } from "antd";
import store from "@/utils/SettingStore";
import { TableRowSelection } from 'antd/lib/table';
import useStupidConcat from './useStupidConcat'
import { IBed } from '@/types';

interface IProps {
    onAdd: (data: string[]) => void
    [x: string]: any
}

const C = (props: IProps) => {
    const { onAdd } = props
    const [selected, setSelected] = useState<string[]>([])
    const [areano, setAreano] = useState<string>(store.getSync('ward').wardId as string)

    const { list, fetchList } = useStupidConcat(areano)

    const rowSelection: TableRowSelection<IBed> = {
        onChange: (selectedRowKeys: string[], selectedRows) => {
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
                <Input.Search value={areano} onSearch={fetchList} onChange={e => setAreano(e.target.value)} style={{ width: 160 }} placeholder="输入病区号" />
                <Button style={{ marginLeft: 6 }} type="primary" onClick={() => onAdd(selected)}>添加</Button>
            </div>
            <Table bordered scroll={{ y: 440 }} size="small" rowSelection={rowSelection} columns={columns} dataSource={list} rowKey="deviceno" pagination={false} />
        </>


    );
};

export default C
const columns = ([
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
] as any[]).map(_ => ({ ..._, align: 'left' }));