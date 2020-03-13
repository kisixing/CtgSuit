import { BedStatus, ICacheItem, IVolumeData, ICacheItemPregnancy } from "@lianmed/lmg/lib/services/WsService";
import { Suit } from "@lianmed/lmg/lib/Ctg/Suit";

export namespace FetalItem {



    export interface IProps {
        loading: boolean
        // is_include_tocozero: boolean
        // is_include_volume: boolean
        // volumeData?: IVolumeData
        // bedno: string
        // deviceno: string
        children: React.ReactNode
        startTime: string
        pregnancy: ICacheItemPregnancy

        data: ICacheItem
        bedname: string
        unitId: string
        isTodo: boolean
        ismulti: boolean
        docid: string
        status: BedStatus

        outPadding: number
        fullScreenId: string
        itemHeight: number
        itemSpan: number
        isOn: boolean
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
        itemData:any
        is_include_tocozero: boolean
        is_include_volume: boolean
        volumeData?: IVolumeData
        isTodo: boolean
        startTime: string
        unitId: string
        bedname: string
        deviceno: string
        bedno: string
        docid: string
        status: BedStatus
        pregnancy: ICacheItemPregnancy
        mutableSuit?: any
        showBar?: boolean
        menusStyle?: React.CSSProperties
    }
}  
