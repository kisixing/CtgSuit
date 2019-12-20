import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, message } from 'antd';
import { ipcRenderer } from 'electron';
import { request } from '@lianmed/utils';
import { Progress } from 'antd';
import { formItemLayout, tailFormItemLayout } from './utils';
import styles from './style.less';
import c from "@/utils/config";
const config = require('../../../package.json');
@Form.create()
class BasicSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      newVersion: '',
      version: config.version,
      percent: 0,
    };
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  checkUpdate = () => {
    this.setState({ loading: true });
    request.get(`/version-compare/ctg-suit/${this.state.version}`).then(({ uri }) => {
      const s = { loading: false }
      uri ? (s.newVersion = message.info('检测到新版本') && uri) : message.info('暂无更新...')
      this.setState(s);
    });


  }
  fakeProgress() {
    if (this.state.percent < 98) {
      this.setState({ percent: this.state.percent + 1 })
      setTimeout(() => this.fakeProgress(), 1000 - this.state.percent * 10)
    }
  }
  download = () => {
    this.fakeProgress()
    // const b = fs.createWriteStream()
    console.log(`${c.apiPrefix}/version-uri/${this.state.newVersion}`)
    ipcRenderer.send('downloadApp', `${c.apiPrefix}/version-uri/${this.state.newVersion}`)
  }
  cb = () => this.setState({ percent: 100 })
  componentDidMount() {
    ipcRenderer.on('appDownloaded', this.cb)
  }
  componentWillUnmount() {
    ipcRenderer.removeListener('appDownloaded', this.cb)
  }
  render() {
    const { loading, newVersion } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form {...formItemLayout} layout="horizontal" className={styles.form}>
        <Form.Item>
          <div className={styles.subTitle}>维护设置</div>
        </Form.Item>
        <Form.Item label="开发者工具">
          <Button onClick={() => ipcRenderer.send('openDevTools')}>开发者工具</Button>
        </Form.Item>
        {/* <Form.Item label="检查更新">

          {newVersion ? (

            this.state.percent > 1 ? <Progress percent={this.state.percent} /> : (
              <Button onClick={this.download} type="primary" icon="download">
                下载更新
              </Button>
            )

          ) : (
              <Button loading={loading} onClick={this.checkUpdate}>
                {newVersion ? '有版本更新' : '检查更新'}
              </Button>
            )}
        </Form.Item> */}
      </Form>
    );
  }
}

export default connect(({ setting, loading }) => ({
  loading: loading
}))(BasicSetting);