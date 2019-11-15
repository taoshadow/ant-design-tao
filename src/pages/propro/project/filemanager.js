/*
 * @Author: TangTao https://www.promiselee.cn/tao
 * @Date: 2019-11-13 13:59:51
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-10-18 10:25:07
 * @Archive             项目数据列表
 * @Last Modified by: TangTao tangtao2099@outlook.com
 * @Last Modified time: 2019-11-16 00:03:14
 */

// src/pages/propro/project/filemanager.js
// filemanager 项目 列表

/***

 */

/****************  导入组件 ***************************/
/****************  导入组件 ***************************/
/****************  导入组件 ***************************/

import { connect } from "dva";
import Link from "umi/link";
import { FormattedHTMLMessage } from "react-intl";
import { Fragment } from "react";

import {
    Layout,
    Menu,
    Icon,
    Switch,
    Breadcrumb,
    Row,
    Col,
    Drawer,
    Button,
    Dropdown,
    Select,
    Popconfirm,
    message,
    notification,
    Tabs,
    Input,
    Modal,
    Tooltip,
    Table,
    Divider,
    Tag,
    Upload,
    BackTop
} from "antd";

const { Dragger } = Upload;

import Highlighter from "react-highlight-words";

import tao from "../../../utils/common";
/****************  导入组件 end ***************************/

/****************  导入国际化语言 ***************************/
/****************  导入国际化语言 ***************************/
//   引入自定义的语言文件 js 格式
import messages_zh from "../../../locale/zh_CN";
import messages_en from "../../../locale/en_US";

const Languages = {
    zh: messages_zh,
    en: messages_en
};

/****************  导入国际化语言 end ***************************/

/****************  导入 styles ***************************/
/****************  导入 styles ***************************/
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../style/dashboard/console.less";
import "../../../layout/Common.css";

import scanning_svg from "../style/static/project/scanning.svg";
import upload_svg from "../style/static/project/upload.svg";
import result_svg from "../style/static/project/result.svg";
import file_svg from "../style/static/project/file.svg";
import delete_svg from "../style/static/project/delete.svg";
import modify_svg from "../style/static/experiment/modify.svg";
import chart_svg from "../style/static/experiment/chart.svg";
import process_svg from "../style/static/experiment/process.svg";
import arrow_up_svg from "../style/static/analysis/arrow_up.svg";
import return_svg from "../style/static/dashboard/return.svg";
import preloader_svg from "../style/static/dashboard/preloader.svg";

/****************  导入 styles end ***************************/

/***********  project View 初始化   ***************/
/***********  project View 初始化   ***************/

const project_state_to_props = state => {
    // 发送的对象
    let obj = {};

    // 先从 models 里读取 是否显示登录  当前语言
    const language = state["language"].language;
    if ("undefined" != typeof language) {
        obj.language = language;
    }

    let {
        project_filemanager_status = -1,
        project_filemanager_time = 0,
        project_filemanager_data = {},
        project_filemanager_delete_status = -1,
        project_filemanager_delete_time = 0,
        project_filemanager_delete_data = {},
        project_filemanager_scanning_update_status = -1,
        project_filemanager_scanning_update_time = 0,
        project_filemanager_scanning_update_data = {}
    } = state["project_filemanager"];

    (obj.project_filemanager_scanning_update_status = project_filemanager_scanning_update_status),
        (obj.project_filemanager_scanning_update_time = project_filemanager_scanning_update_time),
        (obj.project_filemanager_scanning_update_data = project_filemanager_scanning_update_data),
        (obj.project_filemanager_delete_status = project_filemanager_delete_status),
        (obj.project_filemanager_delete_time = project_filemanager_delete_time),
        (obj.project_filemanager_delete_data = project_filemanager_delete_data),
        (obj.project_filemanager_status = project_filemanager_status),
        (obj.project_filemanager_time = project_filemanager_time),
        (obj.project_filemanager_data = project_filemanager_data);

    return obj;
};

const project_dispatch_to_props = dispatch => {
    return {
        // 更新触发器
        get_project_filemanager: (data = null) => {
            const action = {
                type: "project_filemanager/get_project_filemanager",
                payload: data
            };
            dispatch(action);
        },
        send_json_file: (data = null) => {
            const action = {
                type: "project_filemanager/send_json_file",
                payload: data
            };
            dispatch(action);
        },
        set_state_newvalue: data => {
            const action = {
                type: "project_filemanager/set_state_newvalue",
                payload: data
            };
            dispatch(action);
        }
    };
};

