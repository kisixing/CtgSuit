import printElement from './printElement';
import React, { Fragment, Component } from 'react';
import { connect } from 'dva';
import { Document, Page } from 'react-pdf';
import { Pagination, Button, Spin } from 'antd';
import { ipcRenderer } from 'electron';
import config from '@/utils/config';

import pdf from './pdfBase64';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import styles from './Preview.less';

class Preview extends Component {
  state = {
    pdfBase64: `data:application/pdf;base64,${pdf}`,
    numPages: 0,
    pageNumber: 1,
  };

  componentDidMount() {
  }

  onDocumentLoad = ({ numPages }) => {
    this.setState({ numPages });
  };

  onChangePage = page => {
    this.setState({ pageNumber: page });
  };

  handlePrint = (file) => {
    const { dataSource } = this.props;
    const pdfurl = dataSource.data && dataSource.data.docid;
    // console.log('88888888888', `${config.apiPrefix}/ctg-exams-pdfurl/${pdfurl}`);
    const filePath = `${config.apiPrefix}/ctg-exams-pdfurl/${pdfurl}` || 'http://www.orimi.com/pdf-test.pdf'
    ipcRenderer.send('printWindow', filePath);
  }

  render() {
    const { numPages, pageNumber } = this.state;
    const { pdfflow } = this.props;

    if (!pdfflow) {
      return <div> 暂无数据...</div>;
    }

    return (
      <div className={styles.wrapper}>
        <Button type="primary" className={styles.button} onClick={this.handlePrint}>
          打印
        </Button>
        <Document
          className={styles.preview}
          loading={<Spin style={{ margin: '120px 0' }} />}
          onLoadSuccess={this.onDocumentLoad}
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
          onChange={this.onChangePage}
        />
      </div>
    );
  }
}

export default connect(({ item, loading }) => ({
  loading: loading,
  pdfflow: item.pdfflow,
}))(Preview);