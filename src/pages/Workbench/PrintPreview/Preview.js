import printElement from './printElement';
import React, { Fragment, Component } from 'react';
import { Document, Page } from 'react-pdf';
import { Pagination, Button } from 'antd';
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

  render() {
    const { pdfBase64, numPages, pageNumber } = this.state;
    return (
      <Fragment>
        {/* <Button onClick={this.click}>打印</Button> */}
        <Document
          className={styles.preview}
          loading="正在加载..."
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
      </Fragment>
    );
  }
}
