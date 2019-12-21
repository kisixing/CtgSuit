import { useState, useEffect, useCallback } from 'react';
import request from "@lianmed/request";
import { IBed } from '@/types';

export default (areano?: string) => {
    const [list, setList] = useState<IBed[]>([])
    useEffect(() => {
        fetchList()
    }, [])

    const fetchList = useCallback(() => {
        request.get(`/wards/?${areano ? 'areano.equals=' + areano : ''}`).then((res: IBed[]) => {
            setList(
                res.reduce((a, b) => {
                    const brother = a.find(_ => _.deviceno === b.deviceno)
                    if (brother) {
                        brother.bedname += `、${b.bedname}`
                    } else {
                        a.push(b)
                    }
                    return a
                }, [] as IBed[])
            )
        })
    }, [areano])

    return { list, fetchList }
};
