import { useEffect } from "react";
import { event } from "@lianmed/utils";
console.log('11111', event)
export default () => {

    useEffect(() => {
        const audio: HTMLAudioElement = document.querySelector('#alarm')
        let timeout

        const onCb = alarmType => {
            // audio.play()
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                audio.pause()
            }, 50000);
        }
        const announcerCb = text => {
            // audio.play()
            var speechSU = new SpeechSynthesisUtterance();
            speechSU.text = text;
            speechSynthesis.speak(speechSU);
        }

        event.on('suit:alarmOn', onCb)
        event.on('bed:announcer', announcerCb)
        return () => {
            event.off('suit:alarmOn', onCb)
            event.off('bed:announcer', announcerCb)
        };
    }, [])

}