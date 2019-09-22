// import fetch from 'dva/fetch';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  // 出错 处理
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 * @Author          TangTao
 * @CreateTime      2019-8-3 01:09:06
 * @param           {string} url       请求的地址
 * @param           {object} [options] 包含了 body header 等信息
 * @return          {object}           数据 错误等信息
 */
export default async function request(url, options) {
  // url 目标 会被转发
  const response = await fetch(url, options);
  // 检查状态
  try {
    checkStatus(response);
  } catch (e) {
    // 开发模式 测试使用
    // console.log(e);
  }
  return await response.json();
}
