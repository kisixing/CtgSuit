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
      dispatch({
        type: 'item/fetchCTGData',
        payload: {
          ctgexamid: data.docid,
        },
      });
    }
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'item/updateState',
      payload: {
        ctgData: null
      },
    });
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
              !data || (data && data.index < 60)
            }
          >

            <L suitType={2} data={(data && data.index >= 60) ? data : null} mutableSuitObject={value}></L>

          </Spin>
        )}
      </Context.Consumer>
    );
  }
}

export default connect(({ item, archives, loading }) => ({
  loading: loading,
  ctgData: item.ctgData,
  CTGData: archives.CTGData,
}))(Setting);