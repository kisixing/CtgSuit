import { useLayoutEffect, useCallback } from "react";
import { event } from "@lianmed/utils";
import { notification } from "antd";
import { IBed } from '@/types';
import store from "store";
import SettingStore from "@/utils/SettingStore";
declare var __DEV__: boolean;


export default (listData: IBed[]) => {

    const ward = store.get('ward') || {}
    const isIn = ward.wardType === 'in'
    const findName = useCallback((unitId: string) => {
        const target = listData.find(_ => _.unitId === unitId)
        const bedNO = target && target.data && target.data.pregnancy && target.data.pregnancy.bedNO && `${target.data.pregnancy.bedNO}号床位`
        const bedname = target && target.bedname && `${target.bedname}号机`
        return isIn ? (bedNO || bedname) : bedname
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
            text = findName(text)
            if (!text || SettingStore.cache.alarm_finished === '0') return
            const voices = speechSynthesis.getVoices().find(_ => _.lang === 'zh-CN')
            const speechSU = new SpeechSynthesisUtterance();
            speechSU.text = `${text}监护时间到`;
            speechSU.pitch = pitch;
            speechSU.voice = voices;
            speechSU.rate = rate;
            speechSynthesis.speak(speechSU);
            __DEV__ || notification.info({ message: `${text}监护时间到`, duration: 10 })
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