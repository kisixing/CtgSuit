import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Preview extends Component {
  constructor() {
    super();
    this.state = {
        iFrameHeight: '0px'
    }
  }
  render() {
    return (
      // eslint-disable-next-line jsx-a11y/iframe-has-title
      <iframe
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
        onLoad={() => {
          const obj = ReactDOM.findDOMNode(this);
          this.setState({
            iFrameHeight: obj.contentWindow.document.body.scrollHeight + 'px',
          });
        }}
        ref="iframe"
        src="http://127.0.0.1:1702/pdfjs/web/viewer.html?file=http://127.0.0.1:1702/example1.pdf"
        width="100%"
        height="100%"
        scrolling="no"
        frameBorder="0"
      />
    );
  }
}
