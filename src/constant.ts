export enum EStatus {
  Offline = 0,
  Working = 1,
  Online = 2,
}
const { Offline, Online, Working } = EStatus;
export const mapStatusToColor = {
  [Offline]: '#f4511e',
  [Online]: '#bdbdbd ',
  [Working]: '#43a047',
  null:'black'

};
export const mapStatusToText = {
  [Offline]: '离线',
  [Online]: '停止',
  [Working]: '监护中',
  null:'未知'
};
