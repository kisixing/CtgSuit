import printElement from './printElement';
import React, { Fragment, Component } from 'react';
import { connect } from 'dva';
import { Document, Page } from 'react-pdf';
import { Pagination, Button, Spin, Empty } from 'antd';
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
      return <Empty style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', margin: 0 }} />;
    }

    return (
      <div style={{ display: 'flex', height: '100%' }}>
        <div className={styles.wrapper}>

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
        <div style={{ width: 300,background:'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <Button type="primary" className={styles.button} onClick={this.handlePrint}>
            打印
        </Button>
          打印按钮区域
          </div>
      </div>
    );
  }
}

export default connect(({ item, loading }) => ({
  loading: loading,
  pdfflow: item.pdfflow,
}))(Preview);