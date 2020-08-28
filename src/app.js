import { ipcRenderer } from 'electron';
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