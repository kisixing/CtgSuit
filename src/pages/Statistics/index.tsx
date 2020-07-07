import { printPdf } from "@/utils";
import { get } from '@lianmed/request';
import { Button, DatePicker, Table } from 'antd';
import { connect } from 'dva';
import moment, { Moment } from "moment";
import React, { useEffect, useState } from 'react';

moment.defaultFormat = 'YYYY-MM-DD'
interface IItem { date: string, day: number, all: number }
export default connect((s: any) => s.global)(
    (props: any) => {
        const ward = props.ward
        const [list, setList] = useState([])
        const [total, setTotal] = useState<IItem>()
        const [startTime, setStartTime] = useState<Moment>(moment().subtract(7, 'd'))
        const [endTime, setEndTime] = useState<Moment>(moment())

        const q = `?startTime=${startTime.format()}&endTime=${endTime.format()}&areaNo=${ward.wardId}`
        const printCb = () => {
            const url = `/prenatal-visits-report${q}`
            printPdf(url)
        }
        useEffect(() => {
            console.log('rr', props);
            get(`/prenatal-visits-report/list${q}`).then((r: IItem[]) => {
                if (Array.isArray(r)) {
                    setList(r.filter(_ => _.date !== 'total'))
                    setTotal(r.find(_ => _.date === 'total'))
                }
            })
        }, [q])
        return (
            <div style={{ margin: 12, background: '#fff', padding: 18 }}>
                <div style={{ marginBottom: 8 }}>
                    <span>开始日期</span> <DatePicker value={startTime} onChange={e => setStartTime(e)} />
                    <span style={{ marginLeft: 10 }}>结束日期</span> <DatePicker value={endTime} onChange={e => setEndTime(e)} />
                    <Button type="primary" onClick={printCb} style={{ float: 'right', }}>打印</Button>
                </div>
                <Table pagination={{ pageSize: 16 }} title={() => <span>总计:{total && total.all}</span>} bordered dataSource={list} rowKey="date" size="small" columns={[
                    { title: '日期', dataIndex: 'date' },
                    { title: '白班', dataIndex: 'day' },
                    { title: '合计', dataIndex: 'all' },
                ]}>

                </Table>
            </div>
        )
    }
)