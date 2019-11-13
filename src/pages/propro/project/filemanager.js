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
 * @Last Modified time: 2019-11-13 14:54:42
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

    let { fileList = [], project = [] } = this.props.project_filemanager_data;
    this.setState({
      // 标记 成功
      project_filemanager_false_time: 5,
      project_filemanager_query_time: tao.current_format_time(),
      //   project_filemanager_data: projects_arr,
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
          content: Languages[this.props.language]["propro.network_error"],
          okText: Languages[this.props.language]["propro.user_modal_know"]
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

    let { drawer_data, drawer_visible, aird_or_json_file_list } = this.state;

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
        console.log("before Upload file");
        // 添加新的文件
        this.setState(state => ({
          aird_or_json_file_list: [...state.aird_or_json_file_list, file]
        }));
        return false;
      },
      aird_or_json_file_list
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
            title={<FormattedHTMLMessage id="propro.project_list_title" />}
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
          cancelText={<FormattedHTMLMessage id="propro.modal_cancel" />}
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
          <Upload.Dragger {...aird_or_json_file_list_props}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">
              <FormattedHTMLMessage id="propro.standard_library_create_upload_file_description" />
            </p>
          </Upload.Dragger>
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
