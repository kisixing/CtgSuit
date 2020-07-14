import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';

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
  const { borderedId, listLayout = [], pageItems, fullScreenId, dispatch, showTodo, subscribeData, isOn, headCollapsed } = props;

  const [todo] = useTodo(showTodo, subscribeData)

  const [contentHeight, setcontentHeight] = useState(document.querySelector('main').clientHeight)

  useEffect(() => {
    setcontentHeight(document.querySelector('main').clientHeight)
  }, [headCollapsed])

  const items: any[] = useMemo(() => (showTodo ? todo : pageItems), [pageItems, todo, isOn]);

  useEffect(() => {
    console.log('jjj', '-------')
  }, [pageItems])

  useEffect(() => {
    const endCb = (unitId, status, isCreated) => status === BedStatus.Offline && dispatch({ type: 'list/appendOffline', unitId, })

    const fullScreenCb = () => dispatch({ type: 'list/setState', payload: { fullScreenId: null } })
    event.on('bedEnd', endCb).on('bedFullScreen', fullScreenCb)
    return () => event.off('bedEnd', endCb).off('bedFullScreen', fullScreenCb)
  }, [])
  const onClose = useCallback(({ unitId, status, isTodo, docid }: any) => {
    if (isTodo) {
      event.emit('todo:discard', docid)
    } else {
      const cb = () => {
        dispatch({ type: `list/appendDirty`, unitId })
      }
      [BedStatus.Stopped, BedStatus.OfflineStopped].includes(status) ? cb() : event.emit(`bedClose:${unitId}`, cb)
    }
  }, [])
  const onSelect = useCallback((unitId = '') => {

    dispatch({ type: 'list/setState', payload: { borderedId: unitId } })
  }, [])

  return (
    <Ctg_Layout
      backgroundColor='var(--customed-color)'
      borderedColor='var(--theme-border)'
      fontColor='var(--customed-font)'
      onClose={onClose}
      RenderIn={Toolbar}
      items={[...items]}
      listLayout={listLayout}
      fullScreenId={fullScreenId}
      contentHeight={contentHeight}
      borderedId={borderedId}
      onSelect={onSelect}
    />
  );
};

export default connect(({ ws, setting, list, subscribe }: any) => {
  return {
    listLayout: setting.listLayout,
    pageItems: list.pageItems,
    fullScreenId: list.fullScreenId,
    borderedId: list.borderedId,
    showTodo: list.showTodo,
    subscribeData: subscribe.data,
    isOn: ws.isOn,
    headCollapsed: setting.headCollapsed
  };
})(Home);
