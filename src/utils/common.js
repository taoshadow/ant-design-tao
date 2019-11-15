/*
 * @Author: TangTao https://www.promiselee.cn/tao
 * @Date: 2019-11-15 15:10:37
 * @Last Modified by: TangTao tangtao2099@outlook.com
 * @Last Modified time: 2019-11-15 15:13:54
 */
// /src/utils/common.js

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

tao.my_console = function(type, ...all_arg) {
    if ("log" == type) {
        console.log(...all_arg);
    } else if ("warn" == type) {
        console.warn(...all_arg);
    } else if ("error" == type) {
        console.error(...all_arg);
    } else {
        console.log(...all_arg);
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
                                _0x1e88fc % 0x4
                                    ? _0x59100f * 0x40 + _0x3cfda4
                                    : _0x3cfda4),
                            _0x1e88fc++ % 0x4)
                                ? (_0x3edabb += String["fromCharCode"](
                                      0xff &
                                          (_0x59100f >>
                                              ((-0x2 * _0x1e88fc) & 0x6))
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
                        ("00" +
                            _0x397a13["charCodeAt"](_0x491192)["toString"](
                                0x10
                            ))["slice"](-0x2);
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
// 主要用在开发模式 方便后续发布屏蔽 tangtao 2019-10-6 02:46:13
tao.dev_consolelog = function() {
    let len = arguments.length;
    for (let i = 0; i < len; i++) {
        console.log(arguments[i]);
    }
};

/***
 * tangtao https://www.promiselee.cn/tao
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

/***
 * @Author              TangTao  https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-10-5 22:11:55
 * @UpdateTime          2019-10-6 02:31:43
 * @Archive             格式化输出 propro
 */
tao.format_pro = () => {
    //  格式化输出 propro
    let _0x2cf9 = [
        "PCfCq1LDlRg4w6oFw5QDwpnCmcKEfynCucKxw5VnaEHDkcKfwpLCk8OSwqB/",
        "R8OzLSsAwo18wod8wprCvWPDvMO6ThbDpsKCNzTDkWTCp0zDo8KACiBlw4c7Gg==",
        "HCrCksKhFwR2ZSzCszrDmXrDgsKaWWZqM1fDscK4wp5zwrjDu1dIJkgyLMOawpPDtXDDri7DgMOVfsOzwrhRe0PCvVvDu8OlMBzDlMOX",
        "wqjCgMOkdEEwCMKhw6otw6TDrsO3R8OJwrHCksOYw4RZdw==",
        "6LST542e6IGTwr7ll63mt6vCiw7lnr/kuqnCkCEFwq4aw4DCsGPDhMOGWembrOaLt+S6oOW/lOWJseitluWnkeebn+a0nuijkeairuacoMKM6ZO45a6wdlbCjMK2EHDlvrTljpfDtA==",
        "5rG16Ya755aO5oiL5L+86aq555qH6YCt5ZKM5YS555GS5L+c5LqyAeeloeehqeactuafkOetquS8vOeXsueaneiajOealei2h+e4muWuhuWLouaft+W5vuWPgeaQvOS/neeVmOmfiUo=",
        "BCEHWGxWAg==",
        "LsO0w5UpYsOS",
        "wo7DpcOkWTcsbnbDpsOtw4k=",
        "wrpKJlw2NMKew63DogE9woEAwo5/wrMXKEnDrsKaIRxBQsOdw6rDocKKw5HDsXrDqAkGdcOpw7Ejw7jCoC/Cm8OxCsOKw7o2wqMPUTVJwqzDh8KQGcOow48oTB8bwqpewoXCpMOfw65BIirDhisewq3DtcKxGhEjwp0mwoJ8w6MUAsOjwqzDqynDqsOudGfDjsOOCcKgwqvDhQfCoCPCocONw63CkDh2F8OxM8OLW8KVKcKyCw==",
        "6KSe5rqi5aS55a63ZOiag+ebjei2uOe7ueWtpRPCqMKuGjHDlcK6",
        "wrJKPw==",
        "Z8KQTnVkPcKx5ayg57+Of3HDnsKpRnN6w4fChDlyPcOpchvChRRlNmzCvsKGwos3w5QVwrZu",
        "6Jqq55qJ6LS257iV5ayi5YmO5pyg5buj5Y+NORPCkMKoATHCncO6fcKEQsKxTkg9w5sVLEZIVHo8w5g=",
        "EzrCq0fDgxg3wq0Gw5cEw4TDk8OZPyPCucK2w5VuI0fCkMKRw5PDrMOUwq5gccKtw5FowoUWwrod",
        "wpHDucKKC8Ksw7LDl8OKHMK7HBYTDmHDj8KXU8KNw59cL8KufUTCiG7DpEI=",
        "JcK1aWpKwpfDusKI6KWk5rql5aeu5a2twqnDiDI6w5nCvVdgw7FmwqwYw5DChh4gcMOQdD81QMOZwodVRcO5w7U=",
        "w7w2w7pnIkHDvMK9w6RfT8OBwrjCu3tuw53CrcKZw4/DhcOfekTDoFHClMOKwp57w5AWw6nDqsKyEihRw6rDrWp8w7FKIMKQ5ayZ5L60wonCj8OGbcOKG2/DkMKbw5MewphwwrRAIMO2wrDCg1Nx",
        "wrrCjsOkZxgiDsOpwr8uw67CnsOiUsKTwr7CkcKYw5MbbcKAGsK5PsKHccKpEEhsUcOCwrA2Tn/DscOROMOmI8Orw6zChA==",
        "B8KbcMKlaTvDmcOqWDkBw4jCrA16w4HCujzChxjCtRRBI8ORXzddB1t/KsKBwonDmsOBwoPCmsO8VBDCpMOxwqfDm8OLSw==",
        "wrrCg8K1woQxT3tIfhzDm8KGw6vCh8Omw5LDkk7DvcOww4zDvsKDwrzDrMOxw6TDl0sGwpZ/wpxRFigJwp5fwoTCuV0ow63CtMOzwqg=",
        "Pw7CjmFGfMO5w4kDwozDsmzCqcKEwrjCi8ObwqocBcKAwrA1wqfDjcO1wqB1YglLCm1Ew4fCiMKxAkjDsQXDn8KTGQHDhiA=",
        "FcKVccKOdnjCicKp",
        "PsOcXXN8w7kY",
        "csK6wqB5TMKDw5hlQAEw",
        "w6UMwqXDvWfDlSrCrsOow6zDs0nCpcKwVghWwptqGUvCrsOCw5PCm1x7wo5cUCzCusKCfw3DrXgtwqTDtMO5O8KMfibDisKx",
        "w6cpw5PCq8KIJsOrw63DssOPw6DDuSrCqR7DnsKaDMKDYcKIQXHCgBd1w4XComzCt8OtK8KCw7XDhsO1YnjCmsKcEsO8wrk=",
        "J8O1w5UxfsKaw4bCp8Knw7/Cm8KhwpnCp3LDiMK/JcO6w53CucOfwpAlwozCjUXDli7DiMOhwqU7w5NaNMKWYcO8w6Yxw79Kw6zDgsKgwr8=",
        "wrbDsHMcXcKwwrl2wqDDi1FGw4AMasKoC8O6w67DpnbCj8OoQMOMw70tVQLDhsO3wpUNwpsBwooewrhUwq/DmMOwUnM8W8OAFHUZ"
    ];

    (function(_0x193454, _0x5c00af) {
        let _0x28e0fe = function(_0x4e942c) {
            while (--_0x4e942c) {
                _0x193454["push"](_0x193454["shift"]());
            }
        };
        _0x28e0fe(++_0x5c00af);
    })(_0x2cf9, 0x6e);
    let _0x5108 = function(_0xb67384, _0x27295a) {
        _0xb67384 = _0xb67384 - 0x0;
        let _0x156d7c = _0x2cf9[_0xb67384];
        if (_0x5108["hGOliN"] === undefined) {
            (function() {
                let _0x35aedc;
                try {
                    let _0xa9c080 = Function(
                        "return\x20(function()\x20" +
                            "{}.constructor(\x22return\x20this\x22)(\x20)" +
                            ");"
                    );
                    _0x35aedc = _0xa9c080();
                } catch (_0xfd277a) {
                    _0x35aedc = window;
                }
                let _0x2048b2 =
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
                _0x35aedc["atob"] ||
                    (_0x35aedc["atob"] = function(_0x39f824) {
                        let _0x23f64f = String(_0x39f824)["replace"](/=+$/, "");
                        for (
                            let _0x172f59 = 0x0,
                                _0x5489f2,
                                _0x2ca197,
                                _0x211fa3 = 0x0,
                                _0x3d0c7c = "";
                            (_0x2ca197 = _0x23f64f["charAt"](_0x211fa3++));
                            ~_0x2ca197 &&
                            ((_0x5489f2 =
                                _0x172f59 % 0x4
                                    ? _0x5489f2 * 0x40 + _0x2ca197
                                    : _0x2ca197),
                            _0x172f59++ % 0x4)
                                ? (_0x3d0c7c += String["fromCharCode"](
                                      0xff &
                                          (_0x5489f2 >>
                                              ((-0x2 * _0x172f59) & 0x6))
                                  ))
                                : 0x0
                        ) {
                            _0x2ca197 = _0x2048b2["indexOf"](_0x2ca197);
                        }
                        return _0x3d0c7c;
                    });
            })();
            let _0x1feb4e = function(_0x2722a3, _0x27295a) {
                let _0x5b96eb = [],
                    _0x86c128 = 0x0,
                    _0x3c58eb,
                    _0x1902b4 = "",
                    _0x462a03 = "";
                _0x2722a3 = atob(_0x2722a3);
                for (
                    let _0x576d89 = 0x0, _0x744bea = _0x2722a3["length"];
                    _0x576d89 < _0x744bea;
                    _0x576d89++
                ) {
                    _0x462a03 +=
                        "%" +
                        ("00" +
                            _0x2722a3["charCodeAt"](_0x576d89)["toString"](
                                0x10
                            ))["slice"](-0x2);
                }
                _0x2722a3 = decodeURIComponent(_0x462a03);
                let _0x1a36d8 = 0x0;
                for (; _0x1a36d8 < 0x100; _0x1a36d8++) {
                    _0x5b96eb[_0x1a36d8] = _0x1a36d8;
                }
                for (_0x1a36d8 = 0x0; _0x1a36d8 < 0x100; _0x1a36d8++) {
                    _0x86c128 =
                        (_0x86c128 +
                            _0x5b96eb[_0x1a36d8] +
                            _0x27295a["charCodeAt"](
                                _0x1a36d8 % _0x27295a["length"]
                            )) %
                        0x100;
                    _0x3c58eb = _0x5b96eb[_0x1a36d8];
                    _0x5b96eb[_0x1a36d8] = _0x5b96eb[_0x86c128];
                    _0x5b96eb[_0x86c128] = _0x3c58eb;
                }
                _0x1a36d8 = 0x0;
                _0x86c128 = 0x0;
                for (
                    let _0x137b6b = 0x0;
                    _0x137b6b < _0x2722a3["length"];
                    _0x137b6b++
                ) {
                    _0x1a36d8 = (_0x1a36d8 + 0x1) % 0x100;
                    _0x86c128 = (_0x86c128 + _0x5b96eb[_0x1a36d8]) % 0x100;
                    _0x3c58eb = _0x5b96eb[_0x1a36d8];
                    _0x5b96eb[_0x1a36d8] = _0x5b96eb[_0x86c128];
                    _0x5b96eb[_0x86c128] = _0x3c58eb;
                    _0x1902b4 += String["fromCharCode"](
                        _0x2722a3["charCodeAt"](_0x137b6b) ^
                            _0x5b96eb[
                                (_0x5b96eb[_0x1a36d8] + _0x5b96eb[_0x86c128]) %
                                    0x100
                            ]
                    );
                }
                return _0x1902b4;
            };
            _0x5108["qDPgzt"] = _0x1feb4e;
            _0x5108["ZhESbg"] = {};
            _0x5108["hGOliN"] = !![];
        }
        let _0x219534 = _0x5108["ZhESbg"][_0xb67384];
        if (_0x219534 === undefined) {
            if (_0x5108["kGSTkV"] === undefined) {
                _0x5108["kGSTkV"] = !![];
            }
            _0x156d7c = _0x5108["qDPgzt"](_0x156d7c, _0x27295a);
            _0x5108["ZhESbg"][_0xb67384] = _0x156d7c;
        } else {
            _0x156d7c = _0x219534;
        }
        return _0x156d7c;
    };
    window[_0x5108("0x0", "QWmx")] = {
        Author: _0x5108("0x1", "qukk"),
        Repository: _0x5108("0x2", "X(cN"),
        Authority1: _0x5108("0x3", "P@xK"),
        Authority2: _0x5108("0x4", "vT2j"),
        propro_repository: _0x5108("0x5", "e3)O"),
        Home: _0x5108("0x6", "qej5"),
        GitHub: _0x5108("0x7", "hDnc"),
        Zhihu: _0x5108("0x8", "P5Qv"),
        Email: _0x5108("0x9", "%xbg"),
        Statement: _0x5108("0xa", "6g1#") + _0x5108("0xb", "Hg@T")
    };
    let _0x3d5629 = window[_0x5108("0xc", "q%Ou")];
    window[_0x5108("0xd", "vT2j")] = _0x3d5629;
    let [_0x194fb0, _0x5077f3] = [null, null];
    let _0x5d90b3 = _0x5108("0xe", "ImLp");
    let _0x2baee7 = _0x5108("0xf", "#Mtz");
    let _0x49e844 = [
        _0x5108("0x10", "fuju"),
        "\x20",
        _0x5d90b3,
        "\x0a" + new Date(Date[_0x5108("0x11", "#Mtz")]()),
        _0x5108("0x12", "&UuN"),
        _0x5108("0x13", "fuju"),
        _0x5108("0x14", "qej5"),
        _0x5108("0x15", "a19L"),
        _0x5108("0x16", "hDnc")
    ];
    let _0x620ee9 = _0x5108("0x17", "gpEb");
    let _0x4e99a8 = _0x5108("0x18", "%xbg") + _0x620ee9;
    let _0x3b001e = _0x5108("0x19", "fuju") + _0x620ee9;
    let _0x574af6 = _0x5108("0x1a", "NI[T") + _0x620ee9;
    _0x5077f3 = _0x5108("0x1b", "0ZAx") + _0x620ee9;
    let { length: len0 } = _0x49e844;
    let _0x423a81 = "";
    for (let _0xaf70a6 = 0x0; _0xaf70a6 < len0; _0xaf70a6++) {
        _0x423a81 += "%c" + _0x49e844[_0xaf70a6] + "\x0a";
    }
    tao[_0x5108("0x1c", "fuju")](
        _0x423a81,
        _0x4e99a8,
        _0x5077f3,
        _0x2baee7,
        _0x3b001e,
        _0x5077f3,
        _0x5077f3,
        _0x5077f3,
        _0x5077f3,
        _0x574af6
    );

    //
    //
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

/*
 * @Author: TangTao https://www.promiselee.cn/tao
 * @Date: 2019-11-15 15:10:37
 * @Last Modified by:   TangTao tangtao2099@outlook.com
 * @Last Modified time: 2019-11-15 15:10:37
 * @archive 兼容性 bolb 切片
 */
// 文件切片方法
tao.slice_file = (blob, start_byte, end_byte) => {
    //
    if (blob.slice) {
        return blob.slice(start_byte, end_byte);
    }
    // 兼容firefox
    if (blob.mozSlice) {
        return blob.mozSlice(start_byte, end_byte);
    }
    // 兼容webkit
    if (blob.webkitSlice) {
        return blob.webkitSlice(start_byte, end_byte);
    }
    tao.my_console(
        "error",
        "tangtao：你的浏览器不支持分片操作,请更新或者更换浏览器"
    );
    return null;
};

export default tao;

/***
 * @Author              TangTao  https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-8-15 23:58:31
 * @UpdateTime          2019-10-6 02:46:52
 * @Archive
 */
