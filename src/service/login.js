// /src/service/login.js

import request from "../utils/request";
import tao from "../utils/common";

// json 对象转 formdata
// const formData = new FormData();
// Object.keys(params).forEach((key) => {
// formData.append(key, params[key]);
// });

// formData转JSON，代码如下：

// var jsonData = {};
// formData.forEach((value, key) => jsonData[key] = value);

let json2formdata = function(params) {
  let formData = new FormData();
  Object.keys(params).forEach(key => {
    formData.append(key, params[key]);
  });
  return formData;
};

// 更新 token
export function update_token(data = "") {
  // 读取最新的 token
  let token = tao.get_token();

  if (-1 == token) {
    // 不存在 token
    return "error";
  }
  return request("/propro_server/user/updateToken", {
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

export function login(data) {
  let params = "";
  let bodys = "";

  try {
    params = data.login;
    Object.keys(params).forEach(key => {
      bodys += key + "=" + params[key] + "&";
    });
  } catch (e) {
    return "error";
  }

  bodys = bodys.substr(0, bodys.length - 1);
  console.log("send bodys", bodys);
  return request("/propro_server/login/login", {
    headers: {
      // 'content-type': 'application/json',
      // "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    method: "POST",
    //   发送登录数据 注意 数据未加密
    body: bodys
  });
}

export function update_account_info(data) {
  let params = "";
  let bodys = "";

  try {
    params = data.account_info;
    Object.keys(params).forEach(key => {
      bodys += key + "=" + params[key] + "&";
    });
  } catch (e) {
    return "error";
  }

  bodys = bodys.substr(0, bodys.length - 1);
  console.log("send bodys", bodys);
  // 读取最新的 token
  let token = tao.get_token();

  if (-1 == token) {
    // 不存在 token
    return "error";
  }
  return request("/propro_server/user/updateInfo", {
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

export function update_account_password(data) {
  let params = "";
  let bodys = "";

  try {
    params = data.account_password;
    Object.keys(params).forEach(key => {
      bodys += key + "=" + params[key] + "&";
    });
  } catch (e) {
    return "error";
  }

  bodys = bodys.substr(0, bodys.length - 1);
  console.log("send bodys", bodys);
  // 读取最新的 token
  let token = tao.get_token();

  if (-1 == token) {
    // 不存在 token
    return "error";
  }
  return request("/propro_server/user/updatePassword", {
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
