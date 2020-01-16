import { useState, useEffect } from 'react';

import request from '@/utils/request';



export function useJb(pregnancyId: number, pvId: string) {


    const [jbLoading, setJbLoading] = useState(false)


    const jb = () => {
        setJbLoading(true)
        request.delete(`/prenatal-visits/${pvId}`)
    }

    useEffect(() => {
        if (jbLoading && !pregnancyId) {
            setJbLoading(false)
        }
    }, [pregnancyId, pvId])


    return { jbLoading, jb }

}
