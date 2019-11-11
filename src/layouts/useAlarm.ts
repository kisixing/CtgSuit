import { useEffect } from "react";
import { event } from "@lianmed/utils";
export default () => {

    useEffect(() => {
        const audio: HTMLAudioElement = document.querySelector('#alarm')
        let timeout:NodeJS.Timeout

        const onCb = alarmType => {
            // audio.play()
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                audio.pause()
            }, 5000);
        }
        const announcerCb = (text, pitch = 4, rate = .6) => {
            const voices = speechSynthesis.getVoices().find(_ => _.lang === 'zh-CN')
            const speechSU = new SpeechSynthesisUtterance();
            speechSU.text = text;
            speechSU.pitch = pitch;
            speechSU.voice = voices;
            speechSU.rate = rate;
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