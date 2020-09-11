import React, { useMemo } from 'react';
import { Ctg_Report as Report } from "@lianmed/pages";
import moment from 'moment';
import { ipcRenderer } from 'electron';
import config from '@/utils/config';
import Shell from "../Analysis/Shell";
import SettingStore from "@/utils/SettingStore";
export const Context = React.createContext({});

interface IProps {
  docid: string
  visible: boolean
  onCancel: () => void
  inpatientNO: string
  name: string
  age: string
  startTime: string
  gestationalWeek?: string
}

const PrintPreview = (props: IProps) => {
  const { docid, name, age, gestationalWeek, inpatientNO, startTime } = props;

  const onDownload = () => {
    PrintPreview.printPdf(docid)
  }

  const getPreviewData = () => {
    return {
      name,
      age,
      gestationalWeek,
      inpatientNO,
      startdate: moment(startTime).format('YYYY-MM-DD HH:mm:ss'),
      fetalcount: 2,
    }
  }

  const v = useMemo(() => { return {} }, []);

  return (
    <Context.Provider value={v}>

      <Shell {...props}>
        <Report docid={docid} onDownload={onDownload} {...getPreviewData()} print_interval={SettingStore.cache.print_interval} />

      </Shell>
    </Context.Provider>
  );
}
PrintPreview.printPdf = (docid: string) => {
  const filePath = `${config.apiPrefix}/ctg-exams-pdfurl/${docid}?show_fetalmovement=${window['obvue'] ? !!window['obvue'].setting.show_fetalmovement : false}`
  ipcRenderer.send('printWindow', filePath)
}
export default PrintPreview;



