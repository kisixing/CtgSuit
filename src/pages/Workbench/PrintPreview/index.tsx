import React, { useMemo } from 'react';
import { Ctg_Report as Report } from "@lianmed/pages";
import moment from 'moment';
import { ipcRenderer } from 'electron';
import config from '@/utils/config';
import Shell from "../Analysis/Shell";

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
        <Report docid={docid} onDownload={onDownload} {...getPreviewData()} print_interval={20} />

      </Shell>
    </Context.Provider>
  );
}
PrintPreview.printPdf = (docid: string) => {
  const filePath = `${config.apiPrefix}/ctg-exams-pdfurl/${docid}`
  ipcRenderer.send('printWindow', filePath)
}
export default PrintPreview;



