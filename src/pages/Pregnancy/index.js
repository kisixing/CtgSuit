import React, { Component } from 'react';
import { Layout } from 'antd';
import SearchForm from './SearchForm';
import TableList from './TableList';
import styles from './index.less';

export default class index extends Component {
  getFields = () => {
    let v = {};
    this.form.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      v = values;
    });
    return v
  }
  render() {
    return (
      <Layout className={styles.wrapper}>
        <div>
          <SearchForm wrappedComponentRef={form => this.form = form} />
        </div>
        <Layout>
          <TableList getFields={this.getFields} />
        </Layout>
      </Layout>
    )
  }
}
