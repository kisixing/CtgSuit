
import React, { useState, useCallback } from 'react';
import { Pagination, Button, Spin, Icon, Input, Modal } from 'antd';

import { Context } from './index'
import request from "@lianmed/request";
import usePrintConfig from "./usePrintConfig";
import useSign from "./useSign";
import PreviewContent from './PreviewContent'
const COEFFICIENT = 240

const Preview = props => {
  const { onDownload, docid, name, age, gestationalWeek, inpatientNO, startdate, fetalcount } = props;
  const [value, setValue] = useState<{ suit: any }>({ suit: null })
  const [diagnosis, setDiagnosis] = useState('观察      分钟，胎心基线     bpm，胎动    次，胎动时胎心    bpm,持续时间     s，胎心振幅范围            bpm  NST   反应。 ')
  const [pdfBase64, setPdfBase64] = useState('')
  const {
    startingTime,
    endingTime,
    locking,
    customizable,
    // remoteSetStartingTime,
    // remoteSetEndingTime,
    toggleLocking,
    toggleCustomiz
  } = usePrintConfig(value)
  const { signHandler, qrCodeBase64, modalVisible } = useSign(docid)
  const handlePreview = () => {
    request.post(`/ctg-exams-pdf`, {
      data: {
        name, age, gestationalWeek, inpatientNO, startdate, fetalcount,
        docid,
        diagnosis,
        start: startingTime,
        end: endingTime,
      },
    }).then(res => {
      const pdfData = res.pdfdata && `data:application/pdf;base64,${res.pdfdata}`;
      setPdfBase64(pdfData)
    })
  }


  return (
    <Context.Consumer>
      {
        (v: any) => {
          setValue(v)
          return (
            <div style={{ display: 'flex', height: '100%' }}>
              <PreviewContent pdfBase64={pdfBase64} wh={props.wh} />
              <div style={{ border: '1px solid #eee', width: 400, marginRight: 10, display: 'flex', flexDirection: 'column' }}>
                <label>NST报告结果</label>
                <Input.TextArea value={diagnosis} style={{ height: '100%', border: 0 }} onChange={e => setDiagnosis(e.target.value)}>

                </Input.TextArea>
              </div>

              <div style={{ width: 300, padding: 24, background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>开始时间：
                    {/* <Input size="small" style={{ width: 80 }} value={(startingTime/ COEFFICIENT).toFixed(1)} onChange={e => {
                    remoteSetStartingTime(parseFloat(e.target.value))
                  }} /> */}
                    {(startingTime / COEFFICIENT).toFixed(1)}
                    分

                  </span>
                  <Button type={locking ? 'danger' : 'primary'} onClick={toggleLocking} size="small">
                    {
                      locking ? '重置' : '确定'
                    }
                  </Button>
                </div>

                {/* TODO: 计算显示时间 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>结束时间：
                    {/* <Input  size="small" style={{ width: 80 }} value={(endingTime/ COEFFICIENT).toFixed(1) } onChange={e => {
                    remoteSetEndingTime(parseFloat(e.target.value))
                  }} /> */}
                    {(endingTime / COEFFICIENT).toFixed(1)}
                    分
                  </span>
                  {
                    locking && (
                      <Button type={customizable ? 'danger' : 'primary'} onClick={toggleCustomiz} size="small">
                        {
                          customizable ? '取消' : '选择'
                        }
                      </Button>
                    )
                  }
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>时长：{((endingTime - startingTime) / COEFFICIENT).toFixed(1) || 0}分</span>
                </div>
                <div style={{ display: 'flex' }}>
                  <Button block disabled={!locking} type="primary" onClick={handlePreview} style={{ marginRight: 10 }}>
                    生成
                  </Button>
                  <Button block disabled={!pdfBase64} type="primary" onClick={signHandler} style={{ marginRight: 10 }}>
                    签名
                  </Button>
                  <Button block disabled={!pdfBase64} type="primary" onClick={onDownload}>
                    打印
                  </Button>
                </div>
              </div>

              <Modal visible={modalVisible} footer={null} centered bodyStyle={{ textAlign: 'center' }}>
                <img src={qrCodeBase64} />
              </Modal>
            </div>
          )
        }
      }
    </Context.Consumer >
  );
}

export default Preview