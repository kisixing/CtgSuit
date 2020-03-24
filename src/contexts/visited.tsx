import request from "@lianmed/request";
import React, { useEffect, useState } from "react";
export type VisitedData = { title?: string, iconUrl?: string, url?: string, name?: string }[]

const data = [
    {
        url: 'http://yapi.lian-med.com:8080/project/16/interface/api/498',
        name: 'github'
    },
    {
        url: 'https://www.qq.com/?fromdefault',
        name: 'ts'
    },
    {
        url: 'http://192.168.123.48:3000/remote/index.html',
        name: 'remote'
    },
    {
        url: 'http://192.168.123.48:3000/im/index.html',
        name: 'im'
    },
    {
        url: 'http://ccs.lian-med.com/zentaopms/www/user-login-L3plbnRhb3Btcy93d3cv.html',
        name: 'ccs'
    },
    {
        url: 'https://www.w3school.com.cn/index.html',
        name: 'ttt'
    },

]
export const visitedContext = React.createContext<{ visitedData: VisitedData, setVisitedData: Function }>({
    visitedData: [],
    setVisitedData: () => { },
});


export const useVisited = () => {
    const [visitedData, setVisitedData] = useState<VisitedData>([])


    useEffect(() => {
        // Promise.all(
        //     data.map(_ => {
        //         return request.get('', { prefix: _.url, headers: { Origin: _.url, a: '123',Accept:'text/html' } }).then(raw => {
        //             if (raw) {
        //                 let iconUrl = ''
        //                 const origin = new URL(_.url).origin
        //                 const el = document.createElement('html')
        //                 el.innerHTML = raw
        //                 const l: HTMLLinkElement = el.querySelector('link[rel*=icon]')
        //                 if (l) {
        //                     let href = l.getAttribute('href')
        //                     if (href.includes('//')) {
        //                         iconUrl = href
        //                     } else {
        //                         iconUrl = `${origin}${l.getAttribute('href')}`
        //                     }
        //                 }
        //                 const t: HTMLTitleElement = el.querySelector('title')
        //                 const title = t && t.innerText
        //                 return ({
        //                     ..._, title, iconUrl
        //                 })
        //             } else {
        //                 return _
        //             }
        //         }).catch(() => null)
        //     })
        // ).then(d => {
        //     setVisitedData(d.filter(_ => !!_))
        // })


    }, [])
    return { visitedData, setVisitedData }
}