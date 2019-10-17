/*
 * @Description: CTG曲线
 * @Author: Zhong Jun
 * @Date: 2019-10-17 09:42:11
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { Ctg as L } from '@lianmed/lmg';
import styles from './index.less';

class CTGChart extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const {
      dispatch,
      from,
      dataSource: { data },
    } = this.props;
    // TODO
    if (from !== 'archives') {
      // from === 'archives'时，不做ctg fetch请求
      dispatch({
        type: 'item/fetchCTGData',
        payload: {
          ctgexamid: data.docid,
        },
      });
    }
  }

  render() {
    const { ctgData, CTGData, from, loading } = this.props;
    const data = from === 'archives' ? CTGData : ctgData;
    return (
      <Spin
        wrapperClassName={styles.spinWrapper}
        spinning={
          loading.effects['item/fetchCTGData'] || loading.effects['archives/fetchCTGrecordData']
        }
      >
        <L type={1} data={data}></L>
      </Spin>
    );
  }
}

export default connect(({ item, archives, loading }) => ({
  loading: loading,
  ctgData: item.ctgData, // 首页进入时，ctg数据从新请求
  CTGData: archives.CTGData, // 历史档案员进入时，ctg数据
}))(CTGChart);
