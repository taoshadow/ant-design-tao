// path : /src/models/login.js
/***
 * @Author          TangTao
 * @CreateTime      2019-8-3 14:35:56
 * @UpdateTime      2019-8-6 16:21:40
 * @Copyright       西湖大学 propro http://www.proteomics.pro/
 * @Archive         调用发送注册 登录 的业务逻辑
 *                  保存和维护的 token 信息 ，所有需要获取登录状态的界面都要从这里来获取
 *                  用户申请账户状态,申请完成后自动销毁
 *
 */

import * as login_service from "../service/login";
console.log("init models login.js");

// 备用 函数
const delay = millisecond => {
  return new Promise(resolve => {
    setTimeout(resolve, millisecond);
  });
};

// token 真正过期时间 默认 4 h  为了安全起见 最后减去一个尾数
const live_token = 4 * 3600 * 1000 - 10000;
// token 一个存活周期内更新次数 约等于 update_token_times - 1
const update_token_times = 15;

// 清空用户数据
let clear_user_info = e => {
  // 销毁 关键数据
  window.localStorage.removeItem("username");
  window.localStorage.removeItem("email");
  window.localStorage.removeItem("telephone");
  window.localStorage.removeItem("nick");
  window.localStorage.removeItem("organization");
  window.localStorage.removeItem("roles");
  window.localStorage.removeItem("propro_token");
  window.localStorage.removeItem("propro_token_time");
  // 清空定时器
  // 存在定时器 取消

  try {
    clearInterval(window.TOKEN_CLOCK);
  } catch (e) {
    // 发生错误 不需要处理
  }
};

// login_success_initialization
let login_success_initialization = e => {
  /********************** token 定时器  **********************/
  /********************** token 定时器  **********************/

  // 1 检查是否开启 token 定时器
  if (
    "undefined" != typeof window.TOKEN_CLOCK &&
    null != typeof window.TOKEN_CLOCK
  ) {
    // 存在定时器 取消
    try {
      clearInterval(window.TOKEN_CLOCK);
    } catch (e) {
      // 发生错误 不需要处理
    }
  }

  // 2 注册定时器 这个发起请求次数
  window.TOKEN_CLOCK = setInterval(function() {
    update_token();
    // parseInt(live_token / update_token_times)
  }, parseInt(live_token / update_token_times));

  /********************** token 定时器 end **********************/

  // 页面监控定时器  监控用户是否在操作界面
};

/*********************  更新 token  *****************************/
/*********************  更新 token  *****************************/

// token 更新只在当前文件管理
let update_token = e => {
  // 检查是否允许更新标记
  // 0 成功
  // -1 默默退出系统
  // -2 不更新
  let res = -1;

  // 检查过去 15 min 内用户有没有操作界面

  // 执行更新
  const token = "" + window.localStorage.getItem("propro_token");
  const time = "" + window.localStorage.getItem("propro_token_time");
  const { username } = window.localStorage;
  if (15 < token.length) {
    if (parseInt(time) + live_token > new Date().getTime()) {
      // 正常  注意 这里一定要写成上面这种条件判断 因为要考虑到 time 异常
      // 判断是否已经登录
      if ("" != username) {
        // 到这里 总共经过了 token 长度验证 , token 存活期验证 , 用户名验证
        // 前端允许执行登录初始化
        res = 0;
      }
      // pass
    }
  }

  // 更新条件判断
  if (-1 == res) {
    // 退出系统 用户可能察觉不到
    clear_user_info();
    return -1;
  } else if (-1 > res) {
    // 不更新
    return -2;
  } else if (0 == res) {
    // 执行更新
  } else {
    // impossible
    // 这里 else 实际上是一个非运算 除了上面的情况之外所有的情况
    return "error";
  }

  // 更新

  let result = login_service.update_token();

  //  解析返回结果
  result.then(function(value) {
    let obj = {};
    let error = -1;
    // 尝试解析
    try {
      // 尝试提取 服务端返回数据 error_1 与 error 区分
      let { status = "error_1", token = "" } = value;
      // status 提取失败
      error = "error_1" == status ? -1 : 0;
      obj.status = status;
      obj.token = "" + token;
    } catch (e) {
      //  不需要处理
      return -1;
    }

    if (0 == error && 0 == obj.status && 15 < obj.token.length) {
      // 正常情况 可以更新 token
      window.localStorage.propro_token = obj.token;
      window.localStorage.propro_token_time = new Date().getTime();
      // 成功更新 token
    } else {
      // token 更新异常
      return -1;
    }
  });

  return 0;
};

/*********************  更新 token end  *****************************/

//  开始执行
/********************** login model  执行 **********************/
/********************** login model  执行 **********************/
/********************** login model  执行 **********************/

