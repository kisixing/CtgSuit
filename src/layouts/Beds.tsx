/*
 * @Description: 上下布局，主要页面布局 header-main
 * @Author: Zhong Jun
 * @Date: 2019-09-23 20:34:58
 */

import React from 'react';
import { Button } from 'antd';
import { router } from 'umi';
import { mapStatusToColor } from '@/constant';

function Beds({ dispatch, listData, wsData }) {
  let clickTimeout = null;

  const handleClicks = ({ pageIndex, unitId }) => {
    return () => {
      const data = { type: 'list/setPageItems', page: pageIndex };

      if (clickTimeout !== null) {
        clearTimeout(clickTimeout);
        clickTimeout = null;
        dispatch(data);
        dispatch({ type: 'list/setState', payload: { fullScreenId: unitId } });

        router.replace('/workbench');
      } else {
        clickTimeout = setTimeout(() => {
          clearTimeout(clickTimeout);
          clickTimeout = null;
          dispatch(data);
          router.replace('/workbench');
        }, 300);
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
      {listData.map(({ bedname, id, pageIndex, unitId }) => {
        return (
          <Button
            key={id}
            size="small"
            style={{
              marginLeft: 4,
              marginTop: 4,
              padding: 0,
              width: 40,
              // height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: wsData.get(unitId) && mapStatusToColor[wsData.get(unitId).status],
              color: '#fff',
            }}
            onClick={handleClicks({ pageIndex, unitId })}
          >
            {bedname}
          </Button>
        );
      })}
    </div>
  );
}

export default Beds;
