import { useCallback, useState, useEffect } from "react";
// import request from "@lianmed/request";
import request from '@/utils/request';
import { event } from "@lianmed/utils";
import { Modal } from "antd";
import { IPregnancy, IPrenatalVisit } from "@/types";

export default function useTodo(showTodo: boolean, subscribeData: string[]): [IRemain[], boolean] {
    const [todo, setTodo] = useState<IRemain[]>([])
    const [todoLoading, setTodoLoading] = useState(false)
    const cb = useCallback(
        (value: INewArchive) => {
            const target = todo.find(_ => _.note === value.ctgexam.note)
            if (target) {
                const { pregnancy } = value
                target.data.pregnancy = pregnancy
                target.prenatalVisit = value as any
                setTodo([...todo])
            }
        },
        [todo],
    )
    const discard = useCallback(
        (note: string) => {
            const index = todo.findIndex(_ => _.note === note)
            const target = todo[index]
            if (!target) return
            const fn = () => request.get(`/ctg-exams-nosaving/${target.note}`).then((res) => {
                const next = [...todo]
                next.splice(index, 1)
                setTodo(next)
            })
            if (target.data && target.data.pregnancy) {
                fn()
            } else {
                Modal.confirm({
                    okText: '确认',
                    cancelText: '取消',
                    onOk: fn,
                    content: '未建档，确认关闭吗'
                })
            }

        },
        [todo],
    )
    useEffect(() => {
        showTodo && fetchTodo()
    }, [showTodo]);

    useEffect(() => {
        event.on('newArchive', cb)
        event.on('todo:discard', discard)
        return () => {
            event.off('newArchive', cb)
            event.off('todo:discard', discard)
        };
    }, [todo])
    const fetchTodo = useCallback(
        () => {
            setTodoLoading(true);
            request.get('/ctg-exams-remain').then((res: IRemain[]) => {
                setTodoLoading(false);
                res = res.map(_ => {
                    const _index = _.note.lastIndexOf('_')
                    const deviceno = _.note.slice(0, _index).split('_')[0]
                    const dateString = _.note.slice(_index + 1)
                    const t = ["-", "-", " ", ":", ":", ""]
                    let starttime = '20' + dateString.split('').reduce((a, b, index) => {
                        return a.concat(b) + ((index & 1) ? t[~~(index / 2)] : '')
                    }, '')
                    return {
                        ..._,
                        isTodo: true,
                        deviceno,
                        bedno: null,
                        id: _.note,
                        type: '',
                        data: { docid: _.note, starttime, ismulti: false, GP: '/', status: null, } as any
                    }
                }).filter(_ => subscribeData.includes(_.deviceno))

                return Promise.all(res.map(_ => request.get(`/ctg-exams-data/${_.note}`).catch(err => ({})))).then(all => {
                    setTodo(
                        res.map((_, index) => {
                            return {
                                ..._,
                                data: { ..._.data, ...all[index], }
                            }
                        })
                    )
                }).catch(err => console.log(err))
            })

        },
        [subscribeData]
    )
    return [
        todo, todoLoading
    ]
}
export interface IRemain {
    deviceno: string
    bedname: string;
    bedno: string;
    isTodo: boolean;
    diagnosis: any;
    endTime: any;
    id: any;
    note: string;
    report: any;
    result: any;
    startTime: any;
    type: string;
    prenatalVisit: IPrenatalVisit
    data: {
        index: number
        fhr1: string;
        fhr2: string;
        fhr3: string;
        fm: string;
        toco: string;
        pregnancy?: IPregnancy;
        ismulti: false
        docid: string
        status: any
        starttime: any
    }
}
export interface INewArchive {
    appointmentDate: any;
    ctgexam: {
        diagnosis: any;
        endTime: any;
        id: number;
        note: string;
        report: any;
        result: any;
        startTime: string;
    };
    diagnosis: any;
    diagnosisCode: any;
    doctor: any;
    ecgexam: any;
    generalExam: any;
    gestationalWeek: any;
    gynecologicalExam: any;
    id: number;
    imageExams: any;
    labExams: any;
    pelvicExam: any;
    physicalExam: any;
    pregnancy: IPregnancy;
    visitDate: string;
    visitTime: string;
    visitType: any;
}