// token 要保存在 localStorage
// 1 尝试从本地 读取 token
// 考虑到可能向今后与多台服务器发起通讯 会有多个 token
// 所以这里附带 propro 使得代码结构清晰
// 防止出错 强转 字符串
// 尝试读取用户数据
let {
  username = "",
  email = "",
  telephone = "",
  nick = "",
  organization = "",
  roles = ""
} = window.localStorage;
let token = "" + localStorage.getItem("propro_token");
let { length } = token;
// 长度不足 置空
if (15 > length) {
  token = "";
} else {
  // 从本地读取 token 最近的保存时间
  let time = "" + localStorage.getItem("propro_token_time");
  // 如果保存时间超过 30min 自动销毁 重新登录
  if (parseInt(time) + live_token > new Date().getTime()) {
    // 正常  注意 这里一定要写成上面这种条件判断 因为要考虑到 time 异常
    // 判断是否已经登录
    if ("" != username) {
      // 到这里 总共经过了 token 长度验证 , token 存活期验证 , 用户名验证
      // 前端允许执行登录初始化
      login_success_initialization();
    }
    // pass
  } else {
    // 销毁 关键数据
    clear_user_info();
  }
}

let login = {
  namespace: "login",
  state: {
    // 注册切换 默认显示 login
    login_show: true,
    // === 登录状态 ===
    // 处理时间 通过监控它 从而促使 react 更新状态
    login_time: 0,
    // 登录的 token
    login_token: token,
    // 登录的 状态  未登录 <0 (默认-1 -1 也是服务端检测用户名或密码不存在的返回值 用户退出登录也是 -1) , 登录 = 0 ,严重错误 error
    login_status: "" == token ? -1 : 0,

    // === 用户信息 ===
    username: username,
    // 这些不是关键信息 但是不存在 写入 null 这样不影响显示效果
    email: "" != email ? email : "null",
    telephone: "" != telephone ? telephone : "null",
    nick: "" != nick ? nick : "null",
    organization: "" != organization ? organization : "null",
    roles: "" != roles ? roles : "null",

    // === 更新用户信息 ===
    // 成功 0 失败 < 0
    update_info_status: 0,
    // 通过监控  update_info_time 知道是否执行更新了 0 表示没有更新
    update_info_time: 0,
    update_passwd_status: 0,
    update_passwd_time: 0
    // === 申请状态 ===
  },

  effects: {
    // 登录
    *doLogin({ payload }, sagaEffects) {
      const { call, put } = sagaEffects;
      let result = "";
      try {
        // 捕获异常
        result = yield call(login_service.login, payload);
      } catch (e) {
        result = "";
      }
      yield put({ type: "doLogin_result", payload: result });
    },
    *update_account_info({ payload }, sagaEffects) {
      // 遵循数据不可信原则 校验关键数据 username
      if (window.localStorage.username != payload.account_info.username) {
        // impossible
        return -1;
      }
      const { call, put } = sagaEffects;
      let result = "";
      try {
        // 捕获异常
        result = yield call(login_service.update_account_info, payload);
      } catch (e) {
        result = "";
      }
      yield put({
        type: "do_update_info_result",
        payload: result,
        account_info: payload.account_info
      });
      return 0;
    },
    *update_account_password({ payload }, sagaEffects) {
      const { call, put } = sagaEffects;
      let obj = payload.account_password;
      if ("" == obj.current_password || "" == obj.new_password) {
        // impossible
        return -1;
      }
      let result = "";
      try {
        // 捕获异常
        result = yield call(login_service.update_account_password, payload);
      } catch (e) {
        result = "";
      }
      yield put({
        type: "do_update_password_result",
        payload: result
      });
      return 0;
    }
    // 更新 token
    // ...
  },

  reducers: {
    changeLogin(state, { payload: login }) {
      return {
        // 更新语言配置
        login_show: login.login
      };
    },
    // 处理返回结果
    doLogin_result(state, { payload: result }) {
      // 处理逻辑
      let error = -1;
      // 登录不出错返回对象
      let obj = {};

      // 1 检查 result 是否为空 服务器未响应
      if ("" == result) {
        // 发生网络错误 比如 网络不可达
        let obj_err = {
          login_status: "error",
          login_show: state.login_show,
          login_time: new Date().getTime()
        };

        return obj_err;
      }

      try {
        // 尝试提取 服务端返回数据 error_1 与 error 区分
        let { status = "error_1", token = "" } = result;
        error = "error_1" == status ? -1 : 0;
        obj.status = status;
        obj.token = token;
      } catch (e) {
        // 转换出错
        error = -1;
      }

      // 2 再检查是否转换出错 服务器返回了数据
      if (-1 == error) {
        // 转换异常 严重错误 输出错误信息 不清空  localStorage
        let obj_err = {
          login_status: "error",
          login_show: state.login_show,
          login_time: new Date().getTime()
        };
        return obj_err;
      }

      // 3 登录返回结果处理
      if (0 == obj.status) {
        let {
          username = "",
          email = "",
          telephone = "",
          nick = "",
          organization = "",
          roles = ""
        } = result;

        // 判断是否为 ''
        email = "" != email && null != email ? email : "null";
        telephone = "" != telephone && null != telephone ? telephone : "null";
        nick = "" != nick && null != nick ? nick : "null";
        organization =
          "" != organization && null != organization ? organization : "null";
        roles = "" != roles && null != roles ? roles : "null";

        // 登录成功 额外工作 保存 token 到本地
        // 当用户在更新时 他的数据只是留在 model  如果失败可以通过 本地还原
        window.localStorage.propro_token = obj.token;
        window.localStorage.propro_token_time = new Date().getTime();
        window.localStorage.username = username;
        window.localStorage.email = email;
        window.localStorage.telephone = telephone;
        window.localStorage.nick = nick;
        window.localStorage.organization = organization;
        window.localStorage.roles = roles;

        // 注册 登录成功  调用成功初始化
        login_success_initialization();

        // 返回登录成功的结果
        return {
          login_status: obj.status,
          login_token: obj.token,
          login_show: state.login_show,
          login_time: new Date().getTime(),
          username: username,
          email: email,
          telephone: telephone,
          nick: nick,
          organization: organization,
          roles: roles
        };
      } else {
        // 返回登录失败的结果
        return {
          login_status: obj.status,
          login_token: obj.token,
          login_show: state.login_show,
          login_time: new Date().getTime()
        };
      }
    },
    // 执行退出操作
    doLogout(state) {
      console.log("正在清空 。。。。");
      // 调用清空数据
      clear_user_info();
      return {
        login_status: -1,
        login_token: "",
        login_show: state.login_show,
        login_time: 0,
        username: null,
        email: null,
        telephone: null,
        nick: null,
        organization: null,
        roles: null
      };
    },
    // 更新操作完成
    do_update_info_result(
      state,
      { payload: result, account_info: account_new_info }
    ) {
      // 返回用户所有信息
      let res_status = -1;
      if ("error" != result) {
        try {
          // 尝试提取 服务端返回数据 error_1 与 error 区分
          let { status = "error_1" } = result;
          // 如果提取到 status 那么就 把 status 返回
          res_status = "error_1" == status ? -1 : status;
        } catch (e) {
          // 转换出错
        }
      } else {
        // 这里本地出错
      }

      // 出错情况
      if (-1 == res_status) {
        // 回滚之前的数据
        return {
          update_info_status: res_status,
          login_status: state.login_status,
          username: window.localStorage.username,
          nick: window.localStorage.nick,
          email: window.localStorage.email,
          roles: state.roles,
          telephone: window.localStorage.telephone,
          organization: window.localStorage.organization,
          update_info_time: new Date().getTime()
        };
      } else {
        // 先检查是否成功
        if (0 == res_status) {
          // 成功就写入 localStorage
          (window.localStorage.username = account_new_info.username),
            (window.localStorage.nick = account_new_info.nick),
            (window.localStorage.email = account_new_info.email),
            (window.localStorage.telephone = account_new_info.telephone),
            (window.localStorage.organization = account_new_info.organization);
        }

        return {
          update_info_status: res_status,
          login_status: state.login_status,
          username: account_new_info.username,
          nick: account_new_info.nick,
          roles: state.roles,
          email: account_new_info.email,
          telephone: account_new_info.telephone,
          organization: account_new_info.organization,
          update_info_time: new Date().getTime()
        };
      }
    },

    do_update_password_result(state, { payload: result }) {
      // 返回用户所有信息
      let res_status = -1;
      if ("error" != result) {
        try {
          // 尝试提取 服务端返回数据 error_1 与 error 区分
          let { status = "error_1" } = result;
          // 如果提取到 status 那么就 把 status 返回
          res_status = "error_1" == status ? -1 : status;
        } catch (e) {
          // 转换出错
        }
      } else {
        // 这里本地出错
      }

      return {
        update_passwd_time: new Date().getTime(),
        login_status: state.login_status,
        username: state.username,
        nick: state.nick,
        email: state.email,
        roles: state.roles,
        telephone: state.telephone,
        organization: state.organization,
        update_passwd_status: res_status,
        update_info_status: state.update_info_status,
        update_info_time: state.update_info_time
      };
    },
    // 设置指定的state key = value
    set_state_newvalue(state, { payload: result }) {
      let obj = {};
      for (let i in state) {
        obj[i] = state[i];
      }
      try {
        obj[result.target] = result.value;
      } catch (e) {
        // pass
      }
      return obj;
    }

    //
  }
};
console.log("init models login.js end");

export default login;
