
import React, { useState, useEffect, useMemo } from 'react';
import { Tabs, Radio, Form, Button, InputNumber } from 'antd';
import request from "@lianmed/request";
import { Suit } from '@lianmed/lmg/lib/Ctg/Suit';
import { WrappedFormUtils } from 'antd/lib/form/Form';
const styles = require('./ScoringMethod.less');

const { TabPane } = Tabs;
const MARKS = [
  'Kerbs',
  'Fisher',
  'Nst',
]
interface IItem {
  key: string;
  label: string;
  message: string;
  required: boolean;
}
const mapItemsToMarks = {
  Nst: [
    'fhrbaseline_score',
    'zhenfu_lv_score',
    'fhr_uptime_score',
    'fm_fhrv_score',
    'fm_score',
  ],
  Fisher: [
    'fhrbaseline_score',
    'zhenfu_lv_score',
    'zhouqi_lv_score',
    'acc_score',
    'dec_score',
  ],
  Kerbs: [
    'fhrbaseline_score',
    'zhenfu_lv_score',
    'zhouqi_lv_score',
    'acc_score',
    'dec_score',
    'movement_score',
  ]
}
const allItems: IItem[] = [
  {
    key: 'fhrbaseline_score',
    label: '基线'
  },
  {
    key: 'zhenfu_lv_score',

    label: '振幅'
  },
  {
    key: 'fhr_uptime_score',

    label: '胎动FHR上升时间'
  },
  {
    key: 'fm_fhrv_score',

    label: '胎动FHR变化'
  },
  {
    key: 'fm_score',

    label: '胎动次数'
  },
  {
    key: 'Fischer',

    label: '分析法'
  },
  {
    key: 'zhouqi_lv_score',

    label: '周期变异'
  },
  {
    key: 'acc_score',

    label: '加速'
  },
  {
    key: 'dec_score',

    label: '减速'
  },
  {
    key: 'Krebs',

    label: '分析法'
  },
  {
    key: 'movement_score',

    label: '胎动'
  },
].map(_ => ({ ..._, required: true, message: '请输入分数' }))
interface IResponseData {
  "acc": string,
  "dec": string,
  "baseline": any,
  "meanbaseline": string,
  "mark": string,
  "result": string,
  "diagnosis": any
}
interface IResult {
  fhr_uptime_score: number;
  fhrbaseline_score: number;
  fm_fhrv_score: number;
  fm_score: number;
  zhenfu_lv_score: number;
}
interface IProps {
  docid: string,
  form: WrappedFormUtils<IResult>,
  v: { suit: Suit }
  [x: string]: any
}

const ScoringMethod = (props: IProps) => {
  const { form, docid, v, dataSource } = props;
  const { getFieldDecorator } = form;
  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const [mark, setMark] = useState(null)
  const [activeItem, setActiveItem] = useState<IItem[]>([])
  const [disabled, setDisabled] = useState(true)
  const result = useMemo(() => { return {} }, [])
  useEffect(() => {
    setMarkAndItems(MARKS[0])
  }, [])
  useEffect(() => {
    analyse()
  }, [mark])
  const callback = (key) => {
    console.log(key);
  }
  const analyse = () => {

    v.suit && v.suit.data && request.post(`/ctg-exams-analyse`, {
      data: {
        docid,
        mark,
        "start": 0,
        "end": v.suit.data.index
      }
    }).then((r: IResponseData) => {
      Object.assign(result, r)
      let _result = null
      try {
        _result = JSON.parse(r.result)
      } catch (error) {
        console.log('parse analysis data error')
      }
      console.log(_result)
      if (_result) {
        form.setFieldsValue(_result)
      }
    })
  }
  const onChange = e => {
    const mark = e.target.value
    setDisabled(true)
    setMarkAndItems(mark)
  };
  const setMarkAndItems = (mark: string) => {
    form.resetFields()
    setMark(mark)
    const keys: string[] = mapItemsToMarks[mark]
    setActiveItem(allItems.filter(_ => keys.includes(_.key)))
  }

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
                      {getFieldDecorator(key, {
                        rules: [{ required, message }],
                      })(<InputNumber disabled={disabled} style={{ width: '150px' }} />)}
                    </Form.Item>
                  ))
                }

              </Form>
              <div className={styles.buttonView}>
                <Button type="primary" onClick={analyse}>分析</Button>
                <Button onClick={() => {
                  setDisabled(!disabled)
                  if (!disabled) {
                    request.put('/ctg-exams', {
                      data: {
                        id: dataSource.ctgexam.id,
                        result: JSON.stringify({
                          ...result, result: JSON.stringify(form.getFieldsValue())
                        })
                      }
                    })
                  }
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

export default Form.create<IProps>()(ScoringMethod);