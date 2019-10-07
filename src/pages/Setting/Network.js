/*
 * @Description: 网络设置
 * @Author: Zhong Jun
 * @Date: 2019-10-06 14:51:23
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button,message } from 'antd';
import { store } from '@/utils/Storage';

import { formItemLayout, tailFormItemLayout } from './utils';
import styles from './style.less';

@Form.create()
class Network extends Component {
  componentDidMount() {
    const { form } = this.props;

    store.get(['ws_url', 'xhr_url']).then(([ws_url,xhr_url])=> {
      form.setFieldsValue({ xhr_url, ws_url });
    })
   
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
       store.set(Object.keys(values),Object.values(values)).then(status=>{
         if(status){
          message.success('设置成功,2s 后重启',2).then(()=>{
            // eslint-disable-next-line no-restricted-globals
            location.reload()
          })
         }
       })
      }
    });
  };
  reset(){
    store.set(['ws_url', 'xhr_url'], ['', '']).then(status=>{
      if(status){
       message.success('恢复成功,2s 后重启',2).then(()=>{
         // eslint-disable-next-line no-restricted-globals
         location.reload()
       })
      }
    })
  }
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="horizontal" {...formItemLayout} className={styles.form}>
        <Form.Item>
          <div className={styles.subTitle}>网络设置</div>
        </Form.Item>
        <Form.Item label="web socket">
          {getFieldDecorator('ws_url', {
            rules: [{ required: false, message: '请输入websocket服务地址!' }],
          })(<Input addonBefore="ws://" placeholder="请输入web socket服务地址!" />)}
        </Form.Item>
        <Form.Item label="web service">
          {getFieldDecorator('xhr_url')(
            <Input addonBefore="http://" placeholder="请输入web service服务地址!" />,
          )}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" onClick={this.handleSubmit}>
            保存
          </Button>
          <Button type="default" onClick={this.reset} style={{marginLeft:10}}>
            恢复默认
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default connect(({ setting, loading }) => ({
  loading: loading,
}))(Network);
