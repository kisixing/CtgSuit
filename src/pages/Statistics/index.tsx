import { printPdf } from "@/utils";
import { get } from '@lianmed/request';
import { Button, DatePicker, Modal, Table } from 'antd';
import { connect } from 'dva';
import moment, { Moment } from "moment";
import React, { useEffect, useState, useRef } from 'react';
import PreviewContent from "@lianmed/pages/lib/Ctg/Report/Panel/PreviewContent";
import store from 'store';

moment.defaultFormat = 'YYYY-MM-DD'
interface IItem { date: string, day: number, all: number }
export default connect((s: any) => s.global)(
    (props: any) => {
        const [pdfBase64, setPdfBase64] = useState('');
        const isIn = (store.get('ward') || {}).wardType === 'in'
        const noLabel = isIn ? '住院号' : '卡号'
        const noKey = isIn ? 'inpatientNO' : 'cardNO';
        const ward = props.ward
        const [list, setList] = useState([])
        const [total, setTotal] = useState<IItem>()
        const [startTime, setStartTime] = useState<Moment>(moment().subtract(7, 'd'))
        const [endTime, setEndTime] = useState<Moment>(moment())
        const [wh, setWh] = useState({ w: 500, h: 700 });
        const [modalVisible, setModalVisible] = useState(false)
        const inputEl = useRef(null);

        // useEffect(() => {
        //     const { clientHeight, clientWidth } = inputEl.current;
        //     setWh({ h: clientHeight, w: clientWidth - 200 });
        // }, []);
        const q = `?startTime=${startTime ? startTime.format() : ''}&endTime=${endTime ? endTime.format() : ''}&areaNo=${ward.wardId}`
        const fetchpdf = () => {
            // setPdfBase64(null);
            get(`/prenatal-visits/report-preview${q}`)
                .then((pdfdata) => {
                    setPdfBase64(pdfdata ? `data:application/pdf;base64,${pdfdata}` : null);
                    setModalVisible(true)
                });
        };
        const printCb = () => {
            const url = `/prenatal-visits/report-print${q}`
            printPdf(url)
        }
        useEffect(() => {
            get(`/prenatal-visits/report-list${q}`).then((r: IItem[]) => {
                if (Array.isArray(r)) {
                    setList(r)
                    // setTotal(r.find(_ => _.date === 'total'))
                }
            })
            get(`/prenatal-visits/report-count${q}`).then(r => {
                setTotal(r)
            })
            // fetchpdf(q);
        }, [q])
        console.log('wh', wh)
        return (
            <div style={{ margin: 12, background: 'var(--customed-color)', padding: 18, height: 'calc(100% - 30px)' }}>
                <div style={{ marginBottom: 8 }}>
                    <span>开始日期</span> <DatePicker value={startTime} onChange={e => setStartTime(e)} />
                    <span style={{ marginLeft: 10 }}>结束日期</span> <DatePicker value={endTime} onChange={e => setEndTime(e)} />
                    <Button type="primary" disabled={!(startTime && endTime)} onClick={fetchpdf} style={{ float: 'right', }}>打印预览</Button>


                </div>
                <Table pagination={{ pageSize: 14 }} title={() => <span>总计:{total}</span>} bordered dataSource={list} rowKey="date" size="small" columns={[
                    { title: noLabel, dataIndex: noKey },
                    { title: '当前次数', dataIndex: 'times' },
                    { title: '姓名', dataIndex: 'name' },
                    { title: '日期', dataIndex: 'date' },
                    { title: '年龄', dataIndex: 'age' },
                    { title: '孕周', dataIndex: 'gestationalWeek' },
                    { title: '孕次', dataIndex: 'gravidity' },
                    { title: '产次', dataIndex: 'parity' },
                ].map(_ => ({ ..._, align: 'center' }))}>

                </Table>
                <Modal
                    ref={inputEl}
                    visible={modalVisible}
                    width={520}
                    closable={false}
                    okText="打印"
                    cancelText="取消"
                    onCancel={() => { setPdfBase64(null); setModalVisible(false) }}
                    onOk={printCb}
                >
                    <PreviewContent

                        pdfBase64={pdfBase64}
                        // pdfBase64={`${config.apiPrefix}/ctg-exams-pdfurl/${currentReport}`}
                        wh={wh}
                        isFull
                        borderd={false}
                    />
                </Modal>
            </div>
        )
    }
)