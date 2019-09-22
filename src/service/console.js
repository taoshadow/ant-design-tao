// /src/service/console.js

import request from "../utils/request";
import tao from "../utils/common";

// 获取控制台资源列表
export function get_console_resource_list(data = "") {
  // 读取最新的 token
  let token = tao.get_token();

  if (-1 == token) {
    // 不存在 token
    return "error";
  }

  return request("/propro_server/console/resourceList", {
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
