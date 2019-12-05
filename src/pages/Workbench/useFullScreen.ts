import React, { useEffect, useCallback, useRef, MutableRefObject } from "react";
import ReactDOM from 'react-dom';
import { event } from "@lianmed/utils";

type clickCb = ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void)
type IUseReturn = [MutableRefObject<any>, clickCb]

export default (fullScreenId: string, unitId: string, activeId: string): IUseReturn => {
    const ref = useRef(null)
    const fullScreen: clickCb = useCallback(
        (e) => {
            const el = ReactDOM.findDOMNode(ref.current);
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                el.requestFullscreen();
            }
        }, []
    )
    useEffect(() => {



        if (fullScreenId === unitId) {
            fullScreen(null);
            event.emit('bedFullScreen', unitId)
        }
        if (activeId === unitId) {
            // const el: HTMLDivElement = ReactDOM.findDOMNode(ref.current);
            // el.style.transition = 'all .2s '
            // el.style.transform = 'translateY(-20px)'
        }

        return () => {

        };
    }, [fullScreenId, activeId])
    return [ref, fullScreen]
}