/***********  project View 初始化 end  ***************/

@connect(project_state_to_props, project_dispatch_to_props)
class Project_filemanager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //   查询到的标准库数据
            project_filemanager_data: [],
            // 默认没有数据 状态为 -1 这个变量 暂时用不着 但是后续扩展会用到
            project_filemanager_status: -1,
            // 请求失败再次发起请求的尝试次数
            project_filemanager_false_time: 5,
            project_filemanager_project_name: "",
            search_text: "",
            project_filemanager_table_columns: null,
            // modal 配置
            modal_visible: false,
            drawer_visible: false,
            drawer_data: null,
            delete_project_filemanager_id: null,
            analyse_overview_do_map: null,
            project_filemanager_file_list_all: [],
            project_filemanager_file_list_json: [],
            project_filemanager_file_list_aird: [],
            // 这里保存定时器的注册信息
            project_filemanager_send_aird_clock: null,
            project_filemanager_send_json_clock: null,

            // aird json 文件上传的文件缓存列表
            aird_or_json_file_list: []

            //   language: this.props.language
        };

        // 查询 project_filemanager 列表
        setTimeout(() => {
            // 默认获取全部
            this.query_project_filemanager();
        }, 100);

        // 配置 message
        message.config({
            top: 500,
            duration: 2,
            maxCount: 5,
            getContainer: () => document.body
        });

        notification.config({
            placement: "topRight",
            duration: 4.5
        });
    }

    // 查询 project_filemanager 列表
    query_project_filemanager = () => {
        let url = this.props.history.location.pathname;
        let obj = {};
        /****************************/
        let find_str = "/filemanager/";
        let index = url.lastIndexOf(find_str);
        // 取到的是项目名称
        let project_name = url.substring(index + find_str.length);
        if (3 < index) {
            // 找到 project_name 发起查询
            obj.project_name = project_name;
            // 存入state
            setTimeout(() => {
                this.setState({
                    project_filemanager_project_name: project_name
                });
            }, 50);
        }

        this.props.get_project_filemanager(obj);
    };

    refresh_data = () => {
        setTimeout(() => {
            // 显示加载界面
            this.setState({
                project_filemanager_status: -1
            });
            // 立即重新发起查询
            this.query_project_filemanager();
        }, 800);
    };

    change_project_filemanager_data = () => {
        console.log(this.props.project_filemanager_data);

        let {
            fileList: file_list = [],
            project = []
        } = this.props.project_filemanager_data;

        let { length: len1 } = file_list;
        let [file_list_all, file_list_json, file_list_aird] = [[], [], []];

        if (0 < len1) {
            file_list_all = new Array(len1);
            let obj_temp = {};
            for (let i = 0; i < len1; i++) {
                // 这里表面上没有做任何改变 但是为了后续扩展有很大的帮助
                // 因为这里写出来提取数据的思路
                let { name = "", size = "" } = file_list[i];
                obj_temp = { name, size };
                file_list_all[i] = obj_temp;
                // 检查是json还是aird 添加到不同的数组
                if (name.match(/.aird$/)) {
                    // 匹配到aird文件
                    file_list_aird.push(obj_temp);
                } else if (name.match(/.json$/)) {
                    file_list_json.push(obj_temp);
                } else {
                    // 没有 其他数据
                    tao.my_console("warn", "tangtao: 文件不是aird,json");
                }
            }
        }

        console.log("json", file_list_json);
        console.log("aird", file_list_aird);
        this.setState({
            // 标记 成功
            project_filemanager_false_time: 5,
            project_filemanager_query_time: tao.current_format_time(),
            project_filemanager_file_list_all: file_list_all,
            project_filemanager_file_list_json: file_list_json,
            project_filemanager_file_list_aird: file_list_aird,
            // 标记数据为可用的状态
            project_filemanager_status: 0
        });

        return 0;
    };

    /***************** operation  ****************/
    /***************** operation  ****************/
    /***************** operation  ****************/

    show_drawer_data = data => {
        // this.setState({
        //   drawer_data: drawer_data,
        //   drawer_visible: true
        // });
    };

    drawer_close = () => {
        // 关闭抽屉
        this.setState({
            drawer_visible: false
        });
    };

    /*************  handle  *********************/
    /*************  handle  *********************/
    /*************  handle  *********************/

    handle_project_filemanager = () => {
        // 时间戳设置为 0
        this.props.set_state_newvalue({
            target: "project_filemanager_time",
            value: 0
        });

        // 检查状态
        if (0 == this.props.project_filemanager_status) {
            // 数据获取成功
            setTimeout(() => {
                // 调用 添加更新数据函数
                this.change_project_filemanager_data();
            }, 200);
        } else {
            // 数据获取失败
            // 1-弹出警告
            setTimeout(() => {
                Modal.error({
                    title: "False",
                    content:
                        Languages[this.props.language]["propro.network_error"],
                    okText:
                        Languages[this.props.language]["propro.user_modal_know"]
                });
            }, 40);
            // 过一段时间 尝试再次连接服务器 这个时间要稍微长一点 用户体验会比较好
            let { project_filemanager_false_time } = this.state;
            // 2-判断是否需要再次发起请求
            if (0 >= project_filemanager_false_time) {
                tao.my_console(
                    "error",
                    "@Author:tangtao; 系统已终止运行,请重新刷新页面; ",
                    "初步诊断:未能成功连接到 propro-server 的服务器或者未能成功解析返回的数据"
                );
                // 终止发送
                return -1;
            }

            // 写入新的请求失败参数
            setTimeout(() => {
                this.setState({
                    project_filemanager_false_time: project_filemanager_false_time--
                });
            }, 120);

            return -1;
        }

        return 0;
    };

    // 调用 aird json文件上传接口
    upload_aird_or_json_file = () => {
        console.log("upload_aird_or_json_file");
        let { aird_or_json_file_list: file_list } = this.state;
        let reject_obj = {};
        let data_obj = {};
        // 第一步：首先获取文件 判断文件是否存在
        let before_upload = new Promise((resolve, reject) => {
            // 1 首先判断 file_list
            let { length } = file_list;
            (data_obj.file_list = file_list),
                (data_obj.file_list_length = length);

            if (0 < length) {
                // success
                resolve();
            } else {
                reject_obj = {
                    error: 1,
                    step: 1,
                    info: "tangtao : You did not add the uploaded file"
                };
                reject(reject_obj);
            }
        });
        before_upload
            .then(() => {
                // 上一步：文件已经存在
                // 下一步: 过滤文件，将文件分成 json 和 aird 文件，其他文件会忽略掉
                // 判断文件类型 但是这里很简单 只负责后缀名
                let [file_list_aird, file_list_json, res] = [[], [], -1];
                for (
                    let i = 0, obj_temp = null;
                    i < data_obj.file_list_length;
                    i++
                ) {
                    obj_temp = data_obj.file_list[i];
                    let { name } = obj_temp;
                    console.log(obj_temp, name);
                    if (name.match(/.aird$/)) {
                        // 匹配到aird文件
                        file_list_aird.push(obj_temp);
                        res++;
                    } else if (name.match(/.json$/)) {
                        file_list_json.push(obj_temp);
                        res++;
                    } else {
                        // 文件
                        tao.my_console(
                            "warn",
                            `tangtao: 文件${name} 不是aird,json;已被系统忽略`
                        );
                    }
                }

                if (0 > res) {
                    reject_obj = {
                        error: 2,
                        step: 2,
                        info: "tangtao : 没有 json 和 aird 文件"
                    };
                    return Promise.reject(reject_obj);
                }

                tao.file_list_aird = file_list_aird;
                tao.file_list_json = file_list_json;
                // 继续向下执行
            })
            .then(() => {
                // 上一步： 提取了 aird 和 json
                // 下一步：处理 json 文件
                console.log("处理json 文件");
                let { file_list_json: file_list = [] } = tao;
                let { length: len } = file_list;
                if (0 < len) {
                    // 检测到传入了 json 文件
                    // 调用发送json数据函数
                    // 只要一调用此函数 就尝试清空之前的定时器
                    let { project_filemanager_send_json_clock } = this.state;
                    try {
                        window.clearInterval(
                            project_filemanager_send_json_clock
                        );
                        this.setState({
                            // 因为json 不分片 所以才去 100 调用一次
                            project_filemanager_send_json_clock: window.setInterval(
                                () => {
                                    //
                                    this.send_json_file(file_list);
                                },
                                // 500ms 调用一次 也就是最快 500ms 上传一个文件
                                // 因为这样做可以减轻服务器的压力 和 浏览器的压力
                                500
                            ),
                            // 传入开始的索引
                            project_filemanager_send_json_upload_index: 0,
                            // 传入该索引的状态 0 已成功上传 -1 准备上传 1 已经正在上传
                            project_filemanager_send_json_upload_status: -1
                        });
                    } catch (e) {
                        tao.my_console("warn", "tangtao: ", e);
                    }
                } else {
                    return;
                }
            })
            .then(() => {
                // 上一步：处理 json 文件
                // 下一步：处理 aird 文件
                console.log("处理 aird 文件");
                let { file_list_aird: file_list = [] } = tao;
                let { length: len } = file_list;
                if (0 < len) {
                    // 检测到传入了 json 文件
                    // 调用发送json数据函数
                    this.send_aird_file(file_list);
                }
            })
            .catch(e => {
                // 捕获错误
                /*
                error: 错误码
                info : 错误提示信息 供调试参考
                */
                console.log("捕获错误", e);
            });
        console.log("end");
    };

    /***************  methods  ********************/
    /***************  methods  ********************/
    /***************  methods  ********************/
    check_file_exist_in_json = filename => {
        if (filename) {
        } else {
            return false;
        }

        for (
            let i = 0,
                { project_filemanager_file_list_json: file_list } = this.state,
                { length: len = -1 } = file_list;
            i < len;
            i++
        ) {
            if (filename == file_list[i]) {
                // 匹配成功
                return true;
            }
        }

        return false;
    };

    check_file_exist_in_aird = filename => {
        if (filename) {
        } else {
            return false;
        }

        for (
            let i = 0,
                { project_filemanager_file_list_aird: file_list } = this.state,
                { length: len = -1 } = file_list;
            i < len;
            i++
        ) {
            if (filename == file_list[i]) {
                // 匹配成功
                return true;
            }
        }

        return false;
    };

    /***
     * @archive 通过定时器定时不断地轮询 直至所有文件上传完成
     */
    send_json_file = file_list => {
        //
        console.log("send_json_file", file_list);
        let {
            project_filemanager_send_json_upload_index: file_index,
            project_filemanager_send_json_upload_status: file_status
        } = this.state;
        let { length: len = -1 } = file_list;
        if (file_index <= len - 1) {
            // 说明队列中还有数据
            if (-1 == file_status) {
            } else {
                // 不需要 可能系统正忙
                return -1;
            }
            let { project_filemanager_project_name: project_name } = this.state;
            let obj = {
                json_file: file_list[file_index],
                filename: file_list[file_index].name,
                // 项目名称 服务器根据这个来解析是谁
                project_name,
                // 当前的索引 服务器原样返回 共前端判断到第几个了
                file_index
            };
            // 标记 status 来锁住当前进程 不让他继续上传文件
            this.setState({
                project_filemanager_send_json_upload_status: 1
            });
            console.log("即将上传", file_index, file_list[file_index].name);
            setTimeout(() => {
                this.props.send_json_file(obj);
            }, 100);
        } else {
            // 超出了 或者值为 -1 默认设置为上传完成
            tao.consolelog("json 文件上传完成");
        }
    };

    send_aird_file = file_list => {
        //
        console.log("send_aird_file", file_list);

        let { length: len } = file_list;
        for (let i = 0; i < len; i++) {
            // 1 获取文件
            let file = file_list[i];
            // 2 根据文件名获取切片信息
            let { name = "" } = file;
            let target_json_name = name.replace(/.aird$/, ".json");
            let res = this.check_file_exist_in_json(target_json_name);
            if (res) {
                // 存在
            } else {
                // 不存在
                tao.consolelog(`文件${name}: 缺少 json 切片信息`);
                continue;
            }
            console.log(file.name, target_json_name);
            // 3 开始切片
        }

        //
        let blob_file = new Blob([file_list[0]]);

        let s = tao.slice_file(blob_file, 0, 55260953);
        console.log(blob_file, "s", s);
    };

    /**************************** render ****************************/
    /**************************** render ****************************/
    /**************************** render ****************************/
    /**************************** render ****************************/

    render() {
        // 监控 project_filemanager 数据变化
        if (10000 < this.props.project_filemanager_time) {
            // 资源有更新
            this.handle_project_filemanager();
        }

        if (0 != this.state.project_filemanager_status) {
            return (
                <Fragment>
                    <Row>
                        <Col
                            span={24}
                            style={{
                                textAlign: "center",
                                marginTop: "30px"
                            }}
                        >
                            <img src={preloader_svg} />
                        </Col>
                    </Row>
                </Fragment>
            );
        }

        let {
            drawer_data,
            drawer_visible,
            aird_or_json_file_list
        } = this.state;

        const aird_or_json_file_list_props = {
            onRemove: file => {
                // 删除
                console.log("删除 file");
                this.setState(state => {
                    // 找到即将删除的文件的索引号
                    const index = state.aird_or_json_file_list.indexOf(file);

                    const new_file_list = state.aird_or_json_file_list;
                    // 删除掉指定的文件
                    new_file_list.splice(index, 1);
                    // 传回新的文件列表
                    return {
                        aird_or_json_file_list: new_file_list
                    };
                });
            },
            beforeUpload: file => {
                console.log(
                    "before Upload file",
                    this.state.aird_or_json_file_list
                );
                // 添加新的文件
                this.setState(state => ({
                    aird_or_json_file_list: [
                        ...state.aird_or_json_file_list,
                        file
                    ]
                }));
                console.log("file is", this.state.aird_or_json_file_list);
                return false;
            },
            // 开启多文件
            multiple: true
        };

        return (
            <div>
                <div
                    style={{
                        fontSize: "20px",
                        marginBottom: "20px",
                        fontWeight: "600",
                        letterSpacing: "1px"
                    }}
                >
                    <Tooltip
                        placement="topLeft"
                        title={
                            <FormattedHTMLMessage id="propro.project_list_title" />
                        }
                    >
                        <Link to="/project/list">
                            <img
                                src={return_svg}
                                style={{
                                    height: "30px",
                                    cursor: "pointer"
                                }}
                            />
                        </Link>
                    </Tooltip>
                    <FormattedHTMLMessage id="propro.project_filemanager_title" />
                </div>

                {/* 提示用户 删除 警告信息 */}
                <Modal
                    title={
                        <b>
                            <FormattedHTMLMessage id="propro.modal_title" />
                        </b>
                    }
                    visible={this.state.modal_visible}
                    onOk={this.delete_project_filemanager_by_id_confirm}
                    onCancel={this.delete_project_filemanager_by_id_cancel}
                    maskClosable={true}
                    okText={<FormattedHTMLMessage id="propro.modal_confirm" />}
                    cancelText={
                        <FormattedHTMLMessage id="propro.modal_cancel" />
                    }
                >
                    <div className={styles.font_red_color}>
                        <FormattedHTMLMessage id="propro.project_filemanager_delete_warning" />
                    </div>
                </Modal>

                {true == drawer_visible && (
                    <Drawer
                        title={
                            <FormattedHTMLMessage id="propro.analysis_score_filemanager_data_detail" />
                        }
                        placement="left"
                        closable={true}
                        width={400}
                        style={{
                            wordWrap: "break-word",
                            wordBreak: "break-all",
                            minWidth: "585px",
                            maxWidth: "585px"
                        }}
                        onClose={this.drawer_close}
                        visible={drawer_visible}
                    >
                        {drawer_data}
                    </Drawer>
                )}

                <div
                    style={{
                        background: "#FFFFFF",
                        padding: "5px",
                        border: "1px solid #e5e9f2",
                        overflow: "auto"
                    }}
                >
                    {/* 文件上传入口 aird && json */}
                    <Upload.Dragger {...aird_or_json_file_list_props}>
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">
                            <FormattedHTMLMessage id="propro.standard_library_create_upload_file_description" />
                        </p>
                    </Upload.Dragger>
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        style={{
                            fontWeight: 400,
                            fontSize: "12px",
                            margin: "35px 5px",
                            height: "30px",
                            lineHeight: "20px",
                            padding: "5px 10px",
                            letterSpacing: "1px"
                        }}
                        // 暂时还未实现
                        onClick={this.upload_aird_or_json_file}
                    >
                        上传
                    </button>
                </div>
                {/* Author: Tangtao HDU https://www.promiselee.cn/tao */}
                <BackTop visibilityHeight={600}>
                    <div>
                        <img
                            style={{
                                width: "35px"
                            }}
                            src={arrow_up_svg}
                        />
                    </div>
                </BackTop>
            </div>
        );
    }
}

export default Project_filemanager;
