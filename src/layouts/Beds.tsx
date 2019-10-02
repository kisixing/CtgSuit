/*
 * @Description: 上下布局，主要页面布局 header-main
 * @Author: Zhong Jun
 * @Date: 2019-09-23 20:34:58
 */

import React from 'react';
import { Button } from 'antd';
import { router } from 'umi';
import { remote } from 'electron';
import { mapStatusToColor } from '@/constant';
const { dialog } = remote;
function Beds({ dispatch, listData }) {
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
      {listData.map(({ index, id, pageIndex, status }) => {
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
            onClick={() => {
              dispatch({ type: 'list/setPageItems', page: pageIndex });
              router.replace('/workbench');
            }}
            onDoubleClick={e => {
              dialog.showMessageBox(
                {
                  type: 'info',
                  title: '提示信息',
                  message: '确定关闭应用？',
                  buttons: ['cancel', 'ok'],
                },
                function(index) {
                  if (index === 0) {
                    // cancel
                    e.preventDefault();
                  } else {
                  }
                },
              );
            }}
          >
            {index + 1}
          </Button>
        );
      })}
    </div>
  );
}

export default Beds;
