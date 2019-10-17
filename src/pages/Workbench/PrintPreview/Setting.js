import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { Ctg as L } from '@lianmed/lmg';
import styles from './index.less';
import { Context } from './index'
class Setting extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const {
      dispatch,
      dataSource: {
        data,
        ctgexam /* 由档案入口 */
      }
    } = this.props;
    let docid = '';
    if (data && data.docid && !(ctgexam && ctgexam.note)) {
      docid = data.docid;
    }
    if (ctgexam && ctgexam.note) {
      docid = ctgexam.note;
    }
    dispatch({
      type: 'item/fetchCTGData',
      payload: {
        ctgexamid: docid,
      },
    });
  
  }

  render() {
    const { ctgData, loading } = this.props;

    return (
      <Context.Consumer>
        {
          value => (
            <Spin
              wrapperClassName={styles.chart}
              spinning={loading.effects['item/fetchCTGData']}
            >
              <L suitType={2} data={ctgData} mutableSuitObject={value}></L>
            </Spin>
          )
        }
      </Context.Consumer>

    );
  }
}

export default connect(({ item, loading }) => ({
  loading: loading,
  ctgData: item.ctgData,
}))(Setting);