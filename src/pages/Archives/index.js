import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import FieldForm from './FieldForm';
import TableList from './TableList';
import CurveChart from './CurveChart';

import styles from './index.less';

class Archives extends PureComponent {
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
          <FieldForm wrappedComponentRef={form => (this.form = form)} />
          <TableList getFields={this.getFields} />
        </div>
        <Layout className={styles.chart}>
          <CurveChart />
        </Layout>
      </Layout>
    );
  }
}

export default Archives;