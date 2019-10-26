// src/pages/propro/project/modify.js
// modify 项目 列表

/***
 * @Author              TangTao https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-10-18 13:30:58
 * @UpdateTime          2019-10-23 09:53:50
 * @Archive             项目数据列表
 */

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
  Descriptions,
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
  BackTop
} from "antd";

import Highlighter from "react-highlight-words";

import tao from "../../../utils/common";

const { Option } = Select;
const { TextArea } = Input;
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
    project_modify_status = -1,
    project_modify_time = 0,
    project_modify_data = {},
    project_modify_update_status = -1,
    project_modify_update_time = 0,
    project_modify_update_data = {}
  } = state["project_modify"];

  (obj.project_modify_status = project_modify_status),
    (obj.project_modify_time = project_modify_time),
    (obj.project_modify_data = project_modify_data),
    (obj.project_modify_update_status = project_modify_update_status),
    (obj.project_modify_update_time = project_modify_update_time),
    (obj.project_modify_update_data = project_modify_update_data);

  return obj;
};

const project_dispatch_to_props = dispatch => {
  return {
    // 更新触发器
    get_project_modify: (data = null) => {
      const action = {
        type: "project_modify/get_project_modify",
        payload: data
      };
      dispatch(action);
    },
    // 更新触发器
    update_project_modify_data: (data = null) => {
      const action = {
        type: "project_modify/update_project_modify_data",
        payload: data
      };
      dispatch(action);
    },
    set_state_newvalue: data => {
      const action = {
        type: "project_modify/set_state_newvalue",
        payload: data
      };
      dispatch(action);
    }
  };
};

/***********  project View 初始化 end  ***************/

