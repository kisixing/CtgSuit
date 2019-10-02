/*
 * @Description: 分析页面 评分法
 * @Author: Zhong Jun
 * @Date: 2019-10-02 14:24:47
 */

import React, { Component } from 'react';
import { Tabs, Radio, Form, Button, InputNumber } from 'antd';
import styles from './ScoringMethod.less';

const { TabPane } = Tabs;
@Form.create()
class ScoringMethod extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 1,
    };
  }

  callback(key) {
    console.log(key);
  }

  onChange = e => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { value } = this.state;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <div className={styles.wrapper}>
        <div className={styles.tabs}>
          <div className={styles.radioBar}>
            <Radio.Group onChange={this.onChange} value={this.state.value}>
              <Radio value={'KREBS'}>KREBS分析法</Radio>
              <Radio value={'FISCHER'}>FISCHER分析法</Radio>
              <Radio value={'NST'}>NST分析法</Radio>
              <Radio value={'CST'}>CST分析法</Radio>
            </Radio.Group>
          </div>
          <Tabs size="small" defaultActiveKey="1" onChange={this.callback}>
            <TabPane tab={`${value}分析法`} key="1" className={styles.tabContent}>
              <div></div>
            </TabPane>
            <TabPane tab="分析备注" key="2" className={styles.tabContent}>
              <div></div>
            </TabPane>
          </Tabs>
        </div>
        <div className={styles.content}>
          <Form {...formItemLayout} className={styles.form}>
            <Form.Item label="宫缩次数（次）">
              {getFieldDecorator('uteruScontraction', {
                rules: [{ required: true, message: 'Please input your phone number!' }],
              })(<InputNumber style={{ width: '150px' }} />)}
            </Form.Item>
            <Form.Item label="宫缩强度（%）">
              {getFieldDecorator('intensity', {
                rules: [{ required: true, message: 'Please input your phone number!' }],
              })(<InputNumber style={{ width: '150px' }} />)}
            </Form.Item>
            <Form.Item label="间隔时间（分）">
              {getFieldDecorator('interval', {
                rules: [{ required: true, message: 'Please input your phone number!' }],
              })(<InputNumber style={{ width: '150px' }} />)}
            </Form.Item>
            <Form.Item label="持续时间（秒）">
              {getFieldDecorator('duration', {
                rules: [{ required: true, message: 'Please input your phone number!' }],
              })(<InputNumber style={{ width: '150px' }} />)}
            </Form.Item>
            <Form.Item label="短变异（毫秒）">
              {getFieldDecorator('variation', {
                rules: [{ required: true, message: 'Please input your phone number!' }],
              })(<InputNumber style={{ width: '150px' }} />)}
            </Form.Item>
          </Form>
          <div className={styles.buttonView}>
            <Button type="primary">分析</Button>
            <Button>修改</Button>
            <Button>打印</Button>
            <Button>退出</Button>
          </div>
        </div>
        <div className={styles.result}>
          <div>
            电脑评分：
            <span>CTG = {'6'}</span>
          </div>
          <div className={styles.tip}>
            <Button disabled>注意：电脑自动分析数据和结果仅供参考</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ScoringMethod;