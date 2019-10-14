import request from '@/utils/request';
import { stringify } from 'qs';
import { async } from 'q';

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
 * @param {*} params
 * @returns
 */
export async function newPregnancies(params) {
  return request.post(`/pregnancies`, {
    data: params,
  });
}

export async function getPregnancy(params) {
  return request.get(`/pregnancies?${stringify(params)}`);
}

/**
 * 胎监档案记录接口
 * @export
 * @returns
 */
export async function getCTGrecords(params) {
  return request.get(
    `/prenatal-visits?CTGExamId.specified=true&pregnancyId.specified=true${params ? '&' : ''}${stringify(
      params,
    )}`,
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
 * @param {*} params
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
 * 获取流
 * @param {*} params
 */
export async function getPDFflow(params) {
  // api/ctg-exams-pdfurl/190930222541
  return request.post(`/ctg-exams-pdf/${params.docid}`, {
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

export async function getBedIfo(note) {
  return request.get('/bedinfos');
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