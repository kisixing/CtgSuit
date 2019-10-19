import { useEffect } from "react";
import { event } from "@lianmed/utils";
export default () => {

    useEffect(() => {
        const audio: HTMLAudioElement = document.querySelector('#alarm')
        const onCb = alarmType => {
            audio.play()
        }
        const offCb = alarmType => {
            audio.pause()
        }
        event.on('suit:alarmOn', onCb)
        event.on('suit:alarmOff', offCb)
        return () => {
            event.off('suit:alarmOn', onCb)
            event.off('suit:alarmOff', offCb)
        };
    }, [])

}