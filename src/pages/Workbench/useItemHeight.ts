import React, { useRef, useEffect, useState } from 'react';



export const useItemHeight = (headCollapsed: boolean, listLayout: number[]) => {
    const [contentHeight, setcontentHeight] = useState(document.querySelector('main').clientHeight)
    const outPadding = 6;

    useEffect(() => {
        setcontentHeight(document.querySelector('main').clientHeight)
    }, [headCollapsed])
    const itemHeight = (contentHeight - outPadding * 2) / listLayout[0];

    return { itemHeight, contentHeight, outPadding }

};

