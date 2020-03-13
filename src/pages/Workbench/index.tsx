import React, { useRef, useEffect, useState } from 'react';

import { connect } from 'react-redux';
import { IBed } from '@/types';
import useTodo, { IRemain } from "./useTodo";
import { event } from '@lianmed/utils';
import { BedStatus } from '@lianmed/lmg/lib/services/types';
import { Ctg_Layout } from "@lianmed/pages";
import Toolbar from './Toolbar/index';

interface IProps {
  pageItems: IBed[],
  [x: string]: any
}
const Home = (props: IProps) => {
  const { listLayout = [], pageItems, fullScreenId, dispatch, showTodo, subscribeData, isOn, headCollapsed } = props;

  const [todo] = useTodo(showTodo, subscribeData)

  const [contentHeight, setcontentHeight] = useState(document.querySelector('main').clientHeight)

  useEffect(() => {
    setcontentHeight(document.querySelector('main').clientHeight)
  }, [headCollapsed])

  const items: any[] = (showTodo ? todo : pageItems).map(_ => ({ ..._, data: { ..._.data, status: isOn ? _.data.status : null } }));



  useEffect(() => {
    const endCb = (unitId, status, isCreated) => status === BedStatus.Offline && dispatch({ type: 'list/appendOffline', unitId, })

    const fullScreenCb = () => dispatch({ type: 'list/setState', payload: { fullScreenId: null } })
    event.on('bedEnd', endCb).on('bedFullScreen', fullScreenCb)
    return () => event.off('bedEnd', endCb).off('bedFullScreen', fullScreenCb)
  }, [])
  const onClose = ({ unitId, status, isTodo, docid }: any) => {
    console.log('ddddddd', unitId, status, isTodo, docid)
    if (isTodo) {
      event.emit('todo:discard', docid)
    } else {
      const cb = () => {
        dispatch({ type: `list/appendDirty`, unitId })
      }
      [BedStatus.Stopped, BedStatus.OfflineStopped].includes(status) ? cb() : event.emit(`bedClose:${unitId}`, cb)
    }
  }
  return (
    <Ctg_Layout
      themeColor='var(--theme-color)'
      onClose={onClose}
      RenderIn={Toolbar}
      items={items}
      listLayout={listLayout}
      fullScreenId={fullScreenId}
      contentHeight={contentHeight}
    />
  );
};

export default connect(({ ws, setting, list, subscribe }: any) => {
  return {
    listLayout: setting.listLayout,
    pageItems: list.pageItems,
    fullScreenId: list.fullScreenId,
    showTodo: list.showTodo,
    subscribeData: subscribe.data,
    isOn: ws.isOn,
    headCollapsed: setting.headCollapsed
  };
})(Home);
