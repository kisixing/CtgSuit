import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { Ctg as L } from '@lianmed/lmg';
import styles from './index.less';
import { Context } from './index';

class Setting extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const {
      dispatch,
      from,
      dataSource: {
        data,
      }
    } = this.props;
    if (from !== "archives") {
      // 从检测页（主页）调用时，重新请求静态ctg数据
      setTimeout(() => {
        dispatch({
          type: 'item/fetchCTGData', // archives/fetchCTGrecordData
          payload: {
            ctgexamid: data.docid,
          },
        });
      }, 1000);

    }
  }

  render() {
    const { ctgData, CTGData, from, loading } = this.props;
    const data = from === 'archives' ? CTGData : ctgData;
    return (
      <Context.Consumer>
        {value => (
          <Spin
            wrapperClassName={styles.chart}
            spinning={
              !data
              // loading.effects['item/fetchCTGData'] || loading.effects['archives/fetchCTGrecordData']
            }
          >
            <L suitType={2} data={data} mutableSuitObject={value}></L>
          </Spin>
        )}
      </Context.Consumer>
    );
  }
}

export default connect(({ item, archives, loading }) => ({
  loading: loading,
  ctgData: item.ctgData, // 检测页ctg数据
  CTGData: archives.CTGData, // 档案管理也ctg数据
}))(Setting);