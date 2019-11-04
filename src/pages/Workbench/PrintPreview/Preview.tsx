// import printElement from './printElement';
import React, { useState, useCallback } from 'react';
import { connect } from 'dva';
import { Document, Page } from 'react-pdf';
import { Pagination, Button, Spin, Icon } from 'antd';
import Empty from '@/components/Empty'

import { ipcRenderer } from 'electron';
import config from '@/utils/config';
import { Context } from './index'
import request from "@lianmed/request";
import classnames from 'classnames';
import moment from 'moment'
import 'react-pdf/dist/Page/AnnotationLayer.css';
import usePrintConfig from "./usePrintConfig";
const styles = require('./Preview.less')


const COEFFICIENT = 240


const Preview = props => {
  const [value, setValue] = useState<{ suit: any }>({ suit: null })
  const [isFullpage, setFullpage] = useState(false);
  const [height, setHeight] = useState(200); //
  const [width, setWidth] = useState('100%')

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

  const { dataSource, from, getHeight } = props;
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
    let params = {};
    if (from !== "archives") {
      // 提取孕产信息
      const havePregnancy = data && data.pregnancy;
      const p = typeof havePregnancy === 'object' ? havePregnancy : havePregnancy && JSON.parse(data.pregnancy.replace(/'/g, '"'));

      params = {
        docid: data && data.docid,
        name: p.name,
        age: p.age,
        gestationalWeek: p.gestationalWeek,
        inpatientNO: p.inpatientNO,
        startdate: moment(data.starttime).format('YYYY-MM-DD HH:mm:ss'),
        fetalcount: 2,
        start: startingTime,
        end: endingTime,
      }
    } else {
      params = {
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
    }

    request.post(`/ctg-exams-pdf`, {
      data: params,
    }).then(res => {
      const pdfData = res.pdfdata && `data:application/pdf;base64,${res.pdfdata}`;
      setPdfflow(pdfData)
    })
  }

  const largen = () => {
    const{ height, width } = getHeight();
    setFullpage(true)
    setHeight(height - 24);
    setWidth(width)
  }

  const shrink = () => {
    setFullpage(false)
    setHeight(200);
    setWidth('100%')
  }

  const PreivewContent = () => {
    const content = pdfflow ? (
      <div className={classnames({ [styles.fullPage]: isFullpage })} style={{ width: width }}>
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
          <Page className={styles.page} pageNumber={pageNumber} scale={1} height={height} />
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
        <span className={styles.icon}>
          {isFullpage ? <Icon title="缩小" onClick={shrink} type="fullscreen-exit" /> : <Icon title="全屏" onClick={largen} type="fullscreen" />}
        </span>
      </div>
    ) : (
        <Empty  style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', margin: 0 }} />
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
                  <span>开始时间：
                    {/* <Input size="small" style={{ width: 80 }} value={(startingTime/ COEFFICIENT).toFixed(1)} onChange={e => {
                    remoteSetStartingTime(parseFloat(e.target.value))
                  }} /> */}
                  {(startingTime/ COEFFICIENT).toFixed(1)}
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
                  {(endingTime/ COEFFICIENT).toFixed(1) }
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