export enum EStatus {
  Offline = 0,
  Online = 1,
  Working = 2,
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
  [Online]: '未工作',
  [Working]: '工作中',
  null:'未知'
};
