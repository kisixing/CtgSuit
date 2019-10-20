import request from '@/utils/request';
import { stringify } from 'qs';

/**
 * 验证账户登录
 * @returns {Promise<void>}
 */
export async function login(params) {
  return request.get(`/account`, {
    data: {
      ...params,
    },
  });
}

/**
 * 账户验证登录
 * @param {object} params {username, password}
 */
export async function authenticate(params) {
  return request.post(`/authenticate`, {
    data: params,
  });
}

/**
 * 获取账户信息
 */
export async function getAccount() {
  return request.get(`/account`);
}

/**
 *
 * 孕妇建档、绑定床号
 * @export
 * @param {*} params 新建参数
 * @returns
 */
export async function newPregnancies(params) {
  return request.post(`/pregnancies`, {
    data: params,
  });
}

/**
 * 获取孕册信息
 * @param {*} params 条件参数
 */
export async function getPregnancy(params) {
  return request.get(`/pregnancies?${stringify(params)}`);
}

/**
 * 胎监历史档案记录接口
 * @export
 * @returns
 */
export async function getCTGrecords(params) {
  // CTGExamId有ctg数据，pregnancyId有孕妇信息即已经绑定
  const string = stringify(params);
  return request.get(
    `/prenatal-visits?CTGExamId.specified=true&pregnancyId.specified=true${string ? '&' : ''}${string}`,
  );
}

export async function newCTGrecord(params) {
  return request.post(`/prenatal-visits`, {
    data: params,
  });
}

export async function updateCTGrecord(params) {
  return request.put(`/prenatal-visits`, {
    data: params,
  });
}

/**
 * 根据档案列表获取的胎儿监护图数据
 * @export
 * @param {*} params ctgexamid ctg曲线id
 * @returns
 */
export async function getCTGrecordData(params) {
  return request.get(`/ctg-exams-data/${params.ctgexamid}`);
}

/**
 * 更新胎监状态接口 - 可选择调用 根据档案的自增id直接更新档案信息，如停止时间、诊断结果等
 * @export
 * @param {*} params
 * @returns
 */
export async function updateCTGexams(params) {
  return request.put(`/ctg-exams`, {
    data: params,
  });
}

/**
 * 获取pdf二进制数据
 * @param {*} params docid
 */
export async function getPDFflow(params) {
  // api/ctg-exams-pdfurl/190930222541
  return request.post(`/ctg-exams-pdf`, {
    data: params,
  });
}

/**
 * 获取PDF文件
 * @param {*} note 档案号
 */
export async function getPDF(note) {
  return request.get(`/ctg-exams-pdfurl/${note}`);
}

/**
 * 获取床位设备信息
 * @export
 * @returns
 */
export async function getBedIfo(params) {
  return request.get(`/bedinfos?${stringify(params)}`);
}

/**
 * 获取孕册数据
 */
export async function getPregnancies(params) {
  return request.get(`/pregnancies?${stringify(params)}`);
}

/**
 * 更新孕册信息
 * @param {*} params
 */
export async function updatePregnancy(params) {
  return request.put(`/pregnancies`, {
    data: params
  });
}

/**
 * 停止监护室调用
 * @param {string} params 档案号
 */
export async function nosaveCTG(params) {
  return request.get(`/ctg-exams-nosaving/${params}`);
}
