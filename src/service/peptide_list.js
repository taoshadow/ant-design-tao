// /src/service/peptide_list.js

/***
 * @Author          TangTao https://www.promiselee.cn/tao
 * @CreateTime      2019-8-30 15:11:25
 * @UpdateTime      2019-8-30 17:16:37
 * @Copyright       西湖大学 propro TangTao http://www.proteomics.pro/
 * @Archive         肽段列表 server
 *
 */
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
export function query_peptide_list(data = "") {
  // 读取最新的 token
  let token = tao.get_token();
  let { id = "", page_size = 0, peptide_ref = "" } = data;
  peptide_ref += "";
  if (-1 == token || "" == data || "" == id) {
    // 不存在 token
    return "error";
  }

  let body_data = "";
  body_data += "libraryId" + "=" + id + "&";
  // 检验 肽段 ref 是否存在
  if (1 < peptide_ref.length) {
    // 存在ref 写入
    body_data += "peptideRef" + "=" + peptide_ref + "&";
  }
  // 检查 page_size 是否存在
  if (0 < page_size) {
    body_data += "pageSize" + "=" + page_size + "&";
  }

  return request("/propro_server/peptide/list", {
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
 * @CreateTime          2019-10-4 00:07:08
 * @UpdateTime          2019-10-4 00:09:11
 * @Archive
 */
