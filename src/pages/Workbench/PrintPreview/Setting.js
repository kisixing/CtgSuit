import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { Ctg as L } from '@lianmed/lmg';
import styles from './index.less';
import moment from 'moment';
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
        pregnancy,
        ctgexam /* 由档案入口 */
      }
    } = this.props;
    let docid = '';
    if (data && data.docid && !ctgexam.note) {
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
    if (
      data &&
      data.docid &&
      pregnancy &&
      pregnancy.id
    ) {
      dispatch({
        type: 'item/fetchPDFflow',
        payload: {
          docid: data.docid,
          name: pregnancy.name,
          age: pregnancy.age,
          gestationalWeek: pregnancy.gestationalWeek,
          inpatientNO: pregnancy.inpatientNO,
          startdate: moment(data.starttime).format('YYYY-MM-DD HH:mm:ss'),
          fetalcount: data.fetal_num,
          start: 0,
          end: 2000,
        },
      });
    }
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
              <L type={1} data={ctgData} mutableSuitObject={value}></L>
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