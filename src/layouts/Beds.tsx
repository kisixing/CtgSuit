import { IBed } from '@/types';
import { BedStatus, ICache } from "@lianmed/lmg/lib/services/WsService";
import { mapStatusToColor } from "@lianmed/lmg/lib/services/utils";
import { Button } from 'antd';
import { connect } from 'dva';
import React from 'react';
import { router } from 'umi';

interface IProps {
  headData: IBed[]
  wsData: ICache
  dispatch: (d: any) => void
}

function Beds({ dispatch, headData, wsData }: IProps) {
  const handleClicks = ({ pageIndex, unitId }) => {
    return () => {

      // if (clickTimeout !== null) {
      //   clearTimeout(clickTimeout);
      //   clickTimeout = null;
      //   dispatch(data);
      //   //kisi 2019-10-18 add
      //   dispatch({ type: 'list/appendDirty', unitId });
      //   dispatch({ type: 'list/processListData' });
      //   dispatch({ type: 'list/setState', payload: { fullScreenId: unitId } });
      //   dispatch({ type: 'list/setState', payload: { showTodo: false } })

      //   router.replace('/workbench');
      // } else {
      //   clickTimeout = setTimeout(() => {
      //     clearTimeout(clickTimeout);
      //     clickTimeout = null;
      //     dispatch(data);
      //     //kisi 2019-10-18 add
      //     dispatch({ type: 'list/appendDirty', unitId });
      //     dispatch({ type: 'list/processListData' });
      //     dispatch({ type: 'list/setState', payload: { showTodo: false } })

      //     router.replace('/workbench');
      //   }, 300);
      // }

      // dispatch({ type: 'list/appendDirty', unitId });
      // dispatch({ type: 'list/processListData' });
      dispatch({ type: 'list/removeDirty', unitId })
      // dispatch({ type: 'list/setState', payload: { showTodo: false, borderedId: unitId } })
      dispatch({ type: 'list/setPageByUnitId', unitId });

      router.replace('/workbench');
    };
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        backgroundColor: '#fff',
        borderRadius: 3,
        alignContent: ' flex-start',
        flexWrap: 'wrap',
        overflow: 'scroll',
        maxHeight: 70
      }}
    >
      {
        headData
          .map(({ bedname, id, pageIndex, unitId, status }) => {
            return (
              <Button
                key={id}
                size="small"
                style={{
                  marginLeft: 4,
                  marginTop: 4,
                  padding: '0 6px',
                  // width: 70,
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

export default connect(({ list, ws }: any) => {
  return {
    headData: list.headData,
    wsData: ws.data,
  }
})(Beds);

