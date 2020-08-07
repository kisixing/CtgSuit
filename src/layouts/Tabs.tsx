import React, { useCallback } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Button } from 'antd';
import { router, withRouter } from 'umi';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { Location } from 'history';

let styles = require('./Tabs.less')

interface IProps {
  pageData: any[]
  page: number
  dispatch: Dispatch
  showTodo: boolean
  headCollapsed: boolean
  location: Location
  t: string
}

function Tabs({ pageData, page, t, dispatch, showTodo, location, headCollapsed }: IProps) {
  const B = useCallback(
    ({ index, title, tabKey }) => {
      return (
        <Button
          onClick={e => {
            dispatch({ type: 'list/setState', payload: { showTodo: false } })
            dispatch({ type: 'list/setPage', page: index, tabKey });
            location.pathname.includes('workbench') || router.replace('/workbench');
          }}
          style={{ margin: '0 4px' }}
          size="small"
          type={(!showTodo && index === page && t === tabKey) ? 'default' : 'primary'}
        >
          {
            title
          }
    
        </Button>
      );
    },
    [dispatch, location.pathname, showTodo, t, page],
  )
  return (
    <div className={styles.tabs} >
      {pageData.map(({ title, index, tabKey }) => {
        return (
          <B title={title} key={title} index={index} tabKey={tabKey} />
        );
      })}
      <Button size="small" style={{ margin: '0 4px', marginLeft: pageData.length && 80, background: showTodo ? 'white' : 'var(--theme-hover-color)' }} onClick={() => {
        location.pathname.includes('workbench') || router.replace('/workbench');
        setTimeout(() => {
          dispatch({ type: 'list/setState', payload: { showTodo: true } })
        }, 0);
      }}
        type={showTodo ? 'default' : 'primary'}
      >
        待处理
      </Button>
      <Button title={`${headCollapsed ? '显示' : '隐藏'}子机列表`} size="small" icon={<LegacyIcon type={`vertical-align-${headCollapsed ? 'bottom' : 'top'}`} />} style={{ position: 'absolute', bottom: 0, right: 6 }} onClick={e => {
        dispatch({ type: 'setting/setHeadCollapsed', payload: { headCollapsed: !headCollapsed } })

      }} />
    </div>
  );
}

export default connect(({ list, setting }: any) => {
  return {
    showTodo: list.showTodo,
    t: list.tabKey,
    pageData: list.pageData,
    page: list.page,
    headCollapsed: setting.headCollapsed
  }
})(withRouter<any, any>(Tabs));
