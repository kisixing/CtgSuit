import { useState, useEffect, useRef } from "react";
// import request from "@lianmed/request";
import { makeStompService, StompService } from "@lianmed/utils";
import store from '../utils/SettingStore'
import { VisitedData } from "../contexts/visited";
import _ from 'lodash'
import { ipcRenderer } from "electron";

const remote_url = store.cache.remote_url
const stomp_url = store.cache.stomp_url

export const useStomp = (visitedData: VisitedData) => {
    const stompService = useRef(new StompService(stomp_url))

    useEffect(() => {
        const s = stompService.current
        const k = '/topic/ordernotify'
        const cb = (aa) => {
            console.log('stom', k, aa);

            const target = visitedData.find(_ => _.name === 'remote')
            target && ipcRenderer.send('open', target)
        }

        s.on(k, cb)
        return () => {
            s.off(k, cb)
        }
    }, [visitedData])
    // useEffect(() => {

    //     const { subscribe, receive, unsubscribe } = makeStompService(stomp_url)
    //     console.log('dddddddddddddddddddddddddddddddddddddd')
    //     subscribe('/topic/ordernotify')

    //     subscribe('/topic/tracker')

    //     receive((aa) => {
    //         if (aa.type === '/topic/ordernotify') {
    //             const target = visitedData.find(_ => _.name === 'remote')
    //             console.log('ddd', aa.data)
    //             target && ipcRenderer.send('open', target)
    //         }
    //     })
    //     return () => {
    //         unsubscribe()
    //     }
    // }, [visitedData])
    return {}
}