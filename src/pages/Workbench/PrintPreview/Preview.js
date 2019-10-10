import printElement from './printElement';
import React, { Fragment, Component } from 'react';
import { Document, Page } from 'react-pdf';
import { Pagination, Button, Spin } from 'antd';
import { ipcRenderer } from 'electron';

import pdf from './pdfBase64';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import styles from './Preview.less';

export default class Preview extends Component {
  state = {
    pdfBase64: `data:application/pdf;base64,${pdf}`,
    numPages: 0,
    pageNumber: 1,
  };

  onDocumentLoad = ({ numPages }) => {
    this.setState({ numPages });
  };

  onChangePage = page => {
    this.setState({ pageNumber: page });
  };

  handlePrint = (file = 'http://127.0.0.1:1702/example1.pdf') => {
    ipcRenderer.send('printWindow', 'http://192.168.0.208:9986/api/ctg-exams-pdfurl/190930222541');
  }

  render() {
    const { pdfBase64, numPages, pageNumber } = this.state;
    return (
      <div className={styles.wrapper}>
        <Button type="primary" className={styles.button} onClick={this.handlePrint}>
          打印
        </Button>
        <Document
          className={styles.preview}
          loading={<Spin style={{ margin: '120px 0' }} />}
          onLoadSuccess={this.onDocumentLoad}
          file={pdfBase64}
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
          onChange={this.onChangePage}
        />
      </div>
    );
  }
}
