import React, { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { Ctg as L } from '@lianmed/lmg';
import styles from './index.less';
import moment from 'moment';

class Setting extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const { dispatch, dataSource } = this.props;
    console.log('00000000000000', dataSource);
    if (dataSource.data && dataSource.data.docid) {
      dispatch({
        type: 'item/fetchCTGData',
        payload: {
          ctgexamid: dataSource.data.docid,
        },
      });
    }
    if (
      dataSource.data &&
      dataSource.data.docid &&
      dataSource.pregnancy &&
      dataSource.pregnancy.id
    ) {
      dispatch({
        type: 'item/fetchPDFflow',
        payload: {
          docid: dataSource.data.docid,
          name: dataSource.pregnancy.name,
          age: dataSource.pregnancy.age,
          gestationalWeek: dataSource.pregnancy.gestationalWeek,
          inpatientNO: dataSource.pregnancy.inpatientNO,
          startdate: moment(dataSource.data.starttime).format('YYYY-MM-DD HH:mm:ss'),
          fetalcount: dataSource.data.fetal_num,
          start: 0,
          end: 2000,
        },
      });
    }
  }

  render() {
    const { ctgData, loading } = this.props;

    return (
      <Spin
        wrapperClassName={styles.chart}
        spinning={loading.effects['item/fetchCTGData']}
      >
        <L type={1} data={ctgData}></L>
      </Spin>
    );
  }
}

export default connect(({ item, loading }) => ({
  loading: loading,
  ctgData: item.ctgData,
}))(Setting);