// /src/service/analysis_xic_service.js
/***
 * @Author          TangTao https://promiselee.cn/tao
 * @CreateTime      2019-9-20 16:22:19
 * @UpdateTime      2019-9-3 22:59:36
 * @Copyright       西湖大学 propro http://www.proteomics.pro/
 * @Archive         post 查询 xic 数据
 *
 */

import request from "../utils/request";
import tao from "../utils/common";

// 获取 xic 数据
export function get_analysis_xic(data = "") {
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

  // 请求 irt 库列表
  return request("/propro_server/analyse/dataList", {
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

// 删除 xic 数据
export function delete_analysis_xic(data = "") {
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

// 查询 xic 数据
export function query_analysis_xic(data = "") {
  // 读取最新的 token
  let token = tao.get_token();
  console.log(data);
  let { id = "", page_size = -1 } = data;
  id += "";
  if (-1 == token || "" == data || 0 >= id.length || 0 >= page_size) {
    // 不存在 token
    return "error";
  }

  let body_data = "";

  body_data += "overviewId" + "=" + id + "&";
  body_data += "pageSize" + "=" + page_size + "&";

  // 请求 irt 库列表
  return request("/propro_server/analyse/dataList", {
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