@connect(
  project_state_to_props,
  project_dispatch_to_props
)
class Project_modify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //   查询到的标准库数据
      project_modify_data: [],
      project_modify_id: null,
      // 默认没有数据 状态为 -1 这个变量 暂时用不着 但是后续扩展会用到
      project_modify_status: -1,
      // 请求失败再次发起请求的尝试次数
      project_modify_false_time: 5,
      project_modify_project_data: {},
      // modal 配置
      modal_visible: false,
      drawer_visible: false,
      drawer_data: null,
      // 实验类型
      project_data_experiment_type_select: "",
      // 默认irt校准库
      project_data_default_irt_library_select: "",
      project_data_default_irt_librarys_arr: [],
      // 默认标准库
      project_data_default_library_select: "",
      project_data_default_librarys_arr: [],
      project_data_description: ""
    };

    // 查询 project_modify 列表
    setTimeout(() => {
      // 默认获取全部
      this.query_project_modify();
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

  // 查询 project_modify 列表
  query_project_modify = () => {
    let url = this.props.history.location.pathname;
    let obj = {};
    /****************************/
    let find_str = "/modify/";
    let index = url.lastIndexOf(find_str);
    let id = url.substring(index + find_str.length);
    if (3 < index) {
      // 找到 id 发起查询
      obj.id = id;
      setTimeout(() => {
        this.setState({
          project_modify_id: id
        });
      }, 30);
    }

    this.props.get_project_modify(obj);
  };

  refresh_data = () => {
    setTimeout(() => {
      // 显示加载界面
      this.setState({
        project_modify_status: -1
      });
      // 立即重新发起查询
      this.query_project_modify();
    }, 800);
  };

  change_project_modify_data = () => {
    console.log(this.props.project_modify_data);

    /*
      iRtLibraries: (77) 
      iRtLibraryId: "5c6d2ec7dfdfdd2f947c6f39"
      libraries: (20) 
      libraryId: "5c9c2407dfdfdd356072c113"
      project: {createDate: 1562567897630, description: "", …}
      project:
        createDate: 1562567897630
        description: ""
        doPublic: false
        iRtLibraryId: "5c6d2ec7dfdfdd2f947c6f39"
        iRtLibraryName: "商业iRT"
        id: "5d22e4d9a1eaff5cabc0fa37"
        labels: []
        lastModifiedDate: 1562567897630
        libraryId: "5c9c2407dfdfdd356072c113"
        libraryName: "HYE-64var"
        name: "HYE110_6600_64_Var"
        ownerName: "lms"
        type: "DIA_SWATH"
    */

    let {
      project: project_data = {},
      iRtLibraries: irt_libraries,
      libraries
    } = this.props.project_modify_data;

    let {
      createDate: create_date = 0,
      description = "",
      doPublic: do_public = false,
      iRtLibraryId: irt_library_id = "",
      iRtLibraryName: irt_library_name = "",
      id = "",
      labels = [],
      lastModifiedDate: last_modified_date = 0,
      libraryId: library_id = "",
      libraryName: library_name = "",
      name = "",
      ownerName: owner_name = "",
      type = ""
    } = project_data;

    let obj = {};
    (obj.create_date = tao.format_time(create_date)),
      (obj.description = description),
      (obj.do_public = do_public),
      (obj.irt_library_id = irt_library_id),
      (obj.irt_library_name = irt_library_name),
      (obj.id = id),
      (obj.labels = labels),
      (obj.last_modified_date = tao.format_time(last_modified_date)),
      (obj.library_id = library_id),
      (obj.library_name = library_name),
      (obj.name = name),
      (obj.owner_name = owner_name),
      (obj.type = type);

    let { length: len0 } = irt_libraries;

    let default_irt_librarys_arr = null;
    if (0 < len0) {
      //
      default_irt_librarys_arr = new Array(len0);
      for (let i = 0; i < len0; i++) {
        let str = irt_libraries[i].name + " " + irt_libraries[i].id;
        default_irt_librarys_arr[i] = (
          <Option key={"default_irt_librarys_arr_" + i} value={str}>
            <span style={{ fontWeight: "500" }}>
              {i + 1} : {irt_libraries[i].name}&nbsp;
            </span>
            <span className={styles.font_green_color}>
              {irt_libraries[i].id}
            </span>
          </Option>
        );
      }
    }

    let { length: len1 } = libraries;

    let default_librarys_arr = null;
    if (0 < len1) {
      //
      default_librarys_arr = new Array(len1);
      for (let i = 0; i < len1; i++) {
        let str = libraries[i].name + " " + libraries[i].id;
        default_librarys_arr[i] = (
          <Option key={"default_librarys_arr_" + i} value={str}>
            <span style={{ fontWeight: "500" }}>
              {i + 1} : {libraries[i].name}&nbsp;
            </span>
            <span className={styles.font_green_color}>{libraries[i].id}</span>
          </Option>
        );
      }
    }

    this.setState({
      // 标记 成功
      project_modify_false_time: 5,
      project_modify_query_time: tao.current_format_time(),
      project_modify_project_data: obj,
      project_data_experiment_type_select: type,
      project_data_default_irt_library_select:
        irt_library_name + " " + irt_library_id,
      project_data_default_irt_librarys_arr: default_irt_librarys_arr,
      project_data_default_librarys_arr: default_librarys_arr,
      project_data_description: description,
      // 标记数据为可用的状态
      project_modify_status: 0
    });

    return 0;
  };

  change_project_modify_update_data = () => {
    // 暂时只处理显示成功结果
    let { language } = this.props;
    setTimeout(() => {
      message.success(
        Languages[language]["propro.project_modify_update"] +
          " : " +
          Languages[language]["propro.prompt_success"],
        4
      );
    }, 300);
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

  handle_project_modify = () => {
    // 时间戳设置为 0
    this.props.set_state_newvalue({
      target: "project_modify_time",
      value: 0
    });

    // 检查状态
    if (0 == this.props.project_modify_status) {
      // 数据获取成功
      setTimeout(() => {
        // 调用 添加更新数据函数
        this.change_project_modify_data();
      }, 200);
    } else {
      // 数据获取失败
      // 1-弹出警告
      setTimeout(() => {
        Modal.error({
          title: "False",
          content: Languages[this.props.language]["propro.network_error"],
          okText: Languages[this.props.language]["propro.user_modal_know"]
        });
      }, 40);
      // 过一段时间 尝试再次连接服务器 这个时间要稍微长一点 用户体验会比较好
      let { project_modify_false_time } = this.state;
      // 2-判断是否需要再次发起请求
      if (0 >= project_modify_false_time) {
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
          project_modify_false_time: project_modify_false_time--
        });
      }, 120);

      return -1;
    }

    return 0;
  };

  set_project_data_experiment_type_select = e => {
    this.setState({
      project_data_experiment_type_select: e
    });
  };

  set_project_data_default_irt_library_select = e => {
    this.setState({
      project_data_default_irt_library_select: e
    });
  };

  set_project_data_default_library_select = e => {
    this.setState({
      project_data_default_library_select: e
    });
  };

  set_project_data_description = e => {
    this.setState({
      project_data_description: e.target.value
    });
  };

  update_project_data = () => {
    // 获取到需要更新的值
    let {
      project_modify_id = "",
      project_data_default_library_select,
      project_data_default_irt_library_select,
      project_data_experiment_type_select,
      project_data_description
    } = this.state;

    // 重新解析 得出id
    project_data_default_library_select = project_data_default_library_select.split(
      " "
    )[1];
    // 重新解析 得出id
    project_data_default_irt_library_select = project_data_default_irt_library_select.split(
      " "
    )[1];
    let obj = {};
    obj.id = project_modify_id;
    obj.default_library_select = project_data_default_library_select;
    obj.default_irt_library_select = project_data_default_irt_library_select;
    obj.type = project_data_experiment_type_select;
    obj.description = project_data_description;

    let { language } = this.props;

    setTimeout(() => {
      message.loading(
        Languages[language]["propro.project_modify_update"] +
          " : " +
          Languages[language]["propro.prompt_running"],
        2
      );
    }, 300);

    // 执行更新
    setTimeout(() => {
      this.props.update_project_modify_data(obj);
    }, 500);

    //
  };

  handle_project_modify_update = () => {
    // 时间戳设置为 0
    this.props.set_state_newvalue({
      target: "project_modify_update_time",
      value: 0
    });

    let { language } = this.props;
    // 检查状态
    if (0 == this.props.project_modify_update_status) {
      // 数据获取成功
      setTimeout(() => {
        // 调用 添加更新数据函数
        this.change_project_modify_update_data();
      }, 200);
    } else {
      // 数据获取失败
      // 1-弹出警告
      setTimeout(() => {
        Modal.error({
          title: "False",
          content: Languages[this.props.language]["propro.network_error"],
          okText: Languages[this.props.language]["propro.user_modal_know"]
        });
      }, 40);
      tao.my_console(
        "error",
        "@Author:tangtao; 更新数据失败,请重新尝试; ",
        "初步诊断:未能成功连接到 propro-server 的服务器或者未能成功解析返回的数据"
      );

      return -1;
    }

    return 0;
  };

  /**************************** render ****************************/
  /**************************** render ****************************/
  /**************************** render ****************************/
  /**************************** render ****************************/

  render() {
    // 监控 project_modify 数据变化
    if (10000 < this.props.project_modify_time) {
      // 资源有更新
      this.handle_project_modify();
    }
    // 用户主动更新
    if (10000 < this.props.project_modify_update_time) {
      // 资源有更新
      this.handle_project_modify_update();
    }

    if (0 != this.state.project_modify_status) {
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
      project_modify_id,
      project_modify_project_data: project_data = {}
    } = this.state;

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
            title={<FormattedHTMLMessage id="propro.project_list_title" />}
          >
            <Link to={"/project/list"}>
              <img
                src={return_svg}
                style={{
                  height: "30px",
                  cursor: "pointer"
                }}
              />
            </Link>
          </Tooltip>
          <FormattedHTMLMessage id="propro.project_modify_title" />
        </div>

        {/* 提示用户 删除 警告信息 */}
        <Modal
          title={
            <b>
              <FormattedHTMLMessage id="propro.modal_title" />
            </b>
          }
          visible={this.state.modal_visible}
          onOk={this.delete_project_modify_by_id_confirm}
          onCancel={this.delete_project_modify_by_id_cancel}
          maskClosable={true}
          okText={<FormattedHTMLMessage id="propro.modal_confirm" />}
          cancelText={<FormattedHTMLMessage id="propro.modal_cancel" />}
        >
          <div className={styles.font_red_color}>
            <FormattedHTMLMessage id="propro.project_modify_delete_warning" />
          </div>
        </Modal>

        {true == drawer_visible && (
          <Drawer
            title={
              <FormattedHTMLMessage id="propro.analysis_score_modify_data_detail" />
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

        <Row>
          <Col
            lg={24}
            xl={24}
            xxl={20}
            className={styles.font_primary_color}
            style={{
              textAlign: "left",
              fontSize: "14px",
              lineHeight: "30px"
            }}
          >
            <Descriptions
              bordered
              size="middle"
              column={4}
              style={{
                overflowX: "auto",
                overflowY: "auto"
              }}
              title={
                <Fragment>
                  <Row>
                    <Col lg={8}>
                      负责人 :&nbsp;
                      <span
                        className={"badge " + `${styles.bg_second_color}`}
                        style={{ padding: "5px 10px", color: "#ffffff" }}
                      >
                        {project_data.owner_name}
                      </span>
                    </Col>
                    <Col lg={8}>
                      创建时间 :&nbsp;
                      <span
                        className={"badge " + `${styles.bg_yellow_color}`}
                        style={{ padding: "5px 10px", color: "#FFFFFF" }}
                      >
                        {project_data.create_date}
                      </span>
                    </Col>

                    <Col lg={8}>
                      更新时间 :&nbsp;
                      <span
                        className={"badge " + `${styles.bg_green_color}`}
                        style={{ padding: "5px 10px", color: "#FFFFFF" }}
                      >
                        {project_data.last_modified_date}
                      </span>
                    </Col>
                  </Row>
                </Fragment>
              }
            >
              <Descriptions.Item span={2} label="项目ID">
                <div
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    padding: "5px"
                  }}
                  className={styles.font_primary_color}
                >
                  {project_data.id}
                </div>
              </Descriptions.Item>

              {/* 实验名称 */}
              <Descriptions.Item span={2} label="项目名称">
                <div
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    padding: "5px"
                  }}
                  // className={styles.font_primary_color}
                >
                  {project_data.name}
                </div>
              </Descriptions.Item>

              {/* 实验类型 */}
              <Descriptions.Item
                span={4}
                label={
                  <span className={styles.font_second_color}>实验类型</span>
                }
              >
                <div
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    padding: "5px"
                  }}
                  className={styles.font_second_color}
                >
                  <Select
                    style={{ width: 300 }}
                    onChange={this.set_project_data_experiment_type_select}
                    optionFilterProp="children"
                    defaultValue={
                      this.state.project_data_experiment_type_select
                    }
                    value={this.state.project_data_experiment_type_select}
                    placeholder={"未选择"}
                  >
                    <Option value="DIA_SWATH">DIA_SWATH</Option>
                    <Option value="PRM">PRM</Option>
                  </Select>
                </div>
              </Descriptions.Item>

              {/* 默认irt校准库 */}
              <Descriptions.Item
                span={4}
                label={
                  <span className={styles.font_second_color}>
                    默认irt校准库
                  </span>
                }
              >
                <div
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    padding: "5px"
                  }}
                  className={styles.font_second_color}
                >
                  <Select
                    style={{ width: 500 }}
                    onChange={this.set_project_data_default_irt_library_select}
                    optionFilterProp="children"
                    defaultValue={
                      this.state.project_data_default_irt_library_select
                    }
                    value={this.state.project_data_default_irt_library_select}
                    maxTagCount={40}
                  >
                    {this.state.project_data_default_irt_librarys_arr}
                  </Select>
                </div>
              </Descriptions.Item>
              {/* 默认标准库 */}
              <Descriptions.Item
                span={4}
                label={
                  <span className={styles.font_second_color}>默认标准库</span>
                }
              >
                <div
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    padding: "5px"
                  }}
                  className={styles.font_second_color}
                >
                  <Select
                    style={{ width: 500 }}
                    onChange={this.set_project_data_default_library_select}
                    optionFilterProp="children"
                    placeholder={"未选择"}
                    // 默认没有数据 所以注释掉 否则影响 placeholder 不显示
                    // value={this.state.project_data_default_library_select}
                  >
                    {this.state.project_data_default_librarys_arr}
                  </Select>
                </div>
              </Descriptions.Item>

              {/* 详情描述 */}
              <Descriptions.Item
                span={4}
                label={
                  <span className={styles.font_second_color}>详情描述</span>
                }
              >
                <div
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    padding: "5px"
                  }}
                  className={styles.font_second_color}
                >
                  <TextArea
                    value={this.state.project_data_description}
                    onChange={this.set_project_data_description}
                    placeholder="请输入"
                    autoSize={{ minRows: 3, maxRows: 10 }}
                  />
                </div>
              </Descriptions.Item>

              {/* 操作 */}
              <Descriptions.Item span={4} label={<span>操作</span>}>
                <div
                  style={{
                    wordWrap: "break-word",
                    wordBreak: "break-all",
                    padding: "5px"
                  }}
                  className={styles.font_second_color}
                >
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    style={{
                      fontWeight: 400,
                      fontSize: "12px",
                      margin: "5px 5px",
                      height: "30px",
                      lineHeight: "20px",
                      padding: "5px 10px",
                      letterSpacing: "1px"
                    }}
                    // 暂时还未实现
                    onClick={this.update_project_data}
                  >
                    <FormattedHTMLMessage id="propro.project_modify_update" />
                  </button>
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
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

export default Project_modify;
