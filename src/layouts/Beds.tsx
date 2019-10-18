/*
 * @Description: 上下布局，主要页面布局 header-main
 * @Author: Zhong Jun
 * @Date: 2019-09-23 20:34:58
 */

import React from 'react';
import { Button } from 'antd';
import { router } from 'umi';
import { mapStatusToColor } from '@/constant';
import { BedStatus } from "@lianmed/lmg/lib/services/WsService";
function Beds({ dispatch, listData, wsData }) {
  let clickTimeout = null;

  const handleClicks = ({ pageIndex, unitId }) => {
    return () => {
      const data = { type: 'list/setPage', page: pageIndex };
      if (clickTimeout !== null) {
        clearTimeout(clickTimeout);
        clickTimeout = null;
        dispatch(data);
        //kisi 2019-10-18 add
        dispatch({ type: 'list/appendDirty', unitId });
        dispatch({ type: 'list/setState', payload: { fullScreenId: unitId } });
        router.replace('/workbench');
      } else {
        clickTimeout = setTimeout(() => {
          clearTimeout(clickTimeout);
          clickTimeout = null;
          dispatch(data);
          //kisi 2019-10-18 add
          dispatch({ type: 'list/appendDirty', unitId });
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
      {
        listData.filter(({ unitId }) => {
          const status = wsData.get(unitId) && wsData.get(unitId).status
          return [BedStatus.Working, BedStatus.Stopped].includes(status)
        })
          .map(({ bedname, id, pageIndex, unitId }) => {
            const status = wsData.get(unitId) && wsData.get(unitId).status
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
                  background: mapStatusToColor[status],
                  color: '#fff',
                }}
                onClick={handleClicks({ pageIndex, unitId })}
              >
                {bedname}
              </Button>
            );
          })
      }
    </div>
  );
}

export default Beds;
