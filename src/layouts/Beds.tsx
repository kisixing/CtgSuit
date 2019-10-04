/*
 * @Description: 上下布局，主要页面布局 header-main
 * @Author: Zhong Jun
 * @Date: 2019-09-23 20:34:58
 */

import React from 'react';
import { Button } from 'antd';
import { router } from 'umi';
import { mapStatusToColor } from '@/constant';

function Beds({ dispatch, listData }) {
  let clickTimeout = null;

  const handleClicks = ({ pageIndex, unitId }) => {
    return () => {
      const data = { type: 'list/setPageItems', page: pageIndex };

      if (clickTimeout !== null) {
        clearTimeout(clickTimeout);
        clickTimeout = null;
        dispatch({ ...data, fullScreenId: unitId });
        router.replace('/workbench');
      } else {
        clickTimeout = setTimeout(() => {
          clearTimeout(clickTimeout);
          clickTimeout = null;
          dispatch(data);
          router.replace('/workbench');
        }, 200);
      }
    };
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        backgroundColor: '#fff',
        borderRadius: 4,
        alignContent: ' flex-start',
        flexWrap: 'wrap',
      }}
    >
      {listData.map(({ index, id, pageIndex, status, unitId }) => {
        return (
          <Button
            key={id}
            size="small"
            style={{
              marginLeft: 4,
              marginTop: 4,
              padding: 0,
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: mapStatusToColor[status],
              color: '#fff',
            }}
            onClick={handleClicks({ pageIndex, unitId })}
          >
            {index + 1}
          </Button>
        );
      })}
    </div>
  );
}

export default Beds;
