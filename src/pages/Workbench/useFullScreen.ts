import React, { useEffect, useCallback, useRef, MutableRefObject } from "react";
import ReactDOM from 'react-dom';

type clickCb = ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void)
type IUseReturn = [MutableRefObject<any>, clickCb]

export default (fullScreenId: string, unitId: string, dispatch): IUseReturn => {
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
            dispatch({ type: 'list/setState', payload: { fullScreenId: null } });
        }


        return () => {

        };
    }, [fullScreenId])
    return [ref, fullScreen]
}