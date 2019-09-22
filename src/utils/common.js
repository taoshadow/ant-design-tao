let tao = {};
/***
 * 计算字符串存储长度
 */
tao.strlen = function(str) {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    // 单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      len++;
    } else {
      len += 2;
    }
  }
  return len;
};

// 截取字符串指定的不超出的存储长度
tao.substr = function(str, num) {
  let str1 = "";
  let len = 0;
  let j = 0;
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      // 单字节加1
      j = 1;
    } else {
      // 双字节
      j = 2;
    }

    //   当且仅当 加上这个字符的长度小于指定的长度 才会添加
    if (len + j <= num) {
      str1 += str[i];
      len += j;
    } else {
      break;
    }
  }
  return str1;
};

// 一般情况下使用
tao.consolelog = function() {
  let len = arguments.length;
  for (let i = 0; i < len; i++) {
    console.log(arguments[i]);
  }
};

// 开发模式 这个函数 与 consolelog 不一样
// 主要用在开发模式 方便后续发布屏蔽
tao.dev_consolelog = function() {
  let len = arguments.length;
  for (let i = 0; i < len; i++) {
    console.log(arguments[i]);
  }
};

/***
 * 负责读取 token
 * 符合条件：
 * 1 token 长度大于 15
 * 2 在有效期内
 * return 成功 token 失败 -1
 */
tao.get_token = () => {
  // token 真正过期时间
  const live_token = 4 * 3600 * 1000;
  // 获取 token
  let time = "" + localStorage.getItem("propro_token_time");

  let token = "" + window.localStorage.getItem("propro_token");
  if (15 < token.length) {
    if (parseInt(time) + live_token > new Date().getTime()) {
      return token;
    }
  }

  return -1;
};

/***
 * @Author              TangTao https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @CreateTime          2019-8-15 23:58:31
 * @UpdateTime          2019-8-16 00:04:27
 * @Archive             时间戳(13位) 转换为 指定的自定义日期格式 比如 (timestamp,'Y-M-D h:m:s')
 */

tao.format_time = function(timestamp = 0, date_format = "Y-M-D h:m:s") {
  let formate_arr = ["Y", "M", "D", "h", "m", "s"];
  let result_arr = [];
  let date = new Date(timestamp);

  result_arr.push(date.getFullYear());
  result_arr.push(tao.format_number(date.getMonth() + 1));
  result_arr.push(tao.format_number(date.getDate()));
  result_arr.push(tao.format_number(date.getHours()));
  result_arr.push(tao.format_number(date.getMinutes()));
  result_arr.push(tao.format_number(date.getSeconds()));

  for (let i in result_arr) {
    date_format = date_format.replace(formate_arr[i], result_arr[i]);
  }

  return date_format;
};

//数据转化
tao.format_number = function(n) {
  n = n.toString();
  return n[1] ? n : "0" + n;
};

/***
 * @Author              TangTao https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @CreateTime          2019-9-11 13:43:41
 * @UpdateTime          2019-9-11 13:45:03
 * @Archive             输出格式化好的当前时间
 */
tao.current_format_time = function() {
  let current_date = new Date();
  let date =
    current_date.getFullYear() +
    "-" +
    sup(current_date.getMonth() + 1) +
    "-" +
    sup(current_date.getDate());
  let time =
    sup(current_date.getHours()) +
    ":" +
    sup(current_date.getMinutes()) +
    ":" +
    sup(current_date.getSeconds());
  function sup(n) {
    return n < 10 ? "0" + n : n;
  }
  let format_time = date + " " + time;
  return format_time;
};

export default tao;
