/*
 * @Description: 上下布局，主要页面布局 header-main
 * @Author: Zhong Jun
 * @Date: 2019-09-23 20:34:58
 */

import React from 'react';
import { Button } from 'antd';
import { router } from 'umi';

function Tabs({ pageData, page, dispatch }) {
  return (
    <div style={{ display: 'flex', lineHeight: '24px' }}>
      {pageData.map(([left, rigth], index) => {
        return (
          <Button
            key={left}
            onClick={e => {
              dispatch({ type: 'list/setPageItems', page: index });
              router.replace('/workbench');
            }}
            style={{ margin: '4px' }}
            size="small"
            type={page === index ? 'default' : 'primary'}
          >
            {left === rigth ? left : `${left}~${rigth}`}
          </Button>
        );
      })}
    </div>
  );
}

export default Tabs;
