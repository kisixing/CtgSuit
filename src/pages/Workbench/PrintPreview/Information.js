import React from 'react';
import styles from './index.less';

function Information() {
  return (
    <div className={styles.info}>
      <div>编号：</div>
      <div>姓名：</div>
      <div>年龄：</div>
      <div>孕周：</div>
    </div>
  );
}

export default Information;