let datacache: Map<any, any> = new Map();
const interval: number = 30000;
const RECONNECT_INTERVAL: number = 10000;
export default datacache;
const log = console.log.bind(console, 'websocket')
let offrequest;
// import { message as Message } from "antd";
import config from '@/utils/config';
import { EventEmitter } from "@lianmed/utils";
import request from "@/utils/request";

export enum EWsStatus {
  Pendding, Success, Error
}



export class WsConnect extends EventEmitter {
  static _this: WsConnect;
  datacache = datacache;
  socket: WebSocket;
  offrequest :number;
  store = (window as any).g_app._store
  constructor() {
    super()
    if (WsConnect._this) {
      return WsConnect._this;
    }
    WsConnect._this = this;
  }

  startwork(device_no, bed_no) {
    const message = `{"name":"start_work","data":{"device_no":${device_no},"bed_no":${bed_no}}}`;
    this.socket.send(message);
  }
  endwork(device_no, bed_no) {
    const message = `{"name":"end_work","data":{"device_no":${device_no},"bed_no":${bed_no}}}`;
    this.socket.send(message);
  }
  dispatch(action: any) {
    (window as any).g_app._store.dispatch(action);
  }
  tip = (text: string, status: EWsStatus) => {
    log(text);
    this.dispatch({
      type: 'ws/setState',
      payload: { status }
    })
  }
  connect = (url: string = config.wsUrl): Promise<Map<any, any>> => {

    this.tip('连接中', EWsStatus.Pendding)

    this.socket = new WebSocket(
      `ws://${url}/websocket/?request=e2lkOjE7cmlkOjI2O3Rva2VuOiI0MzYwNjgxMWM3MzA1Y2NjNmFiYjJiZTExNjU3OWJmZCJ9`,
    );
    const socket = this.socket;

    return new Promise(res => {

      socket.onerror = () => {
        log('错误')
      };
      socket.onopen = function (event) {
        offrequest = 0;
        log('打开');
      };
      socket.onclose = (event) => {
        this.tip('关闭', EWsStatus.Error)
        setTimeout(() => {
          this.connect()
        }, RECONNECT_INTERVAL);
      };
      // 接收服务端数据时触发事件
      socket.onmessage = (msg) => {
        var received_msg = JSON.parse(msg.data);
        if (received_msg) {
          //showMessage(received_msg);
          if (received_msg.name == 'push_devices') {
            var devlist = received_msg.data;
            for (var i in devlist) {
              var devdata = devlist[i];
              if (!devdata) continue;
              for (let bi in devdata.beds) {
                var cachebi = Number(devdata['device_no']) + '-' + Number(devdata.beds[bi].bed_no);
                if (!datacache.has(cachebi)) {
                  datacache.set(cachebi, {
                    fhr: [],
                    toco: [],
                    fm: [],
                    index: 0,
                    length: 0,
                    start: -1,
                    last: 0,
                    past: 0,
                    timestamp: 0,
                    docid: '',
                    status: '',
                    orflag :true,
                    starttime: '',
                    fetal_num: 1,
                  });
                  convertdocid(cachebi, devdata.beds[bi].doc_id);
                  if (devdata.beds[bi].is_working) {
                    datacache.get(cachebi).status = 1;
                  } else {
                    datacache.get(cachebi).status = 2;
                  }
                  datacache.get(cachebi).fetal_num = devdata.beds[bi].fetal_num;
                  for (let fetal = 0; fetal < devdata.beds[bi].fetal_num; fetal++) {
                    datacache.get(cachebi).fhr[fetal] = [];
                  }
                }
              }
            }
            this.tip('成功', EWsStatus.Success)
            res(datacache)
          } else if (received_msg.name == 'push_data_ctg') {
            //TODO 解析应用层数据包
            var ctgdata = received_msg.data;
            //console.log(ctgdata);
            var id = received_msg.device_no;
            var bi = received_msg.bed_no;
            var cachbi = id + '-' + bi;
            if (datacache.has(cachbi)) {
              var tmpcache = datacache.get(cachbi);
              for (let key in ctgdata) {
                for (let fetal = 0; fetal < tmpcache.fetal_num; fetal++) {
                  if (fetal == 0) {
                    tmpcache.fhr[fetal][ctgdata[key].index] = ctgdata[key].fhr;
                  } else {
                    tmpcache.fhr[fetal][ctgdata[key].index] = ctgdata[key].fhr2;
                  }
                }
                tmpcache.toco[ctgdata[key].index] = ctgdata[key].toco;
                if (tmpcache.start == -1) {
                  tmpcache.start = ctgdata[key].index;
                  tmpcache.past = ctgdata[key].index - 4800 > 0 ? ctgdata[key].index - 4800 : 0;
                  if (tmpcache.past > 0) {
                    console.log(datacache.get(cachbi).docid, tmpcache.past);
                    getoffline(datacache.get(cachbi).docid, tmpcache.past);
                  }
                }
                setcur(cachbi, ctgdata[key].index);
                for (let i = datacache.get(cachbi).start; i > datacache.get(cachbi).past; i--) {
                  if (!tmpcache.fhr[0][i]) {
                    var curstamp = new Date().getTime();
                    if (offrequest <8 && (tmpcache.orflag || curstamp - tmpcache.timestamp > interval)) {
                      tmpcache.orflag = false;
                      offrequest += 1;  
                      var dis = tmpcache.start - tmpcache.past;
                      var length = dis > 800 ? 800 : dis;
                      var startpoint = tmpcache.start - length;
                      var endpoint = tmpcache.start;
                      //反向取值
                      send(
                        '{"name":"get_data_ctg","data":{"start_index":' +
                        startpoint +
                        ',"end_index":' +
                        endpoint +
                        ',"device_no":' +
                        id +
                        ',"bed_no":' +
                        bi +
                        '}}',
                      );
                      tmpcache.timestamp = new Date().getTime();
                      break;
                    }
                  }
                }
                // 更新last index
                if (ctgdata[key].index - tmpcache.last < 2) {
                  tmpcache.last = ctgdata[key].index;
                }
              }
            }
          } else if (received_msg.name == 'get_data_ctg') {
            //TODO 解析应用层数据包
            var ctgdata = received_msg.data;
            var id = received_msg.device_no;
            var bi = received_msg.bed_no;
            var cachbi = id + '-' + bi;
            if (datacache.has(cachbi)) {
              var tmpcache = datacache.get(cachbi);
              for (let key in ctgdata) {
                for (let fetal = 0; fetal < tmpcache.fetal_num; fetal++) {
                  if (fetal == 0) {
                    tmpcache.fhr[fetal][ctgdata[key].index] = ctgdata[key].fhr;
                  } else {
                    tmpcache.fhr[fetal][ctgdata[key].index] = ctgdata[key].fhr2;
                  }
                }
                tmpcache.toco[ctgdata[key].index] = ctgdata[key].toco;
                setcur(cachbi, ctgdata[key].index);
              }
              tmpcache.orflag = true; 
              if(offrequest>0){
                  offrequest -= 1;
              }
              //判断 是否有缺失
              var flag = 0;
              var sflag = 0;
              var eflag = 0;
              for (let il = tmpcache.last; il < tmpcache.index; il++) {
                if (!tmpcache.fhr[0][il]) {
                  if (flag == 0) {
                    sflag = il;
                  }
                } else {
                  if (flag > 0) {
                    eflag = il;
                    var curstamp = new Date().getTime();
                    if (offrequest <8 && (tmpcache.orflag || curstamp - tmpcache.timestamp > interval)) {
                      tmpcache.orflag = false;
                      offrequest += 1;
                      send(
                        '{"name":"get_data_ctg","data":{"start_index":' +
                        sflag +
                        ',"end_index":' +
                        eflag +
                        ',"device_no":' +
                        id +
                        ',"bed_no":' +
                        bi +
                        '}}',
                      );
                      tmpcache.timestamp = new Date().getTime();
                      break;
                    }
                  } else {
                    tmpcache.last = il;
                  }
                }
              }
            }
          } else if (received_msg.name == 'get_devices') {
            log('get_devices', received_msg.data);
            var devlist = received_msg.data;
            for (var i in devlist) {
              var devdata = devlist[i];
              if (!devdata) continue;
            }
          }
          //开启监护页
          else if (received_msg.name == 'start_work') {
            let devdata = received_msg.data;
            const { bed_no, device_no } = devdata;
            let curid = `${device_no}-${bed_no}`;
            let count = datacache.get(curid).fetal_num ;
            //TODO : 更新设备状态
            datacache.get(curid).fhr = [];
            datacache.get(curid).toco = [];
            datacache.get(curid).fm = [];
            datacache.get(curid).index = 0;
            datacache.get(curid).length = 0;
            datacache.get(curid).start = -1;
            datacache.get(curid).last = 0;
            datacache.get(curid).past = 0;
            datacache.get(curid).timestamp = 0;
            datacache.get(curid).docid = '';
            datacache.get(curid).status = 0;
            datacache.get(curid).starttime = '';
            convertdocid(curid, devdata.doc_id);
            if (devdata.is_working) {
              datacache.get(curid).status = 1;
            } else {
              datacache.get(curid).status = 2;
            }
            datacache.get(curid).fetal_num = count;
            for (let fetal = 0; fetal < count; fetal++) {
              datacache.get(curid).fhr[fetal] = [];
            }
            //TODO : 更新设备状态
            convertdocid(curid, devdata.doc_id);
            log('start_work', devdata.is_working);
            const target = datacache.get(curid)
            if (devdata.is_working) {
              target.status = 1
            } else {
              target.status = 2
            }

            this.dispatch({
              type: 'ws/setState', payload: { data: new Map(datacache) }
            })
          }
          //结束监护页
          else if (received_msg.name == 'end_work') {
            let devdata = received_msg.data;
            let curid = Number(devdata['device_no']) + '-' + Number(devdata['bed_no']);
            
            if (devdata.is_working) {
              datacache.get(curid).status = 1;
            } else {
              datacache.get(curid).status = 2;
            }
            
            log('end_work', devdata.is_working, datacache.get(curid).status );
            this.dispatch({
              type: 'ws/setState', payload: { data: new Map(datacache) }
            })
          }
        }
      };
      return [datacache];
    });

    function convertdocid(id: any, doc_id: string) {
      datacache.get(id).docid = doc_id;
      if (doc_id != '') {
        let vt = doc_id.split('_');
        if (vt.length > 2) {
          datacache.get(id).starttime =
            '20' +
            vt[2].substring(0, 2) +
            '-' +
            vt[2].substring(2, 4) +
            '-' +
            vt[2].substring(4, 6) +
            ' ' +
            vt[2].substring(6, 8) +
            ':' +
            vt[2].substring(8, 10) +
            ':' +
            vt[2].substring(10, 12);
        }
      }
    }
    function setcur(id: any, value: number) {
      /*
          if(!datacache.get(id).index){
        datacache.get(id).index = value;
      }*/
      if (value < datacache.get(id).start) {
        datacache.get(id).start = value;
      } else if (value >= datacache.get(id).index) {
        datacache.get(id).index = value;
      }
    }

    function send(message: string) {
      if (socket.readyState == WebSocket.OPEN) {
        socket.send(message);
      } else {
        log('The socket is not open.');
      }
    }

    function getoffline(doc_id: string, offlineend: number) {
      request.get(`/ctg-exams-data/${doc_id}`).then(responseData => {
        let vt = doc_id.split('_');
        let dbid = vt[0] + '-' + vt[1];
        console.log(doc_id, offlineend, responseData, datacache.get(dbid).past);
        initfhrdata(responseData, datacache.get(dbid), offlineend);
        //datacache.get(dbid).start = 0;
      })
    }

    function initfhrdata(data, datacache, offindex) {
      Object.keys(data).forEach(key => {
        let oridata = data[key] as string;
        if (!oridata) {
          return;
        }
        for (let i = 0; i < offindex; i++) {
          let hexBits = oridata.substring(0, 2);
          let data_to_push = parseInt(hexBits, 16);
          if (key == 'fhr1') {
            datacache.fhr[0][i] = data_to_push;
          } else if (key == 'fhr2') {
            datacache.fhr[1][i] = data_to_push;
          } else if (key == 'fhr3') {
            //datacache.fhr[2][i] = data_to_push;
          } else if (key == 'toco') {
            datacache.toco[i] = data_to_push;
          }
          oridata = oridata.substring(2, oridata.length);
        }
      });
    }

  };
}
