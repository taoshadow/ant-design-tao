// /src/service/analysis_detail.js

import request from "../utils/request";
import tao from "../utils/common";

// 更新 token
export function get_analysis_detail(data = "") {
  console.log("data", data);
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
  return request("/propro_server/analyse/detail", {
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

// 设置标准库 公开2019-9-4 20:19:59  tangtao
export function set_library_public_by_id(data = "") {
  // 读取最新的 token
  let token = tao.get_token();

  let { id = "" } = data;

  if (-1 == token || "" == data || "" == id) {
    // 不存在 token
    return "error";
  }

  let bodys = "";
  bodys += "id" + "=" + id + "&";

  return request("/propro_server/library/setPublic", {
    headers: {
      // 'content-type': 'application/json',
      // "X-Requested-With": "XMLHttpRequest",
      token: token,
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    method: "POST",
    //   发送登录数据 注意 数据未加密
    body: bodys
  });
}
