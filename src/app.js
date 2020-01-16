import { ipcRenderer } from 'electron';
ipcRenderer.send('ready')
export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.log('app', err);
    },
  },
};