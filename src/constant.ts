export enum EStatus {
  Offline = 0,
  Online = 1,
  Working = 2,
}
const { Offline, Online, Working } = EStatus;
export const mapStatusToColor = {
  [Offline]: '#ff4d4f',
  [Online]: '#999 ',
  [Working]: '#5c6bc0',
};
export const mapStatusToText = {
  [Offline]: '离线',
  [Online]: '未工作',
  [Working]: '工作中',
};
