// import React, { Component, Fragment } from 'react';
// import { Document, Page } from 'react-pdf';
// import { Pagination, Button } from 'antd';
// import pdf from './pdfBase64';
// import 'react-pdf/dist/Page/AnnotationLayer.css';

// import styles from './Preview.less'

// class Preview extends Component {
//   state = {
//     pdfBase64: `data:application/pdf;base64,${pdf}`,
//     numPages: 0,
//     pageNumber: 1,
//   };

//   componentDidMount() {
//     window.addEventListener(
//       'message',
//       event => {
//         this.setState({ pdfBase64: event.data });
//       },
//       false,
//     );
//   }

//   onDocumentLoad = ({ numPages }) => {
//     this.setState({ numPages });
//   };

//   onChangePage = page => {
//     this.setState({ pageNumber: page });
//   };

//   // window.open(
//   //     'http://127.0.0.1:1702/pdfjs/web/viewer.html',
//   //     '新建打印窗口',
//   //     'height=600,width=1280,top=100',
//   //   ); // 新建窗口
//   handlePrint = () => {
//     document.body.innerHTML = document.getElementById('printDiv').innerHTML;
//     window.print();
//     // window.location.reload();
//   };

//   render() {
//     const { pdfBase64, numPages, pageNumber } = this.state;
//     return (
//       <Fragment>
//         <Button onClick={this.handlePrint}>打印</Button>
//         <div id="printDiv">
//           <Document
//             className={styles.preview}
//             loading="正在加载..."
//             onLoadSuccess={this.onDocumentLoad}
//             file={pdfBase64}
//             renderMode="canvas"
//             options={{
//               cMapUrl: 'cmaps/',
//               cMapPacked: true,
//             }}
//           >
//             <Page className={styles.page} pageNumber={pageNumber} scale={1.5} height={340} />
//           </Document>
//           {/* <Pagination
//             className={styles.pagination}
//             total={numPages}
//             showTotal={total => `共 ${total} 页`}
//             current={pageNumber}
//             pageSize={1}
//             size="small"
//             onChange={this.onChangePage}
//           /> */}
//         </div>
//       </Fragment>
//     );
//   }
// }

// export default Preview;

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
  click = () => {
    printElement({
      content: this.printDomRef,
    })
  }
  render() {
    const { pdfBase64, numPages, pageNumber } = this.state;
    return (
      <Fragment>
        <div>
          <Button onClick={this.click}>打印</Button>
        </div>
        <div ref={e => (this.printDomRef = e)}>
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
        </div>
      </Fragment>
    );
  }
}

// // eslint-disable-next-line jsx-a11y/iframe-has-title
// <iframe
//   style={{ width: '100%', height: '100%', overflow: 'visible' }}
//   onLoad={() => {
//     const obj = ReactDOM.findDOMNode(this);
//     this.setState({
//       iFrameHeight: obj.contentWindow.document.body.scrollHeight + 'px',
//     });
//   }}
//   ref="iframe"
//   src="http://127.0.0.1:1702/pdfjs/web/viewer.html?file=http://127.0.0.1:1702/example1.pdf"
//   width="100%"
//   height="100%"
//   scrolling="no"
//   frameBorder="0"
// />