import React, { Component, Fragment } from 'react';
import { Document, Page } from 'react-pdf';
import { Pagination } from 'antd'

import styles from './Preview.less'

class Preview extends Component {
  state = {
    pdfBase64:
      'JVBERi0xLjQKJeLjz9MKNCAwIG9iago8PC9MZW5ndGggMTY2L0ZpbHRlci9GbGF0ZURlY29kZT4+c3RyZWFtCnicK+RyCuEyNlOwMDBTCEnhcg3hCuQyUvACiRoqGAAhiLQwMVIIyeXSdzNUMDRQCEnj0tAMyQKpRSgxUEjORdZkBDTP3MxQz9gQotNIwcgEpNMALF+UzqXRn9Zr7icVtLCHOf1p0tIQL5CRBgrpWIyNjgXSKWBn4bbQxNhIwdzSSM/EHO5UNAtdEktSrSi1xdKUgC1GBoamuoZGukamRFkFAA+OTv4KZW5kc3RyZWFtCmVuZG9iagoxIDAgb2JqCjw8L0dyb3VwPDwvVHlwZS9Hcm91cC9DUy9EZXZpY2VSR0IvUy9UcmFuc3BhcmVuY3k+Pi9QYXJlbnQgNSAwIFIvQ29udGVudHMgNCAwIFIvVHlwZS9QYWdlL1Jlc291cmNlczw8L1Byb2NTZXQgWy9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUldL0NvbG9yU3BhY2U8PC9DUy9EZXZpY2VSR0I+Pi9Gb250PDwvRjEgMiAwIFIvRjIgMyAwIFI+Pj4+L01lZGlhQm94WzAgMCA1OTUgODQyXT4+CmVuZG9iago2IDAgb2JqClsxIDAgUi9YWVogMCA4NTIgMF0KZW5kb2JqCjIgMCBvYmoKPDwvQmFzZUZvbnQvSGVsdmV0aWNhL1R5cGUvRm9udC9FbmNvZGluZy9XaW5BbnNpRW5jb2RpbmcvU3VidHlwZS9UeXBlMT4+CmVuZG9iago3IDAgb2JqCjw8L0ZvbnRCQm94IFstMjUgLTI1NCAxMDAwIDg4MF0vQ2FwSGVpZ2h0IDg4MC9TdHlsZTw8L1Bhbm9zZSgBBQICBAAAAAAAAAApPj4vVHlwZS9Gb250RGVzY3JpcHRvci9TdGVtViA5My9EZXNjZW50IC0xMjAvRmxhZ3MgNi9Gb250TmFtZS9TVFNvbmctTGlnaHQvQXNjZW50IDg4MC9JdGFsaWNBbmdsZSAwPj4KZW5kb2JqCjggMCBvYmoKPDwvQmFzZUZvbnQvU1RTb25nLUxpZ2h0L0NJRFN5c3RlbUluZm88PC9PcmRlcmluZyhHQjEpL1JlZ2lzdHJ5KEFkb2JlKS9TdXBwbGVtZW50IDQ+Pi9UeXBlL0ZvbnQvU3VidHlwZS9DSURGb250VHlwZTAvRm9udERlc2NyaXB0b3IgNyAwIFIvRFcgMTAwMD4+CmVuZG9iagozIDAgb2JqCjw8L0Rlc2NlbmRhbnRGb250c1s4IDAgUl0vQmFzZUZvbnQvU1RTb25nLUxpZ2h0LVVuaUdCLVVDUzItSC9UeXBlL0ZvbnQvRW5jb2RpbmcvVW5pR0ItVUNTMi1IL1N1YnR5cGUvVHlwZTA+PgplbmRvYmoKNSAwIG9iago8PC9JVFhUKDIuMS43KS9UeXBlL1BhZ2VzL0NvdW50IDEvS2lkc1sxIDAgUl0+PgplbmRvYmoKOSAwIG9iago8PC9OYW1lc1soSlJfUEFHRV9BTkNIT1JfMF8xKSA2IDAgUl0+PgplbmRvYmoKMTAgMCBvYmoKPDwvRGVzdHMgOSAwIFI+PgplbmRvYmoKMTEgMCBvYmoKPDwvTmFtZXMgMTAgMCBSL1R5cGUvQ2F0YWxvZy9WaWV3ZXJQcmVmZXJlbmNlczw8L1ByaW50U2NhbGluZy9BcHBEZWZhdWx0Pj4vUGFnZXMgNSAwIFI+PgplbmRvYmoKMTIgMCBvYmoKPDwvQ3JlYXRvcihKYXNwZXJSZXBvcnRzIFwoSW5xdWlyeVJwdFwpKS9Qcm9kdWNlcihpVGV4dCAyLjEuNyBieSAxVDNYVCkvTW9kRGF0ZShEOjIwMTUxMjI1MDkzMTMzKzA4JzAwJykvQ3JlYXRpb25EYXRlKEQ6MjAxNTEyMjUwOTMxMzMrMDgnMDAnKT4+CmVuZG9iagp4cmVmCjAgMTMKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMjQ4IDAwMDAwIG4gCjAwMDAwMDA1MjYgMDAwMDAgbiAKMDAwMDAwMDk2OCAwMDAwMCBuIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDEwOTIgMDAwMDAgbiAKMDAwMDAwMDQ5MSAwMDAwMCBuIAowMDAwMDAwNjE0IDAwMDAwIG4gCjAwMDAwMDA4MDUgMDAwMDAgbiAKMDAwMDAwMTE1NSAwMDAwMCBuIAowMDAwMDAxMjA5IDAwMDAwIG4gCjAwMDAwMDEyNDIgMDAwMDAgbiAKMDAwMDAwMTM0NyAwMDAwMCBuIAp0cmFpbGVyCjw8L1Jvb3QgMTEgMCBSL0lEIFs8MDhjNzVmZDMwZWE4NjAwY2FkOTQ1NDA2ZDJiYWNmM2U+PDRmOTRlZTdlNTExMTg5Y2I2OWRjMjNiZjI3OWMwZmI4Pl0vSW5mbyAxMiAwIFIvU2l6ZSAxMz4+CnN0YXJ0eHJlZgoxNTA4CiUlRU9GCg==',
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