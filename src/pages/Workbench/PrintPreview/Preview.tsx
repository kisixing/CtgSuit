// import printElement from './printElement';
import React, { useState, useEffect, useCallback, memo } from 'react';
import { connect } from 'dva';
import { Document, Page } from 'react-pdf';
import { Pagination, Button, Spin, Empty, Input } from 'antd';
import { ipcRenderer } from 'electron';
import config from '@/utils/config';
import { Context } from './index'
import request from "@lianmed/request";
// import pdf from './pdfBase64';
import moment from 'moment'
import 'react-pdf/dist/Page/AnnotationLayer.css';
import usePrintConfig from "./usePrintConfig";
const styles = require('./Preview.less')


const COEFFICIENT = 240


const Preview = props => {
  const [value, setValue] = useState<{ suit: any }>({ suit: null })

  const {
    startingTime,
    endingTime,
    locking,
    customizable,
    remoteSetStartingTime,
    remoteSetEndingTime,
    toggleLocking,
    toggleCustomiz
  } = usePrintConfig(value)

  const { dataSource } = props;
  const { pregnancy, data, ctgexam } = dataSource
  let docid = '';
  let starttime = '';
  if (data) {
    docid = data.docid;
    starttime = data.starttime
  } else if (ctgexam) {
    docid = ctgexam.note;
    starttime = ctgexam.startTime
  }
  const filePath = `${config.apiPrefix}/ctg-exams-pdfurl/${docid}` || 'http://www.orimi.com/pdf-test.pdf'
  // const [pdfBase64, setPdfBase64] = useState(`data:application/pdf;base64,${pdf}`)
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [pdfflow, setPdfflow] = useState('')




  const onDocumentLoad = useCallback(({ numPages }) => { setNumPages(numPages) }, [])
  const onChangePage = useCallback(page => { setPageNumber(page) }, [])
  const handlePrint = useCallback((e) => { ipcRenderer.send('printWindow', filePath) }, [filePath])


  const handlePreview = () => {
    const params = {
      docid: docid,
      name: pregnancy.name,
      age: pregnancy.age,
      gestationalWeek: pregnancy.gestationalWeek,
      inpatientNO: pregnancy.inpatientNO,
      startdate: moment(starttime).format('YYYY-MM-DD HH:mm:ss'),
      fetalcount: 2,
      start: startingTime,
      end: endingTime,
    }
    request.post(`/ctg-exams-pdf`, {
      data: params,
    }).then(res => {
      const pdfData = res.pdfdata && `data:application/pdf;base64,${res.pdfdata}`;
      setPdfflow(pdfData)
    })
  }

  const PreivewContent = () => {
    const content = pdfflow ? (
      <>
        <Document
          className={styles.preview}
          loading={<Spin style={{ margin: '120px 0' }} />}
          onLoadSuccess={onDocumentLoad}
          file={pdfflow}
          renderMode="canvas"
          options={{
            cMapUrl: 'cmaps/',
            cMapPacked: true,
          }}
        >
          <Page className={styles.page} pageNumber={pageNumber} scale={1.5} height={130} />
        </Document>
        <Pagination
          className={styles.pagination}
          total={numPages}
          showTotal={total => `共 ${total} 页`}
          current={pageNumber}
          pageSize={1}
          size="small"
          onChange={onChangePage}
        />
      </>
    ) : (
        <Empty style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', margin: 0 }} />
      );
    return (
      <div className={styles.wrapper} >
        {content}
      </div >
    )
  }


  return (
    <Context.Consumer>
      {
        (v: any) => {
          setValue(v)
          return (
            <div style={{ display: 'flex', height: '100%' }}>
              <PreivewContent />
              <div style={{ width: 300, padding: 24, background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>开始时间：<Input size="small" style={{ width: 80 }} value={(startingTime/ COEFFICIENT).toFixed(1)} onChange={e => {
                    remoteSetStartingTime(parseFloat(e.target.value))
                  }} />分</span>
                  <Button type={locking ? 'danger' : 'primary'} onClick={toggleLocking} size="small">
                    {
                      locking ? '重置' : '确定'
                    }
                  </Button>
                </div>

                {/* TODO: 计算显示时间 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>结束时间：<Input size="small" style={{ width: 80 }} value={(endingTime/ COEFFICIENT).toFixed(1) } onChange={e => {
                    remoteSetEndingTime(parseFloat(e.target.value))
                  }} />分</span>

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
                    预览
                  </Button>

                  <Button block disabled={!pdfflow} type="primary" onClick={handlePrint}>
                    打印
                  </Button>

                </div>
              </div>
            </div>

          )
        }
      }
    </Context.Consumer>

  );
}

export default connect(({ item, loading }: any) => ({
  loading: loading,
}))(Preview);