import { BedStatus, ICacheItem } from "@lianmed/lmg/lib/services/WsService";
import { Suit } from "@lianmed/lmg/lib/Ctg/Suit";

export namespace FetalItem {
    export interface IProps {
        data: ICacheItem
        bedname: string
        bedno: string
        unitId: string
        isTodo: boolean
        note: string
        ismulti: boolean
        inpatientNO: string
        name: string
        age: number
        gestationalWeek: string
        deviceno: string
        bedNO: string
        docid: string
        status: BedStatus
        pregnancyId: number
        index: any
        startTime: string
        outPadding: number
        fullScreenId: string
        itemHeight: number
        itemSpan: number
        GP: string
    }

    export interface IItemTitle {
        bedNO?: string
        GP?: string
        name?: string
        age?: number
        startTime?: string
    }
    export interface IToolbarProps {
        suitObject: { suit: Suit }
        showLoading: (s: boolean) => void
        isTodo: boolean
        inpatientNO: string
        name: string
        age: number
        startTime: string
        gestationalWeek: string
        unitId: string
        bedname: string
        deviceno: string
        bedno: string
        docid: string
        status: BedStatus
        index: any
        pregnancyId: number
    }
}