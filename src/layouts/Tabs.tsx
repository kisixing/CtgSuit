/*
 * @Description: 上下布局，主要页面布局 header-main
 * @Author: Zhong Jun
 * @Date: 2019-09-23 20:34:58
 */

import React from 'react';
import { Button } from 'antd';
import { router } from 'umi';
let styles = require('./Tabs.less')

function Tabs({ pageData, page, dispatch }) {
  return (
    <div className={styles.tabs} >
      {pageData.map((bednames:string[], index) => {
        return (
          <Button
            key={bednames.join(' ')}
            onClick={e => {
              dispatch({ type: 'list/setPageItems', page: index });
              router.replace('/workbench');
            }}
            style={{ margin: '4px' }}
            size="small"
            type={page === index ? 'default' : 'primary'}
          >
            {
              index
            }
          </Button>
        );
      })}
    </div>
  );
}

export default Tabs;
