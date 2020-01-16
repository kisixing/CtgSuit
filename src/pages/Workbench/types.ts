import { BedStatus, ICacheItem, IVolumeData, ICacheItemPregnancy } from "@lianmed/lmg/lib/services/WsService";
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
        deviceno: string
        docid: string
        status: BedStatus

        startTime: string
        outPadding: number
        fullScreenId: string
        activeId: string
        itemHeight: number
        itemSpan: number
        isOn: boolean
        pregnancy: ICacheItemPregnancy
    }



    export interface IItemTitle {
        bedNO?: string
        GP?: string
        gestationalWeek?: string
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
        startTime: string
        unitId: string
        bedname: string
        deviceno: string
        bedno: string
        docid: string
        status: BedStatus
        pregnancy: ICacheItemPregnancy

    }
}  
