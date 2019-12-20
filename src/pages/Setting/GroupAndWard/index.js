import React, { Component } from 'react';
import { Divider } from 'antd';
import Groups from './Groups';
import Wards from './Wards';

import styles from './index.less';

class GroupAndWard extends Component {
  render() {
    return (
      <div className={styles.wrap}>
        <p className={styles.title}>用户组、病区管理</p>
        <div className={styles.content}>
          <div className={styles.left}>
            <Groups />
          </div>
          <div className={styles.divider} />
          <div className={styles.right}>
            <Wards />
          </div>
        </div>
      </div>
    );
  }
}

export default GroupAndWard;
