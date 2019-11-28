import React, { useState, useCallback, useEffect } from 'react';
import { Button } from 'antd';
import { router } from 'umi';
import { connect } from 'dva';
let styles = require('./Tabs.less')

function Tabs({ pageData, page, dispatch, showTodo }) {
  return (
    <div className={styles.tabs} >
      {pageData.map((bednames: string[], index) => {
        return (
          <Button
            key={bednames.join(' ')}
            onClick={e => {
              dispatch({ type: 'list/setState', payload: { showTodo: false } })
              dispatch({ type: 'list/setPage', page: index });
              router.replace('/workbench');
            }}
            style={{ margin: '0 4px' }}
            size="small"
            type={(!showTodo && page === index) ? 'default' : 'primary'}
          >
            {
              `第 ${index + 1} 组`
            }
          </Button>
        );
      })}
      {pageData.length > 0 && (
        <Button size="small" style={{ margin: '0 4px', marginLeft: 80, background: showTodo ? 'white' : 'var(--theme-hover-color)' }} onClick={() => {
          router.replace('/workbench');
          setTimeout(() => {
            dispatch({ type: 'list/setState', payload: { showTodo: true } })
          }, 0);


        }} type={showTodo ? 'default' : 'primary'}>待处理</ Button>
      )}

    </div>
  );
}

export default connect(({ list }: any) => {
  return {
    showTodo: list.showTodo
  }
})(Tabs);
