import { useLayoutEffect, useCallback, useRef, useEffect } from "react";
import { event } from "@lianmed/utils";
import { notification } from "antd";
import { IBed } from '@/types';
import store from "store";
import SettingStore from "@/utils/SettingStore";


export default (listData: IBed[]) => {
    const alarm0_ref = useRef<HTMLAudioElement>()
    const alarm1_ref = useRef<HTMLAudioElement>()
    const alarm2_ref = useRef<HTMLAudioElement>()
    const m = {
        alarm0_ref,
        alarm1_ref,
        alarm2_ref,
    }
    const alarm_msg = useRef(new Set())

    const ward = store.get('ward') || {}
    const isIn = ward.wardType === 'in'
    const findName = useCallback((unitId: string) => {
        const target = listData.find(_ => _.unitId === unitId)
        const bedNO = target && target.data && target.data.pregnancy && target.data.pregnancy.bedNO && `${target.data.pregnancy.bedNO}号床位`
        const bedname = target && target.bedname && `${target.bedname}号机`
        return isIn ? (bedNO || bedname) : bedname
    }, [listData])
    useEffect(() => {
        const alarm_volumn = (SettingStore.cache.alarm_volumn || 5) / 10
        const alarm_muted = (SettingStore.cache.alarm_muted || false)
 
        Array(3).fill(0).forEach((_, i) => {
            const t: HTMLAudioElement = document.querySelector(`#alarm${i}`)
            m[`alarm${i}_ref`].current = t
            try {
                if (t) {
                    t.volume = alarm_volumn
                    t.muted = alarm_muted
                }
            } catch (e) {

            }
        })

    }, [])
    useEffect(() => {
        let id = setInterval(() => {
            alarm0_ref.current.pause()
            alarm1_ref.current.pause()
            alarm2_ref.current.pause()

            const m = alarm_msg.current
            if (m.has(2)) {
                alarm2_ref.current.play()
            } else if (m.has(1)) {
                alarm1_ref.current.play()
            } else if (m.has(0)) {
                alarm0_ref.current.play()
            }
            alarm_msg.current = new Set()
        }, 2000)
        return () => clearInterval(id)
    }, [])
    useLayoutEffect(() => {


        const onCb = alarmType => {
            // audio.play()
            console.log('alarm alarmType', alarmType)

            alarm_msg.current.add(alarmType)
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
            .on('audio:alarm', onCb)
            .on('bed:announcer', announcerCb)
        return () => {
            event
                .off('audio:alarm', onCb)
                .off('bed:announcer', announcerCb)
        };
    }, [findName])

}