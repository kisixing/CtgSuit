// import printElement from './printElement';
import { useState, useEffect, useCallback, memo } from 'react';
import store from "@/utils/SettingStore";
const settingData = store.cache


const COEFFICIENT = 240




export default (value): {
    startingTime: number,
    endingTime: number,
    locking: boolean,
    customizable: boolean,
    remoteSetStartingTime: (v: number) => void,
    remoteSetEndingTime: (v: number) => void,
    toggleLocking: () => any,
    toggleCustomiz: () => any
} => {


    // const [pdfBase64, setPdfBase64] = useState(`data:application/pdf;base64,${pdf}`)
    const [startingTime, setStartingTime] = useState<number>(0)
    const [endingTime, setEndingTime] = useState<number>(0)
    const [locking, setLocking] = useState(false)
    const [customizable, setCustomizable] = useState(false)


    useEffect(() => {
        const cb = startingTime => {
            console.log('cb')
            const interval = settingData.print_interval
            setStartingTime(
                startingTime
            )
            //TODO: 计算结束时间
            setEndingTime(
                startingTime + Number(interval) * COEFFICIENT
            )
        }
        const cbe = endingTime => {
            console.log('cb')

            setEndingTime(
                endingTime
            )
        }
        value.suit && value.suit.on('suit:startTime', cb).on('suit:endTime', cbe)
        return () => {
            value.suit && value.suit.off('suit:startTime', cb).off('suit:endTime', cb)
        };
    }, [value])


    const toggleLocking = () => {
        const nextV = !locking
        setLocking(nextV)
        value.suit.emit('locking', nextV)
    }
    const toggleCustomiz = () => {
        const nextV = !customizable
        setCustomizable(nextV)
        value.suit.emit('customizing', nextV)
    }
    const remoteSetStartingTime = useCallback(
        (v: number) => {
            setStartingTime(v)
            value.suit.emit('setStartingTime', v)
        },
        [value],
    )
    const remoteSetEndingTime = useCallback(
        (v: number) => {
            setEndingTime(v)
            value.suit.emit('setEndingTime', v)
        },
        [value],
    )

    return {
        startingTime,
        endingTime,
        locking,
        customizable,
        remoteSetStartingTime,
        remoteSetEndingTime,
        toggleLocking,
        toggleCustomiz
    }
}