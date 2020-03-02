import React, { Component } from 'react';
import { Layout } from 'antd';
import store from 'store';
import SearchForm from './SearchForm';
import TableList from './TableList';
import styles from './index.less';

export default class index extends Component {
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
  }

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
          <SearchForm
            clearWard={this.clearWard}
            wrappedComponentRef={form => (this.form = form)}
          />
        </div>
        <Layout>
          <TableList getFields={this.getFields} wardId={this.state.wardId} />
        </Layout>
      </Layout>
    );
  }
}
