export enum EStatus {
  Offline = 0,
  Online = 1,
  Working = 2,
}
const { Offline, Online, Working } = EStatus;
export const mapStatusToColor = {
  [Offline]: '#ff4d4f',
  [Online]: '#ccc',
  [Working]: '#5c6bc0',
};
