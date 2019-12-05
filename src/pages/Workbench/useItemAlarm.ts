import { useEffect, useState } from "react";
import { event } from "@lianmed/utils";
import { Suit } from "@lianmed/lmg/lib/Ctg/Suit";
import { throttle } from "lodash";

export default (suit: Suit) => {
    const [alarmStatus, setAlarmStatus] = useState<string>(null)

    useEffect(() => {
        const _setAlarmStatus = throttle((alarmType) => {
            setAlarmStatus(alarmType)
        }, 0)
        const onCb = (alarmType: string) => {
            event.emit(`Suit:alarmOn`, alarmType)
            _setAlarmStatus(alarmType)
        }
        const offCb = (alarmType: string) => {
            event.emit(`Suit:alarmOff`, alarmType)
            _setAlarmStatus(null)
        }

        suit && suit
            .on('alarmOn', onCb)
            .on('alarmOff', offCb)

        return () => {
            suit && suit
                .off('alarmOn', onCb)
                .off('alarmOff', offCb)
        };
    }, [suit])
    return [alarmStatus]
}