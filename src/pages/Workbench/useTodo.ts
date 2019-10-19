import { useCallback, useState, useEffect } from "react";
import request from "@lianmed/request";
import { event } from "@lianmed/utils";
import { Modal } from "antd";
export default function useTodo(showTodo: boolean): [IRemain[], boolean] {
    const [todo, setTodo] = useState<IRemain[]>([])
    const [todoLoading, setTodoLoading] = useState(false)
    const cb = useCallback(
        (value: INewArchive) => {
            const target = todo.find(_ => _.note === value.ctgexam.note)
            if (target) {
                target.data.pregnancy = value.pregnancy
            }
        },
        [todo],
    )
    const discard = useCallback(
        (note: string) => {
            const index = todo.findIndex(_ => _.note === note)
            const target = todo[index]
            if (!target) return
            Modal.confirm({
                onOk() {
                    request.get(`/ctg-exams-nosaving/${target.note}`).then((res) => {
                        const next = [...todo]
                        console.log(index)

                        next.splice(index, 1)
                        setTodo(next)
                    })
                },
                content:'确认丢弃吗'
            })

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
                return Promise.all(res.map(_ => request.get(`/ctg-exams-data/${_.note}`))).then(all => {
                    setTodoLoading(false);
                    setTodo(res.map((_, index) => {
                        const _index = _.note.lastIndexOf('_')
                        const bedname = _.note.slice(0, _index).split('_')[0]
                        const dateString = _.note.slice(_index + 1)
                        const t = ["-", "-", " ", ":", ":", ""]
                        let starttime = '20' + dateString.split('').reduce((a, b, index) => {
                            return a.concat(b) + (index % 2 === 1 ? t[~~(index / 2)] : '')
                        }, '')

                        return {
                            ..._,
                            isTodo: true,
                            bedname,
                            id: _.note,

                            data: { ...all[index], docid: _.note, starttime }
                        }
                    }
                    ))
                })
            })

        },
        []
    )
    console.log('todo', todo)
    return [
        todo, todoLoading
    ]
}
export interface IRemain {
    isTodo: true;
    diagnosis: any;
    endTime: any;
    id: any;
    note: string;
    report: any;
    result: any;
    startTime: any;
    data: {
        fhr1: string;
        fhr2: string;
        fhr3: string;
        fm: string;
        toco: string;
        pregnancy?: any;
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
    pregnancy: {
        adminDate: any;
        age: number;
        areaNO: string;
        bedNO: string;
        dob: any;
        doctor: any;
        edd: any;
        ethnic: any;
        gender: any;
        gravidity: number;
        id: number;
        idNO: any;
        idType: any;
        inpatientNO: string;
        insuranceType: any;
        lmp: any;
        name: string;
        organization: any;
        outpatientNO: any;
        parity: number;
        riskRecords: any[];
        roomNO: any;
        sureEdd: any;
        telephone: any;
    };
    visitDate: string;
    visitTime: string;
    visitType: any;
}