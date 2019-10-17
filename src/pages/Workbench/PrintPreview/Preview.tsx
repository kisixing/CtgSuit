// import printElement from './printElement';
import React, { useState, useEffect, useCallback, memo } from 'react';
import { connect } from 'dva';
import { Document, Page } from 'react-pdf';
import { Pagination, Button, Spin, Empty } from 'antd';
import { ipcRenderer } from 'electron';
import config from '@/utils/config';
import { Context } from './index'
// import pdf from './pdfBase64';
import moment from 'moment'
import 'react-pdf/dist/Page/AnnotationLayer.css';
import store from "@/utils/SettingStore";
const settingData = store.cache
const styles = require('./Preview.less')


const COEFFICIENT = 240


const Preview = props => {
  const { pdfflow, dataSource, dispatch, } = props;
  const { pregnancy, data, ctgexam } = dataSource
  const pdfurl = dataSource.data && dataSource.data.docid;
  const filePath = `${config.apiPrefix}/ctg-exams-pdfurl/${pdfurl}` || 'http://www.orimi.com/pdf-test.pdf'
  // const [pdfBase64, setPdfBase64] = useState(`data:application/pdf;base64,${pdf}`)
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)

  const [startingTime, setStartingTime] = useState<number>(0)
  const [endingTime, setEndingTime] = useState<number>(0)

  const [value, setValue] = useState<{ suit: any }>({ suit: null })

  const [locking, setLocking] = useState(false)
  const [customizable, setCustomizable] = useState(false)
  useEffect(() => {
    const cb = startingTime => {
      const interval = settingData.print_interval
      setStartingTime(
        startingTime
      )
      //TODO: 计算结束时间
      setEndingTime(
        startingTime + Number(interval) * COEFFICIENT
      )
      //console.log('kisi',startingTime,startingTime + Number(interval)*240);
    }
    value.suit && value.suit.on('suit:startTime', cb)
    return () => {
      value.suit && value.suit.off('suit:startTime', cb)
    };
  }, [value])

  const onDocumentLoad = useCallback(({ numPages }) => { setNumPages(numPages) }, [])
  const onChangePage = useCallback(page => { setPageNumber(page) }, [])
  const handlePrint = useCallback(
    (file) => {
      ipcRenderer.send('printWindow', filePath);
    }, [filePath])

  const toggleLocking = () => {
    const nextV = !locking
    setLocking(nextV)
    value.suit.emit('locking', nextV)
  }
  const toggleCustomiz = () => {
    const nextV = !customizable
    setCustomizable(nextV)
    value.suit.emit('customizing', nextV)
  }
  const handlePreview = () => {
    let docid = '';
    let starttime = '';
    if (data) {
      docid = data.docid;
      starttime = data.starttime
    } else if (ctgexam) {
      docid = ctgexam.note;
      starttime = ctgexam.startTime
    }
    locking && dispatch({
      type: 'item/fetchPDFflow',
      payload: {
        docid: docid,
        name: pregnancy.name,
        age: pregnancy.age,
        gestationalWeek: pregnancy.gestationalWeek,
        inpatientNO: pregnancy.inpatientNO,
        startdate: moment(starttime).format('YYYY-MM-DD HH:mm:ss'),
        fetalcount: 2,
        start: startingTime,
        end: endingTime,
      },
    });
  }

  const PreivewContent = () => {
    console.log('zzzz pdfflow', pdfflow)
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
                  <span>开始时间：{(startingTime / COEFFICIENT).toFixed(1)}分</span>
                  <Button type={locking ? 'danger' : 'primary'} onClick={toggleLocking} size="small">
                    {
                      locking ? '重置' : '确定'
                    }
                  </Button>
                </div>

                {/* TODO: 计算显示时间 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>结束时间：{(endingTime / COEFFICIENT).toFixed(1)}分</span>
                  {
                    locking && (
                      <Button type={customizable ? 'danger' : 'primary'} onClick={toggleCustomiz} size="small">
                        {
                          customizable ? '取消' : '自定义'
                        }
                      </Button>
                    )
                  }
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>时长：{settingData.print_interval || 0}分</span>
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
  pdfflow: item.pdfflow,
}))(Preview);