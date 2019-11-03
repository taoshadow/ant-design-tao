// /src/service/project_portion_selector.js

/***
 * @Author              TangTao  https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-11-3 18:32:46
 * @UpdateTime          2019-10-26 20:13:20
 * @Archive             项目 提取数据
 */

import request from "../utils/request";
import tao from "../utils/common";

// 获取
export function get_project_portion_selector(data = "") {
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
  return request("/propro_server/project/extractor", {
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

// 提取数据
export function project_portion_selector_calculate(data = "") {
  // 读取最新的 token
  let token = tao.get_token();
  let {
    id,
    mz,
    sigma,
    spacing,
    library_id,
    irt_library_id,
    note,
    rt,
    shape,
    shape_weight,
    fdr,
    score_types = []
  } = data;

  // 全部转换为字符串
  (id += ""),
    (mz += ""),
    (sigma += ""),
    (spacing += ""),
    (library_id += ""),
    (irt_library_id += ""),
    (note += ""),
    (rt += ""),
    (shape += ""),
    (shape_weight += ""),
    (fdr += "");

  if (
    -1 == token ||
    3 > id.length ||
    1 > mz.length ||
    1 > sigma.length ||
    1 > spacing.length ||
    3 > library_id.length ||
    1 > irt_library_id.length ||
    1 > rt.length ||
    1 > shape.length ||
    1 > shape_weight.length ||
    1 > fdr.length
  ) {
    // 不存在 token
    return "error";
  }

  // 解析数值
  rt = parseFloat(rt);
  mz = parseFloat(mz);
  fdr = parseFloat(fdr);
  sigma = parseFloat(sigma);
  spacing = parseFloat(spacing);
  shape = parseFloat(shape);
  shape_weight = parseFloat(shape_weight);

  let body_data = "";
  body_data += "id" + "=" + id + "&";
  body_data += "libraryId" + "=" + library_id + "&";
  body_data += "iRtLibraryId" + "=" + irt_library_id + "&";
  body_data += "rtExtractWindow" + "=" + rt + "&";
  body_data += "mzExtractWindow" + "=" + mz + "&";
  body_data += "fdr" + "=" + fdr + "&";
  body_data += "sigma" + "=" + sigma + "&";
  body_data += "spacing" + "=" + spacing + "&";
  body_data += "shapeScoreThreshold" + "=" + shape + "&";
  body_data += "shapeWeightScoreThreshold" + "=" + shape_weight + "&";

  if (0 < note.length) {
    body_data += "note" + "=" + note + "&";
  }

  let { length: len0 } = score_types;
  if (0 < len0) {
    for (let i = 0; i < len0; i++) {
      body_data += `${score_types[i]}=on&`;
    }
  }

  /*
  id
  iRtLibraryId
  libraryId
  rtExtractWindow
  mzExtractWindow
  note
  fdr
  sigma
  spacing
  shapeScoreThreshold
  shapeWeightScoreThreshold
  */
  // 请求 实验数据 列表
  return request("/propro_server/project/doextract", {
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
