import { BedStatus, ICacheItem, IVolumeData } from "@lianmed/lmg/lib/services/WsService";
import { Suit } from "@lianmed/lmg/lib/Ctg/Suit";

export namespace FetalItem {
    export interface IProps {
        is_include_tocozero: boolean
        is_include_volume: boolean
        volumeData?: IVolumeData
        data: ICacheItem
        bedname: string
        bedno: string
        unitId: string
        isTodo: boolean
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
        startTime: string
        outPadding: number
        fullScreenId: string
        activeId: string
        itemHeight: number
        itemSpan: number
        GP: string
        isOn: boolean

    }

    export interface IItemTitle {
        bedNO?: string
        GP?: string
        name?: string
        age?: number
        startTime?: string
        pregnancyId?: number

    }
    export interface IToolbarProps {
        is_include_tocozero: boolean
        is_include_volume: boolean
        volumeData?: IVolumeData
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
        pregnancyId: number
    }
}