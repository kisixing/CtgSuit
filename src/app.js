import { ipcRenderer } from 'electron';
import settingStore from "@/utils/SettingStore";
const setting = settingStore.cache
window['obvue'] = {
  setting
}
ipcRenderer.send('ready')
ipcRenderer.send('appUpdate')
export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.log('app', err);
      ipcRenderer.send('catch', 'error', 'appOnError', err && err.toString && err.toString())
    },
  },
};