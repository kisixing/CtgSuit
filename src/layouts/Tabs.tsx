import React, { useCallback } from 'react';
import { Button } from 'antd';
import { router, withRouter } from 'umi';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { Location } from 'history';

let styles = require('./Tabs.less')

interface IProps {
  pageData: string[][]
  page: number
  dispatch: Dispatch
  showTodo: boolean
  location: Location
}

function Tabs({ pageData, page, dispatch, showTodo, location }: IProps) {
  const B = useCallback(
    ({ index, active }) => {
      return (
        <Button
          onClick={e => {
            dispatch({ type: 'list/setState', payload: { showTodo: false } })
            dispatch({ type: 'list/setPage', page: index });
            location.pathname.includes('workbench') || router.replace('/workbench');
          }}
          style={{ margin: '0 4px' }}
          size="small"
          type={(!showTodo && active) ? 'default' : 'primary'}
        >
          {
            `第 ${index + 1} 组`
          }
        </Button>
      );
    },
    [location, showTodo],
  )
  return (
    <div className={styles.tabs} >
      {pageData.map((bednames: string[], index) => {
        return (
          <B bednames={bednames} key={bednames.join(' ')} index={index} active={index === page} />
        );
      })}
      <Button
        size="small"
        style={{ marginLeft: pageData.length && 80, background: showTodo ? 'white' : 'var(--theme-hover-color)' }}
        onClick={() => {
        location.pathname.includes('workbench') || router.replace('/workbench');
          setTimeout(() => {
            dispatch({ type: 'list/setState', payload: { showTodo: true } })
          }, 0);
        }}
        type={showTodo ? 'default' : 'primary'}
      >
        待处理
      </Button>

    </div>
  );
}

export default connect(({ list }: any) => {
  return {
    showTodo: list.showTodo,
    pageData: list.pageData,
    page: list.page,
  }
})(withRouter<any, any>(Tabs));
