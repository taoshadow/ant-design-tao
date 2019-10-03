// /src/service/public_irt_standard_library.js

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
export function get_public_irt_standard_library_list(data = "") {
  // 读取最新的 token
  let token = tao.get_token();

  if (-1 == token) {
    // 不存在 token
    return "error";
  }

  // 请求 public_irt 库列表
  return request("/propro_server/library/listPublicIrt", {
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
