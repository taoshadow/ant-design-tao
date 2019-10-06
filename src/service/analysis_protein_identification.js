// /src/service/analysis_protein_identification.js

/***
 * @Author              TangTao  https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime      2019-9-29 14:18:09
 * @UpdateTime      2019-9-27 11:03:18
 * @Archive             查询 蛋白鉴定 数据
 */

import request from "../utils/request";
import tao from "../utils/common";

// 获取 蛋白鉴定 数据
export function get_analysis_protein_identification(data = "") {
  // 读取最新的 token
  let token = tao.get_token();

  let { id = "" } = data;
  id += "";
  if (-1 == token || "" == data || 0 >= id.length) {
    // 不存在 token
    return "error";
  }

  let body_data = "";

  body_data += "overviewId" + "=" + id + "&";

  // 查询蛋白鉴定结果 post请求
  return request("/propro_server/score/resultList", {
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

// 查询 score 数据
export function query_analysis_protein_identification(data = "") {
  // 读取最新的 token
  let token = tao.get_token();
  let { id = "", page_size = -1 } = data;
  id += "";
  if (-1 == token || "" == data || 0 >= id.length || 0 >= page_size) {
    // 不存在 token
    return "error";
  }

  let body_data = "";

  body_data += "overviewId" + "=" + id + "&";
  body_data += "pageSize" + "=" + page_size + "&";

  return request("/propro_server/score/resultList", {
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

// 删除 analysis 数据
export function delete_analysis_protein_identification(data = "") {
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
