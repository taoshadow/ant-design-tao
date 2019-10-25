// /src/service/project_extractor.js

/***
 * @Author              TangTao  https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-10-25 10:21:52
 * @UpdateTime          2019-10-23 13:32:38
 * @Archive             项目 计算irt
 */

import request from "../utils/request";
import tao from "../utils/common";

// 获取
export function get_project_extractor(data = "") {
  // 读取最新的 token
  let token = tao.get_token();
  let { id = "" } = data;

  id += "";

  if (-1 == token || "" == id || 3 > id.length) {
    // 不存在 token
    return "error";
  }

  let body_data = "";

  body_data += "id" + "=" + id + "&";

  // 请求 实验数据 列表
  return request("/propro_server/project/irt", {
    headers: {
      // 'content-type': 'application/json',
      // "X-Requested-With": "XMLHttpRequest",
      token: token,
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    method: "POST",
    //   发送登录数据 注意 数据未加密
    body: body_data
  });
}

// 计算 irt
export function project_extractor_calculate(data = "") {
  // 读取最新的 token
  let token = tao.get_token();
  let { id = "", mz, sigma, spacing, irt_library_id } = data;
  console.log(data);

  id += "";
  mz += "";
  sigma += "";
  spacing += "";
  irt_library_id += "";

  if (
    -1 == token ||
    3 > id.length ||
    1 > mz.length ||
    1 > sigma.length ||
    1 > spacing.length ||
    1 > irt_library_id.length
  ) {
    // 不存在 token
    return "error";
  }

  let body_data = "";

  body_data += "id" + "=" + id + "&";
  body_data += "sigma" + "=" + sigma + "&";
  body_data += "spacing" + "=" + spacing + "&";
  body_data += "mzExtractWindow" + "=" + mz + "&";
  body_data += "iRtLibraryId" + "=" + irt_library_id + "&";

  console.log(body_data);
  // 请求 实验数据 列表
  return request("/propro_server/project/doirt", {
    headers: {
      // 'content-type': 'application/json',
      // "X-Requested-With": "XMLHttpRequest",
      token: token,
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    method: "POST",
    //   发送登录数据 注意 数据未加密
    body: body_data
  });
}
