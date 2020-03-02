import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import store from 'store';
import FieldForm from './FieldForm';
import TableList from './TableList';
import CurveChart from './CurveChart';

import styles from './index.less';

class Archives extends PureComponent {
  constructor(props) {
    super(props);
    const ward = store.get('ward');
    this.state = {
      wardId: ward && ward.wardId ? ward.wardId : undefined,
    };
  }

  // 置空病区
  clearWard = () => {
    this.setState({ wardId: undefined });
  };

  getFields = () => {
    let v = {};
    this.form.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      v = values;
    });
    return v;
  };
  render() {
    return (
      <Layout className={styles.wrapper}>
        <div className={styles.searchForm}>
          <FieldForm
            clearWard={this.clearWard}
            wrappedComponentRef={form => (this.form = form)}
          />
          <TableList wardId={this.state.wardId} getFields={this.getFields} />
        </div>
        <Layout className={styles.chart}>
          <CurveChart />
        </Layout>
      </Layout>
    );
  }
}

export default Archives;