// /src/service/peptide_detail.js

/***
 * @Author              TangTao  https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-8-31 20:19:36
 * @UpdateTime          2019-8-30 17:16:37
 * @Archive             肽段列表详情 id  server
 */

import request from "../utils/request";
import tao from "../utils/common";

// 更新 token
export function query_peptide_detail(data = "") {
  // 读取最新的 token
  let token = tao.get_token();
  let { id = "" } = data;
  if (-1 == token || "" == data || "" == id) {
    // 不存在 token
    return "error";
  }

  let body_data = "";
  body_data += "id" + "=" + id + "&";

  return request("/propro_server/peptide/detail", {
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

/***
 * @Author              TangTao  https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-8-31 20:19:36
 * @UpdateTime          2019-8-30 17:16:37
 * @Archive             肽段列表详情 id  server
 */
