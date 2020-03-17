// import { useState, useEffect } from "react";
// import request from "@lianmed/request";
// const data = [
//     {
//         url: 'http://www.baidu.com',
//         name: 'baidu'
//     },
//     {
//         url: 'http://localhost:3000/remote/index.html',
//         name: 'remote'
//     },
//     {
//         url: 'http://ccs.lian-med.com/zentaopms/www/user-login-L3plbnRhb3Btcy93d3cv.html',
//         name: 'ccs'
//     },

// ]
// export const useVisited = () => {
//     const [visitedData, setVisitedData] = useState<VisitedData>([])


//     useEffect(() => {
//         Promise.all(
//             data.map(_ => {
//                 return request.get('', { prefix: _.url }).then(raw => {
//                     if (raw) {
//                         let iconUrl = ''
//                         const origin = new URL(_.url).origin
//                         const el = document.createElement('html')
//                         el.innerHTML = raw
//                         const l: HTMLLinkElement = el.querySelector('link[rel=icon]')
//                         if (l) {
//                             let href = l.getAttribute('href')
//                             if (href.includes('//')) {
//                                 iconUrl = href
//                             } else {
//                                 iconUrl = `${origin}${l.getAttribute('href')}`
//                             }
//                         }
//                         const t: HTMLTitleElement = el.querySelector('title')
//                         const title = t && t.innerText
//                         return ({
//                             ..._, title, iconUrl
//                         })
//                     } else {
//                         return _
//                     }
//                 })
//             })
//         ).then(d => {
//             setVisitedData(d)
//         })


//     }, [])
//     return { visitedData }
// }