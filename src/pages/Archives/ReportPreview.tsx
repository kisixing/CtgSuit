import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { Menu, Spin, Button, Popconfirm } from 'antd';
import moment from 'moment';
import PreviewContent from "@lianmed/pages/lib/Ctg/Report/Panel/PreviewContent";
import Shell from "../Workbench/Analysis/Shell";
import request from "@lianmed/request";
import PrintPreview from "../Workbench/PrintPreview";
import { event } from '@lianmed/utils';

interface IReport {
  valid?: boolean
  archived?: boolean
  bizSn?: string
}
interface IProps {
  report: IReport[]
  docid: string
  visible: boolean
  onCancel: () => void
  inpatientNO: string
  name: string
  age: string
  startTime: string
  gestationalWeek?: string
}
export const Context = React.createContext({});

function ReportPreview(props: IProps) {
  let { report = [] } = props;
  report = report.sort(compare('time'))

  const [_report, set_report] = useState(report)

  const [currentReport, setCurrentReport] = useState(_report[0] && _report[0]['bizSn']);
  const [loading, setLoading] = useState(false);
  const [pdfBase64, setPdfBase64] = useState('');
  const inputEl = useRef(null);
  const [wh, setWh] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const { clientHeight, clientWidth } = inputEl.current;
    setWh({ h: clientHeight, w: clientWidth - 176 });
  }, []);

  useEffect(() => {
    currentReport && fetchpdf(currentReport);
  }, []);

  const fetchpdf = (value: string) => {
    // setPdfBase64(null);
    setLoading(true);
    request
      .get('/ctg-exams-pdf', {
        params: {
          report: value,
        },
      })
      .then(({ pdfdata }) => {
        pdfdata && setPdfBase64(`data:application/pdf;base64,${pdfdata}`);
        setLoading(false);
      });
  };
  const onDownload = () => {
    console.log(currentReport)
    PrintPreview.printPdf(currentReport)
  }
  const cb = (data: { report: IReport[] } = { report: [] }) => {
    set_report(data.report)
    event.emit('signed')
  }
  const confirm = async () => {
    let res = await request.delete(`/obsolete-report/${currentReport}`)
    setPdfBase64(null)
    res && cb(res)
  };

  const archiving = async (e) => {
    let res = await request.put('/doc/archive', { data: { bizSn: currentReport } })
    res && cb(res)

  };
  const undoArchiving = async (e) => {
    let res = await request.put('/doc/undo-archive', { data: { bizSn: currentReport } })
    res && cb(res)

  };

  const handleClick = ({ key }) => {
    if (key === currentReport) return;
    setCurrentReport(key);
    fetchpdf(key);
  };

  function compare(key) {
    return function (value1, value2) {
      const val1 = value1[key];
      const val2 = value2[key];
      const v1 = moment(val1).valueOf();
      const v2 = moment(val2).valueOf();
      return v2 - v1;
    };
  }
  const target: IReport = _report.find(_ => _.bizSn === currentReport) || {}
  return (
    <Shell {...props}>
      <div
        style={{ height: '96%', textAlign: 'center', display: 'flex' }}
        ref={inputEl}
      >
        <Menu
          style={{ width: 176 }}
          defaultSelectedKeys={[currentReport]}
          theme="light"
          onClick={handleClick}
        >
          {_report &&
            _report.map(e => {
              return (
                <Menu.Item key={e.bizSn}>
                  <div>{e.bizSn}</div>
                </Menu.Item>
              );
            })}
        </Menu>
        <div style={{ flex: 1 }}>
          <Spin spinning={loading}>
            <PreviewContent
              pdfBase64={pdfBase64}
              // pdfBase64={`${config.apiPrefix}/ctg-exams-pdfurl/${currentReport}`}
              wh={wh}
              isFull
              borderd={false}
            />
          </Spin>
        </div>
      </div>
      <div style={{ float: 'right', margin: 6 }}>
        {target.archived ? (
          <Button onClick={undoArchiving}>取消归档</Button>
        ) : (
          <Button disabled={!currentReport} onClick={archiving}>
            归档
          </Button>
        )}
        <Popconfirm
          title="确认删除该报告？"
          onConfirm={confirm}
          okText="是"
          cancelText="否"
        >
          <Button disabled={!currentReport} style={{ margin: 6 }}>
            删除
          </Button>
        </Popconfirm>
        <Button disabled={!currentReport} type="primary" onClick={onDownload}>
          打印
        </Button>
      </div>
    </Shell>
  );
}

export default ReportPreview;
