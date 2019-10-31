import React, { useState, useEffect } from 'react';
import { Tabs, Radio, Form, Button, InputNumber } from 'antd';
import request from "@lianmed/request";
import { Suit } from '@lianmed/lmg/lib/Ctg/Suit';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import useAnalyse, { IResult } from './useAnalyse'
const styles = require('./ScoringMethod.less');
const { TabPane } = Tabs;

const ScoringMethod = (props: IProps) => {
  const { form, docid, v, dataSource } = props;

  const [disabled, setDisabled] = useState(true)
  const { responseData, activeItem, setMark, mark, MARKS, analyse } = useAnalyse(v, docid, (_result) => {
    form.setFieldsValue(_result)
  })

  const callback = (key) => { console.log(key); }
  const onChange = e => {
    const mark = e.target.value
    setDisabled(true)
    form.resetFields()
    setMark(mark)
  };
  const modifyAnalyseData = () => {
    request.put('/ctg-exams', {
      data: {
        id: dataSource.ctgexam.id,
        result: JSON.stringify({
          ...responseData, result: JSON.stringify(form.getFieldsValue())
        })
      }
    })
  }

  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        <div className={styles.radioBar}>
          <Radio.Group onChange={onChange} value={mark}>
            {
              MARKS.map(_ => (
                <Radio value={_} key={_}>{_}分析法</Radio>
              ))
            }
          </Radio.Group>
        </div>
        <Tabs size="small" defaultActiveKey="1" onChange={callback}>
          <TabPane tab={`${mark}分析法`} key="1" className={styles.tabContent}>
            <div className={styles.content}>
              <Form {...formItemLayout} className={styles.form}>
                {
                  activeItem.map(({ label, key, required, message }) => (
                    <Form.Item label={label} key={key}>
                      {form.getFieldDecorator(key, {
                        rules: [{ required, message }],
                      })(<InputNumber disabled={disabled} style={{ width: '150px' }} />)}
                    </Form.Item>
                  ))
                }

              </Form>
              <div className={styles.buttonView}>
                <Button type="primary" onClick={analyse}>分析</Button>
                <Button onClick={() => {
                  const opposite = !disabled
                  if (opposite) {
                    modifyAnalyseData()
                  }
                  setDisabled(opposite)
                }}>{disabled ? '修改' : '确认'}</Button>
                <Button>打印</Button>
                <Button>退出</Button>
              </div>
            </div>
            <div className={styles.result}>
              <div>
                电脑评分：
            <span>CTG = {Object.values(form.getFieldsValue()).reduce((a, b) => ~~a + ~~b, 0)}</span>
              </div>
              <div className={styles.tip}>
                <Button disabled>注意：电脑自动分析数据和结果仅供参考</Button>
              </div>
            </div>
          </TabPane>
          {/* <TabPane tab="分析备注" key="2" className={styles.tabContent}>
            <div></div>
          </TabPane> */}
        </Tabs>
      </div>

    </div>
  );
}
interface IProps {
  docid: string,
  form: WrappedFormUtils<IResult>,
  v: { suit: Suit }
  [x: string]: any
}
export default Form.create<IProps>()(ScoringMethod);