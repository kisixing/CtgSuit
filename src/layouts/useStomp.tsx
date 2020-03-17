import { useState, useEffect } from "react";
// import request from "@lianmed/request";
import { makeStompService } from "@lianmed/utils";
import store from '../utils/SettingStore'
import { ipcRenderer } from "electron";
import { VisitedData } from "../contexts/visited";
import _ from 'lodash'
export const useStomp = (visitedData: VisitedData) => {


    useEffect(() => {
        const remote_url = store.cache.remote_url
        const stomp_url = store.cache.stomp_url
        const { subscribe, receive, unsubscribe } = makeStompService(stomp_url)
        console.log('dddddddddddddddddddddddddddddddddddddd')
        subscribe('/topic/ordernotify')

        subscribe('/topic/tracker')

        receive((aa) => {
            if (aa.type === '/topic/ordernotify') {
                const target = visitedData.find(_ => _.name === 'remote')
                console.log('ddd',aa.data)
                target && ipcRenderer.send('open', target)
            }
        })
        return () => {
            unsubscribe()
        }
    }, [visitedData])
    return {}
}