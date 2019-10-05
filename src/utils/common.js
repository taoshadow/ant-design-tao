// /src/utils/common.js
let tao = {};

/***
 * @Author              TangTao  https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-8-15 23:58:31
 * @UpdateTime          2019-10-6 01:15:18
 * @Archive             这是一个自定义类 针对Propro定制 集成了许多需要的方法 做了很多优化
 *                      切勿随意改变此界面源代码 因为有很多组件需要依赖它 否则存在潜在的隐患短时间不能觉察出来
 *
 */

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

/*****
 * @Author              TangTao  https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-10-5 23:58:56
 * @UpdateTime          2019-10-6 01:15:31
 * @Archive             tao_2099
 */
tao.tao_2099 = function(...all_arg) {
  // let tangtao = console;
  // tangtao.log(...all_arg);

  // 防止注入
  // 绑定console
  let _0x2b4f6 = console;

  let _0x1046 = ["bG9n"];
  (function(_0x2a3f08, _0x3cf43b) {
    let _0x497cb1 = function(_0x562707) {
      while (--_0x562707) {
        _0x2a3f08["push"](_0x2a3f08["shift"]());
      }
    };
    _0x497cb1(++_0x3cf43b);
  })(_0x1046, 0x94);
  let _0x371a = function(_0x2e941e, _0x1ee5d6) {
    _0x2e941e = _0x2e941e - 0x0;
    let _0x5ca3ea = _0x1046[_0x2e941e];
    if (_0x371a["lWbuhx"] === undefined) {
      (function() {
        let _0x3a0e75 = function() {
          let _0x34a800;
          try {
            _0x34a800 = Function(
              "return\x20(function()\x20" +
                "{}.constructor(\x22return\x20this\x22)(\x20)" +
                ");"
            )();
          } catch (_0x57fdbd) {
            // 重新绑定
            _0x34a800 = window;
          }
          return _0x34a800;
        };
        let _0x352b94 = _0x3a0e75();
        // 配置好字符串
        let _0x4ecbe6 =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        _0x352b94["atob"] ||
          (_0x352b94["atob"] = function(_0x8686f4) {
            let _0x326003 = String(_0x8686f4)["replace"](/=+$/, "");
            for (
              let _0x1e88fc = 0x0,
                _0x59100f,
                _0x3cfda4,
                _0x46a746 = 0x0,
                _0x3edabb = "";
              (_0x3cfda4 = _0x326003["charAt"](_0x46a746++));
              ~_0x3cfda4 &&
              ((_0x59100f =
                _0x1e88fc % 0x4 ? _0x59100f * 0x40 + _0x3cfda4 : _0x3cfda4),
              _0x1e88fc++ % 0x4)
                ? (_0x3edabb += String["fromCharCode"](
                    0xff & (_0x59100f >> ((-0x2 * _0x1e88fc) & 0x6))
                  ))
                : 0x0
            ) {
              _0x3cfda4 = _0x4ecbe6["indexOf"](_0x3cfda4);
            }
            return _0x3edabb;
          });
      })();

      _0x371a["ZRijCE"] = function(_0x1bf81a) {
        let _0x397a13 = atob(_0x1bf81a);
        let _0x117d40 = [];
        for (
          let _0x491192 = 0x0, _0x473deb = _0x397a13["length"];
          _0x491192 < _0x473deb;
          _0x491192++
        ) {
          _0x117d40 +=
            "%" +
            ("00" + _0x397a13["charCodeAt"](_0x491192)["toString"](0x10))[
              "slice"
            ](-0x2);
        }
        // 解码
        return decodeURIComponent(_0x117d40);
      };
      _0x371a["pMJhHO"] = {};
      _0x371a["lWbuhx"] = !![];
    }

    let _0x2488ee = _0x371a["pMJhHO"][_0x2e941e];

    if (_0x2488ee === undefined) {
      _0x5ca3ea = _0x371a["ZRijCE"](_0x5ca3ea);
      _0x371a["pMJhHO"][_0x2e941e] = _0x5ca3ea;
    } else {
      _0x5ca3ea = _0x2488ee;
    }
    return _0x5ca3ea;
  };
  // call
  _0x2b4f6[_0x371a("0x0")](...all_arg);
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
 * @Author              TangTao  https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
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

  // 这是一种遍历速度很慢的方式 可以考虑优化
  for (let i in result_arr) {
    date_format = date_format.replace(formate_arr[i], result_arr[i]);
  }

  return date_format;
};

tao.format_pro = () => {
  // 加密配置

  let [title, css] = [null, null];
  let propro_logo = "           ";
  let propro_logo_css =
    "font-size:100px;background:url('http://cdn.promiselee.cn/share_static/files/propro/propro-logo-hori-300.png') no-repeat;";

  let arr = [
    // 标题
    "西湖大学 蛋白质组学 Propro",
    // 中间加个空格
    " ",
    // logo 图片
    propro_logo,
    // 时间戳转换时间
    "\n" + new Date(Date.now()),
    // 介绍内容 key-value
    "\nPROPRO官网: http://www.proteomics.pro/",
    "蛋白质组学分析平台: http://www.propro.club",
    "Gitee: https://gitee.com/ProproStudio",
    "Email: propro@westlake.edu.cn",
    // 最后一个定位版权
    "\n2019 © 西湖大学 PROPRO All Rights Reserved."
  ];
  // 设置字体
  let font_family_css =
    "font-family:STKaiti,STFangsong,STSong, KaiTi,'宋体',serif,'sans-serif';";
  // 对应标题样式
  let title_css =
    "font-size:30px;font-weight:700;color:#007bff;" + font_family_css;
  // 对应时间样式
  let time_css =
    "font-size:20px;font-style:italic;color:#495057;" + font_family_css;
  // 声明版权 tangtao https://www.promiselee.cn/tao
  let copyright_css =
    "font-size:22px;font-style:italic;color:#fcc100;" + font_family_css;
  // 通用css 样式
  css = "font-size:22px;font-style:italic;color:#007bff;" + font_family_css;
  // 遍历
  let { length: len0 } = arr;
  let args = "";
  for (let i = 0; i < len0; i++) {
    args += "%c" + arr[i] + "\n";
  }

  tao.tao_2099(
    args,
    title_css,
    // 标题 与 log设置间距
    css,
    // 输出logo
    propro_logo_css,
    // 时间
    time_css,
    // 通用
    css,
    css,
    css,
    css,
    // 最后一个定位版权
    copyright_css
  );
  //
};

tao.format_pro();

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

/***
 * @Author              TangTao  https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-8-15 23:58:31
 * @UpdateTime          2019-8-16 00:04:27
 * @Archive
 */
