// import printElement from './printElement';
import React, { useState, useEffect, useCallback,memo } from 'react';
import { connect } from 'dva';
import { Document, Page } from 'react-pdf';
import { Pagination, Button, Spin, } from 'antd';
import { ipcRenderer } from 'electron';
import config from '@/utils/config';
import { Context } from './index'

// import pdf from './pdfBase64';
import 'react-pdf/dist/Page/AnnotationLayer.css';
const styles = require('./Preview.less')
const Preview = props => {
  const { pdfflow, dataSource } = props;
  const pdfurl = dataSource.data && dataSource.data.docid;
  const filePath = `${config.apiPrefix}/ctg-exams-pdfurl/${pdfurl}` || 'http://www.orimi.com/pdf-test.pdf'
  // const [pdfBase64, setPdfBase64] = useState(`data:application/pdf;base64,${pdf}`)
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)

  const [startingTime, setStartingTime] = useState(0)
  const [value, setValue] = useState<{ suit: any }>({ suit: null })
  const [lock, setLock] = useState(false)
  useEffect(() => {
    const cb = startingTime => {
      setStartingTime(
        startingTime
      )
    }
    if (value.suit) {

      value.suit.on('suit:startTime', v => {
        cb(v)
      })
    }
    return () => {
      value.suit && value.suit.off('suit:startTime', cb)
    };
  }, [value])

  const onDocumentLoad = useCallback(({ numPages }) => { setNumPages(numPages) }, [])
  const onChangePage = useCallback(page => { setPageNumber(page) }, [])
  const handlePrint = useCallback(
    (file) => {
      // console.log('88888888888', `${config.apiPrefix}/ctg-exams-pdfurl/${pdfurl}`);
      ipcRenderer.send('printWindow', filePath);
    }, [filePath])

  const toggleLock = () => {
    const nextV = !lock
    setLock(nextV)
    value.suit.emit('suit:receive', nextV)
  }




  // if (!pdfflow) {
  //   return <Empty style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', margin: 0 }} />;
  // }
  return (
    <Context.Consumer>
      {
        (v: any) => {
          setValue(v)
          return (
            <div style={{ display: 'flex', height: '100%' }}>
              <div className={styles.wrapper}>

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
                  <Page className={styles.page} pageNumber={pageNumber} scale={1.5} height={340} />
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
              </div>
              <div style={{ width: 300, padding: 24, background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>开始：{startingTime}</span>
                  <Button type="primary" onClick={toggleLock}>
                    {
                      lock ? '重置' : '确定'
                    }
                  </Button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>开始：123</span>

                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>时长：123</span>

                </div>
                <Button type="primary" className={styles.button} onClick={handlePrint}>
                  打印
            </Button>

              </div>
            </div>

          )
        }
      }
    </Context.Consumer>

  );
}

export default connect(({ item, loading }:any) => ({
  loading: loading,
  pdfflow: item.pdfflow,
}))(Preview);