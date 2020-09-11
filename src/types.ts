import { ICacheItem, BedStatus } from "@lianmed/lmg/lib/services/types";
import { TListModel } from "./models/list";
export enum ETabKey {
    GENERAL = 'GENERAL',
    // REMAIN,
    F0_PRO = 'F0_PRO'
}
export interface ICtgexam {
    diagnosis: any;
    endTime: any;
    fetalnum: any;
    fetalposition: any;
    id: number;
    note: string;
    report: any;
    result: any;
    sign: any;
    startTime: string;
}
export interface IState {
    list: TListModel
    [x: string]: any
}
export interface IPrenatalVisit {
    ctgexam: ICtgexam;
    doctor: any;
    gestationalWeek: any;
    id: number;
    visitDate: string;
    visitTime: string;
    visitType: any;
    pregnancy: IPregnancy

    appointmentDate: any
    diagnosis: any
    diagnosisCode: any
    ecgexam: any
    gynecologicalExam: any
}
export enum ERecordstate {
    in = '10',
    out = '20',
    door = '30'
}
export interface IPregnancy {
    GP?: string
    gestationalWeek?: string
    adminDate: any;
    age: string;
    areaNO: string;
    bedNO: string;
    dob: string;
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
    outpatientNO: string;
    parity: number;
    prenatalscreens: any;
    riskRecords: any[];
    roomNO: any;
    sureEdd: any;
    telephone: any;
    recordstate: ERecordstate
}

export interface IBed {
    deviceType: string
    bedname: string;
    bedno: string;
    deviceno: string;
    documentno: string;
    id: number;
    pregnancy: IPregnancy;
    prenatalVisit: IPrenatalVisit;
    status: BedStatus;
    subdevice: string;
    type: string;
    updateTime: any;
    areaname: string;
    areano: string;
    tabKey: ETabKey
    pageCount: number
    unitId?: string;
    pageIndex?: number;
    data?: ICacheItem;
    isTodo: boolean
}

export interface IWard {
    wardName?: string
    wardId?: string
    id?: number
    wardType?: 'in' | 'out'
    wardNamezh?: string
    note?: string
}