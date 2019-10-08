import React, { Component, Fragment } from 'react';
import { Document, Page } from 'react-pdf';
import { Pagination } from 'antd';
import 'react-pdf/dist/Page/AnnotationLayer.css';

import styles from './Preview.less'

class Preview extends Component {
  state = {
    pdfBase64:
      'data:application/pdf;base64,JVBERi0xLjMKMyAwIG9iago8PC9UeXBlIC9QYWdlCi9QYXJlbnQgMSAwIFIKL1Jlc291cmNlcyAyIDAgUgovTWVkaWFCb3ggWzAgMCA1OTUuMjggODQxLjg5XQovQ29udGVudHMgNCAwIFI+PgplbmRvYmoKNCAwIG9iago8PC9MZW5ndGggMjcxPj4Kc3RyZWFtCjAuNTcgdwowIEcKQlQKL0YxIDE2IFRmCjE4LjQgVEwKMCBnCjU2LjY5IDc4NS4yMCBUZAooT2BZfQAgAEgAZQBsAGwAbwAgAHcAbwByAGwAZAAhKSBUagpFVApCVAovRjEgMTYgVGYKMTguNCBUTAowIGcKMTQxLjczIDc4NS4yMCBUZAooT2BZfQAgAEgAZQBsAGwAbwAgAHcAbwByAGwAZAAhKSBUagpFVApCVAovRjEgMTYgVGYKMTguNCBUTAowIGcKNTYuNjkgNzU2Ljg1IFRkCihUaGlzIGlzIGNsaWVudC1zaWRlIEphdmFzY3JpcHQsIHB1bXBpbmcgb3V0IGEgUERGLikgVGoKRVQKZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8L1R5cGUgL1BhZ2UKL1BhcmVudCAxIDAgUgovUmVzb3VyY2VzIDIgMCBSCi9NZWRpYUJveCBbMCAwIDU5NS4yOCA4NDEuODldCi9Db250ZW50cyA2IDAgUj4+CmVuZG9iago2IDAgb2JqCjw8L0xlbmd0aCA3Nz4+CnN0cmVhbQowLjU3IHcKMCBHCkJUCi9GMSAxNiBUZgoxOC40IFRMCjAgZwo1Ni42OSA3ODUuMjAgVGQKKERvIHlvdSBsaWtlIHRoYXQ/KSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCjEgMCBvYmoKPDwvVHlwZSAvUGFnZXMKL0tpZHMgWzMgMCBSIDUgMCBSIF0KL0NvdW50IDIKPj4KZW5kb2JqCjcgMCBvYmoKPDwvQmFzZUZvbnQvSGVsdmV0aWNhL1R5cGUvRm9udAovRW5jb2RpbmcvV2luQW5zaUVuY29kaW5nCi9TdWJ0eXBlL1R5cGUxPj4KZW5kb2JqCjggMCBvYmoKPDwvQmFzZUZvbnQvSGVsdmV0aWNhLUJvbGQvVHlwZS9Gb250Ci9FbmNvZGluZy9XaW5BbnNpRW5jb2RpbmcKL1N1YnR5cGUvVHlwZTE+PgplbmRvYmoKOSAwIG9iago8PC9CYXNlRm9udC9IZWx2ZXRpY2EtT2JsaXF1ZS9UeXBlL0ZvbnQKL0VuY29kaW5nL1dpbkFuc2lFbmNvZGluZwovU3VidHlwZS9UeXBlMT4+CmVuZG9iagoxMCAwIG9iago8PC9CYXNlRm9udC9IZWx2ZXRpY2EtQm9sZE9ibGlxdWUvVHlwZS9Gb250Ci9FbmNvZGluZy9XaW5BbnNpRW5jb2RpbmcKL1N1YnR5cGUvVHlwZTE+PgplbmRvYmoKMTEgMCBvYmoKPDwvQmFzZUZvbnQvQ291cmllci9UeXBlL0ZvbnQKL0VuY29kaW5nL1dpbkFuc2lFbmNvZGluZwovU3VidHlwZS9UeXBlMT4+CmVuZG9iagoxMiAwIG9iago8PC9CYXNlRm9udC9Db3VyaWVyLUJvbGQvVHlwZS9Gb250Ci9FbmNvZGluZy9XaW5BbnNpRW5jb2RpbmcKL1N1YnR5cGUvVHlwZTE+PgplbmRvYmoKMTMgMCBvYmoKPDwvQmFzZUZvbnQvQ291cmllci1PYmxpcXVlL1R5cGUvRm9udAovRW5jb2RpbmcvV2luQW5zaUVuY29kaW5nCi9TdWJ0eXBlL1R5cGUxPj4KZW5kb2JqCjE0IDAgb2JqCjw8L0Jhc2VGb250L0NvdXJpZXItQm9sZE9ibGlxdWUvVHlwZS9Gb250Ci9FbmNvZGluZy9XaW5BbnNpRW5jb2RpbmcKL1N1YnR5cGUvVHlwZTE+PgplbmRvYmoKMTUgMCBvYmoKPDwvQmFzZUZvbnQvVGltZXMtUm9tYW4vVHlwZS9Gb250Ci9FbmNvZGluZy9XaW5BbnNpRW5jb2RpbmcKL1N1YnR5cGUvVHlwZTE+PgplbmRvYmoKMTYgMCBvYmoKPDwvQmFzZUZvbnQvVGltZXMtQm9sZC9UeXBlL0ZvbnQKL0VuY29kaW5nL1dpbkFuc2lFbmNvZGluZwovU3VidHlwZS9UeXBlMT4+CmVuZG9iagoxNyAwIG9iago8PC9CYXNlRm9udC9UaW1lcy1JdGFsaWMvVHlwZS9Gb250Ci9FbmNvZGluZy9XaW5BbnNpRW5jb2RpbmcKL1N1YnR5cGUvVHlwZTE+PgplbmRvYmoKMTggMCBvYmoKPDwvQmFzZUZvbnQvVGltZXMtQm9sZEl0YWxpYy9UeXBlL0ZvbnQKL0VuY29kaW5nL1dpbkFuc2lFbmNvZGluZwovU3VidHlwZS9UeXBlMT4+CmVuZG9iagoyIDAgb2JqCjw8Ci9Qcm9jU2V0IFsvUERGIC9UZXh0IC9JbWFnZUIgL0ltYWdlQyAvSW1hZ2VJXQovRm9udCA8PAovRjEgNyAwIFIKL0YyIDggMCBSCi9GMyA5IDAgUgovRjQgMTAgMCBSCi9GNSAxMSAwIFIKL0Y2IDEyIDAgUgovRjcgMTMgMCBSCi9GOCAxNCAwIFIKL0Y5IDE1IDAgUgovRjEwIDE2IDAgUgovRjExIDE3IDAgUgovRjEyIDE4IDAgUgo+PgovWE9iamVjdCA8PAo+Pgo+PgplbmRvYmoKMTkgMCBvYmoKPDwKL1Byb2R1Y2VyIChqc1BERiAxLjAuMjcyLWdpdCAyMDE0LTA5LTI5VDE1OjA5OmRpZWdvY3IpCi9DcmVhdGlvbkRhdGUgKEQ6MjAxNTA1MDgxNjA1NTQrMDgnMDAnKQo+PgplbmRvYmoKMjAgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDEgMCBSCi9PcGVuQWN0aW9uIFszIDAgUiAvRml0SCBudWxsXQovUGFnZUxheW91dCAvT25lQ29sdW1uCj4+CmVuZG9iagp4cmVmCjAgMjEKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwNjcwIDAwMDAwIG4gCjAwMDAwMDE4NzcgMDAwMDAgbiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMTE3IDAwMDAwIG4gCjAwMDAwMDA0MzcgMDAwMDAgbiAKMDAwMDAwMDU0NSAwMDAwMCBuIAowMDAwMDAwNzMzIDAwMDAwIG4gCjAwMDAwMDA4MjMgMDAwMDAgbiAKMDAwMDAwMDkxOCAwMDAwMCBuIAowMDAwMDAxMDE2IDAwMDAwIG4gCjAwMDAwMDExMTkgMDAwMDAgbiAKMDAwMDAwMTIwOCAwMDAwMCBuIAowMDAwMDAxMzAyIDAwMDAwIG4gCjAwMDAwMDEzOTkgMDAwMDAgbiAKMDAwMDAwMTUwMCAwMDAwMCBuIAowMDAwMDAxNTkzIDAwMDAwIG4gCjAwMDAwMDE2ODUgMDAwMDAgbiAKMDAwMDAwMTc3OSAwMDAwMCBuIAowMDAwMDAyMTAzIDAwMDAwIG4gCjAwMDAwMDIyMjAgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSAyMQovUm9vdCAyMCAwIFIKL0luZm8gMTkgMCBSCj4+CnN0YXJ0eHJlZgoyMzI0CiUlRU9G',
    numPages: 0,
    pageNumber: 1,
  };

  componentDidMount() {
    window.addEventListener(
      'message',
      event => {
        this.setState({ pdfBase64: event.data });
      },
      false,
    );
  }

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
        <Document
          className={styles.preview}
          onLoadSuccess={this.onDocumentLoad}
          file={pdfBase64}
          renderMode="svg"
          options={{
            cMapUrl: 'cmaps/',
            cMapPacked: true,
          }}
        >
          <Page className={styles.page} pageNumber={pageNumber} scale={1.5} />
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

export default Preview;