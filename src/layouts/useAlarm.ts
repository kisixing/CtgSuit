import { useLayoutEffect, useCallback } from "react";
import { event } from "@lianmed/utils";
import { notification } from "antd";
import { IBed } from '@/types';


export default (listData: IBed[]) => {

    const findName = useCallback((unitId: string) => {
        const target = listData.find(_ => _.unitId === unitId)
        unitId === '48-48' && target && console.log('gg', target.bedname)

        return target && target.bedname
    }, [listData])
    useLayoutEffect(() => {
        const audio: HTMLAudioElement = document.querySelector('#alarm')
        let timeout: NodeJS.Timeout

        const onCb = alarmType => {
            // audio.play()
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                audio.pause()
            }, 5000);
        }
        const announcerCb = (text, pitch = 4, rate = .6) => {
            text = findName(text) || ''
            if (!text) return
            const voices = speechSynthesis.getVoices().find(_ => _.lang === 'zh-CN')
            const speechSU = new SpeechSynthesisUtterance();
            speechSU.text = `${text}号子机监护时间到`;
            speechSU.pitch = pitch;
            speechSU.voice = voices;
            speechSU.rate = rate;
            speechSynthesis.speak(speechSU);
            notification.info({ message: `${text}号子机监护时间到`, duration: 10 })

        }

        event
            .on('suit:alarmOn', onCb)
            .on('bed:announcer', announcerCb)
        return () => {
            event
                .off('suit:alarmOn', onCb)
                .off('bed:announcer', announcerCb)
        };
    }, [findName])

}