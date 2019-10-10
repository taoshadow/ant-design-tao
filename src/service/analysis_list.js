// /src/service/analysis_list.js

/***
 * @Author              TangTao  https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-10-4 00:07:08
 * @UpdateTime          2019-10-4 00:09:11
 * @Archive
 */

import request from "../utils/request";
import tao from "../utils/common";

// 更新 token
export function get_analysis_list(data = "") {
  // 读取最新的 token
  let token = tao.get_token();
  console.log(data);
  let { exp_id = "" } = data;

  if (-1 == token) {
    // 不存在 token
    return "error";
  }
  let body_data = "";

  if ("" != exp_id && 4 < exp_id.length) {
    body_data += "expId" + "=" + exp_id + "&";
  }

  // 请求 irt 库列表
  return request("/propro_server/analyse/list", {
    headers: {
      // 'content-type': 'application/json',
      // "X-Requested-With": "XMLHttpRequest",
      token: token,
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    method: "POST",
    //   发送查询参数 注意 数据未加密
    body: body_data
  });
}

// delete_analysis_list

// 删除 analysis 数据 create by tangtao at 2019-10-7 00:54:27
// https://www.promiselee.cn/tao
export function delete_analysis_list(data = "") {
  // 读取最新的 token
  let token = tao.get_token();

  let { id = "" } = data;
  id += "";
  if (-1 == token || "" == data || 0 >= id.length) {
    // 不存在 token
    return "error";
  }

  let body_data = "";

  body_data += "id" + "=" + id + "&";

  // 请求 irt 库列表
  return request("/propro_server/analyse/delete", {
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
