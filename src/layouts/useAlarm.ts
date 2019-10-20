import { useEffect } from "react";
import { event } from "@lianmed/utils";
export default () => {

    useEffect(() => {
        const audio: HTMLAudioElement = document.querySelector('#alarm')
        let timeout
        const onCb = alarmType => {
            audio.play()
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                audio.pause()
            }, 50000);
        }

        event.on('suit:alarmOn', onCb)
        return () => {
            event.off('suit:alarmOn', onCb)
        };
    }, [])

}