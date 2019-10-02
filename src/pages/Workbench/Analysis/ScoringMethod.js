/*
 * @Description: 分析页面 评分法
 * @Author: Zhong Jun
 * @Date: 2019-10-02 14:24:47
 */

import React, { Component } from 'react';
import { Tabs, Radio, Form, Button } from 'antd';
import styles from './ScoringMethod.less';

const { TabPane } = Tabs;

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

  onChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    const { value } = this.state;
    return (
      <div>
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
          <Form className={styles.form}></Form>
          <div className={styles.buttonView}>
            <Button>分析</Button>
            <Button>修改</Button>
            <Button>打印</Button>
            <Button>退出</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ScoringMethod;