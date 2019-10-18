import React, { useState, useCallback } from 'react';
import { Button } from 'antd';
import { router } from 'umi';
import { event } from "@lianmed/utils";
let styles = require('./Tabs.less')

function Tabs({ pageData, page, dispatch }) {

  const [showCompleted, setShowCompleted] = useState(false)

  const toggleCompleted = useCallback((status) => {
    setShowCompleted(status)
    event.emit('workbench:toggle_completed', status)
  }, [])
  return (
    <div className={styles.tabs} >
      {pageData.map((bednames: string[], index) => {
        return (
          <Button
            key={bednames.join(' ')}
            onClick={e => {
              toggleCompleted(false)
              dispatch({ type: 'list/setPageItems', page: index });
              router.replace('/workbench');
            }}
            style={{ margin: '4px' }}
            size="small"
            type={(!showCompleted && page === index) ? 'default' : 'primary'}
          >
            {
              `第 ${index + 1} 组`
            }
          </Button>
        );
      })}
      {pageData.length > 0 && (
        <Button size="small" style={{ margin: '4px', marginLeft: 80, background: showCompleted ? 'white' : 'var(--theme-hover-color)' }} onClick={() => {
          toggleCompleted(true)
        }} type={showCompleted ? 'default' : 'primary'}>待处理档案列表</ Button>
      )}

    </div>
  );
}

export default Tabs;
