import React from 'react';
import { Layout } from 'antd';
import SearchForm from './SearchForm';
import TableList from './TableList';
import styles from './index.less';

export default function Pregnancy() {
  return (
    <Layout className={styles.wrapper}>
      <div>
        <SearchForm />
      </div>
      <Layout>
        <TableList />
      </Layout>
    </Layout>
  )
}
