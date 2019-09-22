// /src/service/public_library.js

import request from "../utils/request";
import tao from "../utils/common";

// 更新 token
export function get_public_standard_library_list(data = "") {
  // 读取最新的 token
  let token = tao.get_token();

  if (-1 == token) {
    // 不存在 token
    return "error";
  }

  // 请求 listPublic 库列表
  return request("/propro_server/library/listPublic", {
    headers: {
      // 'content-type': 'application/json',
      // "X-Requested-With": "XMLHttpRequest",
      token: token,
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    method: "POST"
    //   发送登录数据 注意 数据未加密
    // body: ''
  });
}

// 设置标准库 公开  tangtao
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
