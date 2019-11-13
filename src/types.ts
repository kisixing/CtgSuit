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
    startTime: any;
}

export interface IPrenatalVisit {
    ctgexam: ICtgexam;
    doctor: any;
    gestationalWeek: any;
    id: number;
    visitDate: string;
    visitTime: string;
    visitType: any;
}

export interface IPregnancy {
    adminDate: any;
    age: number;
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
}

export interface IBed {
    bedname: string;
    bedno: string;
    deviceno: string;
    documentno: string;
    id: number;
    pregnancy: IPregnancy;
    prenatalVisit: IPrenatalVisit;
    status: string;
    subdevice: string;
    type: string;
    updateTime: any;
}