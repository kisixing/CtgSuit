import React, { Component } from 'react';
import { Form, Radio, InputNumber, Row, Col } from 'antd';
import styles from './index.less';

@Form.create()
class Setting extends Component {
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div className={styles.wrapper}>
        <div className={styles.setting}>
          <Form layout="inline">
            <Row>
              <Col span={12}>
                <fieldset>
                  <legend>打印模式</legend>
                  <Form.Item label="">
                    {getFieldDecorator('radio-group')(
                      <Radio.Group>
                        <Radio value="a">item 1</Radio>
                        <Radio value="b">item 2</Radio>
                        <Radio value="c">item 3</Radio>
                      </Radio.Group>,
                    )}
                  </Form.Item>
                </fieldset>
                <fieldset>
                  <legend>打印设置</legend>
                  <Form.Item label="左边距">
                    {getFieldDecorator('left-margin')(
                      <span>
                        <InputNumber />
                        mm
                      </span>,
                    )}
                  </Form.Item>
                  <Form.Item label="右边距">
                    {getFieldDecorator('right-margin')(
                      <span>
                        <InputNumber />
                        mm
                      </span>,
                    )}
                  </Form.Item>
                </fieldset>
              </Col>
              <Col span={12}>
                <fieldset>
                  <legend>打印模式</legend>
                  <Form.Item label="">
                    {getFieldDecorator('radio-group')(
                      <Radio.Group>
                        <Radio value="a">item 1</Radio>
                        <Radio value="b">item 2</Radio>
                        <Radio value="c">item 3</Radio>
                      </Radio.Group>,
                    )}
                  </Form.Item>
                </fieldset>
              </Col>
            </Row>
          </Form>
        </div>
        <div></div>
      </div>
    );
  }
}

export default Setting;