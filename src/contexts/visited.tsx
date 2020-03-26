import request from "@lianmed/request";
import React, { useEffect, useState } from "react";
export type VisitedData = { title?: string, iconUrl?: string, url?: string, name?: string }[]
import settingStore from "@/utils/SettingStore";
const data = [
    {
        url: '/remote/index.html',
        name: 'remote'
    },
    {
        url: '/im/index.html',
        name: 'im'
    }

]
export const visitedContext = React.createContext<{ visitedData: VisitedData, setVisitedData: Function }>({
    visitedData: [],
    setVisitedData: () => { },
});


export const useVisited = () => {
    const { stomp_url, public_url, remote_url } = settingStore.cache
    const [visitedData, setVisitedData] = useState<VisitedData>([])


    useEffect(() => {
        Promise.all(
            data.map(_ => {
                let url = _.url
                const isAbs = url.startsWith('http')

                if (!isAbs) {
                    const absUrl = `http://${public_url}${url}`
                    url = request.configToLocation(absUrl, { stomp_url, prefix: remote_url })
                }
                return request.get('', { prefix: url, hideErr: true, headers: { Origin: url, a: '123', Accept: 'text/html' } }).then(raw => {
                    if (raw) {
                        let iconUrl = ''
                        const origin = new URL(url).origin
                        const el = document.createElement('html')
                        el.innerHTML = raw
                        const l: HTMLLinkElement = el.querySelector('link[rel*=icon]')
                        if (l) {
                            let href = l.getAttribute('href')
                            if (href.includes('//')) {
                                iconUrl = href
                            } else {
                                iconUrl = `${origin}${l.getAttribute('href')}`
                            }
                        }
                        const t: HTMLTitleElement = el.querySelector('title')
                        const title = t && t.innerText
                        return ({
                            ..._, url, title, iconUrl
                        })
                    } else {
                        return _
                    }
                }).catch(() => null)
            })
        ).then(d => {
            setVisitedData(d.filter(_ => !!_))
        })


    }, [])
    return { visitedData, setVisitedData }
}