/*
 * @Author: TangTao https://www.promiselee.cn/tao
 * @Date: 2019-11-13 14:37:48
 * @Last Modified by: TangTao tangtao2099@outlook.com
 * @Last Modified time: 2019-11-13 14:53:39
 */
// src/pages/propro/library/standard_library_create.js
// 公共标准库列表id 详情

/***
 * @Author              TangTao https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @CreateTime          2019-8-28 19:06:35
 * @UpdateTime          2019-8-28 22:17:29
 * @Archive             创建标准库
 *
 */

/****************  导入组件 ***************************/
/****************  导入组件 ***************************/

import { connect } from "dva";
import Link from "umi/link";
import { FormattedHTMLMessage } from "react-intl";
import { Fragment } from "react";
import $ from "jquery";

import {
  Layout,
  Menu,
  Icon,
  Switch,
  Breadcrumb,
  Row,
  Col,
  Button,
  Dropdown,
  Select,
  Popconfirm,
  message,
  Tabs,
  Input,
  Modal,
  Tooltip,
  Table,
  Divider,
  Tag,
  Descriptions,
  Badge,
  Form,
  Radio,
  Checkbox,
  Upload,
  Timeline
} from "antd";
const { TextArea } = Input;
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
import return_svg from "../style/static/dashboard/return.svg";
import preloader_svg from "../style/static/dashboard/preloader.svg";
import create from "antd/lib/icon/IconFont";

/****************  导入 styles end ***************************/

/***********  standard_library View 初始化   ***************/
/***********  standard_library View 初始化   ***************/

const standard_library_state_create_to_props = state => {
  let obj = {};

  // 先从 models 里读取 是否显示登录  当前语言
  const language = state["language"].language;
  if ("undefined" != typeof language) {
    obj.language = language;
  }

  let {
    standard_library_create_status,
    standard_library_create_time,
    standard_library_create_task_id,
    standard_library_query_task_data,
    standard_library_query_task_status,
    standard_library_query_task_time
  } = state["standard_library_create"];

  (obj.standard_library_query_task_data = standard_library_query_task_data),
    (obj.standard_library_query_task_status = standard_library_query_task_status),
    (obj.standard_library_query_task_time = standard_library_query_task_time),
    (obj.standard_library_create_task_id = standard_library_create_task_id),
    (obj.standard_library_create_status = standard_library_create_status),
    (obj.standard_library_create_time = standard_library_create_time);
  return obj;
};

const standard_library_create_dispatch_to_props = dispatch => {
  return {
    // 更新触发器
    create_library_by_name: data => {
      const action = {
        type: "standard_library_create/create_library_by_name",
        payload: data
      };
      dispatch(action);
    },
    query_task_id: data => {
      const action = {
        type: "standard_library_create/query_task_id",
        payload: data
      };
      dispatch(action);
    },
    set_state_newvalue: data => {
      const action = {
        type: "standard_library_create/set_state_newvalue",
        payload: data
      };
      dispatch(action);
    }
  };
};

/***********  standard_library View 初始化 end  ***************/

@connect(
  standard_library_state_create_to_props,
  standard_library_create_dispatch_to_props
)
class Standard_library_create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 库名称
      standard_library_create_name: null,
      // 默认没有数据 状态为 -1  出错 -2 成功 0
      standard_library_create_status: -1,
      // 库类型 默认是 library
      standard_library_type: "library",
      peptide_file_list: [],
      csv_library_file_list: [],
      standard_library_detail_description: null,
      // 定时器
      query_task_interval: null,
      // 是否显示 task 进度
      query_task_show: false,
      // 输出的 元素
      query_task_elements: null
    };
    // 配置 message
    message.config({
      top: 500,
      duration: 2,
      maxCount: 5,
      getContainer: () => document.body
    });
  }

  change_library_type = e => {
    // 更新 type
    this.setState({
      standard_library_type: e.target.value
    });
  };

  // 详情
  change_detail_description = e => {
    this.setState({
      standard_library_detail_description: e.target.value
    });
  };

  // 提交表单
  handle_submit = () => {
    // 读取 peptide_file_list
    let obj = {};
    obj.peptide_file_list = this.state.peptide_file_list;
    obj.csv_library_file_list = this.state.csv_library_file_list;

    obj.name = this.state.standard_library_create_name;
    obj.library_type = this.state.standard_library_type;
    obj.detail_description = this.state.standard_library_detail_description;

    if ("" == obj.csv_library_file_list) {
      // 文件为空
      return -1;
    }
    if ("" == obj.standard_library_create_name) {
      // 名称为空
      return -2;
    }

    this.props.create_library_by_name(obj);

    let { language } = this.props;
    message.loading(
      Languages[language]["propro.standard_library_create_title"] +
        " : " +
        Languages[language]["propro.standard_lib_detail_running"],
      2.5
    );
    this.setState({
      query_task_show: false
    });
  };

  change_library_name = e => {
    this.setState({
      standard_library_create_name: e.target.value
    });
  };

  handle_standard_library_create_by_name = () => {
    // 时间戳归零
    this.props.set_state_newvalue({
      target: "standard_library_create_time",
      value: 0
    });

    let { language } = this.props;

    // 读取状态
    if (0 == this.props.standard_library_create_status) {
      // 更新成功
      setTimeout(() => {
        // 提示
        message.success(
          Languages[language]["propro.standard_library_create_title"] +
            " : " +
            Languages[language]["propro.standard_lib_detail_success"],
          2
        );
        // 调用查询任务接口
        try {
          clearInterval(this.state.query_task_interval);
        } catch (e) {
          //
        } finally {
          this.setState({
            query_task_interval: setInterval(() => {
              this.props.query_task_id({
                task_id: this.props.standard_library_create_task_id
              });
            }, 2000)
          });
        }
      }, 220);
    } else {
      // 更新失败
      setTimeout(() => {
        // 提示
        message.error(
          Languages[language]["propro.standard_library_create_title"] +
            " : " +
            Languages[language]["propro.standard_lib_detail_failed"],
          4
        );
      }, 220);
    }
  };

  handle_standard_library_query_task = () => {
    // 时间戳归零
    this.props.set_state_newvalue({
      target: "standard_library_query_task_time",
      value: 0
    });
    // 调用显示任务进度
    setTimeout(() => {
      this.setState({
        query_task_show: true
      });
    }, 200);

    let { language } = this.props;

    if (0 == this.props.standard_library_query_task_status) {
      // 提取成功
      let { standard_library_query_task_data } = this.props;
      let {
        lastModifiedDate,
        id,
        creator,
        createDate,
        logs,
        name,
        startTime,
        status,
        totalCost,
        taskTemplate
      } = standard_library_query_task_data;
      // 渲染数据
      let elements = new Array();
      elements.push(
        <Timeline.Item dot={<Icon type="clock-circle-o" />} key={"elements-id"}>
          <span className={styles.font_primary_color}>
            {tao.format_time(createDate)}
          </span>
          <br />
          <span className={styles.font_second_color}>
            <b>creator:</b>&nbsp;&nbsp;
          </span>
          {creator}
          <br />
          <b className={styles.font_second_color}>taskId:&nbsp;</b>
          &nbsp;&nbsp;
          {id}
        </Timeline.Item>
      );
      for (let i = 0, len = logs.length; i < len; i++) {
        let element = logs[i];
        elements.push(
          <Timeline.Item key={"elements-" + i}>
            <span className={styles.font_primary_color}>
              {tao.format_time(parseInt(element.time))}
            </span>
            <br />
            {element.content}
          </Timeline.Item>
        );
      }
      elements.push(
        <Timeline.Item
          dot={<Icon type="clock-circle-o" />}
          key={"elements-end"}
        >
          <span className={styles.font_primary_color}>
            {tao.format_time(lastModifiedDate)}
          </span>
          <br />
          <span
            className={
              "badge " + ("SUCCESS" == status ? "badge-success" : "badge-info")
            }
            style={{
              padding: "5px 10px",
              fontSize: "8px"
            }}
          >
            {status}
          </span>
        </Timeline.Item>
      );

      setTimeout(() => {
        this.setState({
          query_task_elements: elements
        });
      }, 100);

      // 处理状态
      if ("SUCCESS" == status) {
        // 成功
        // 定位滚动条 到底部
        setTimeout(() => {
          $("html,body").animate(
            { scrollTop: parseInt(document.body.scrollHeight) },
            800
          );
        }, 300);
        // 尝试清空定时器
        try {
          clearInterval(this.state.query_task_interval);
        } catch (e) {
          //
        } finally {
          setTimeout(() => {
            this.setState({
              query_task_interval: null,
              standard_library_create_name: null
            });
          }, 120);
        }
      }
    } else {
      // 提取失败
      return -1;
    }
  };

  /**
status: 0
task:
  createDate: 1567061726665
  creator: "Admin"
  id: "5d6776de40da602bf4b4f963"
  lastModifiedDate: 1567061726708
  logs: (5) [
  0: {content: "Task Started", time: 1567061819240}
  1: {content: "删除旧数据完毕,开始文件解析", time: 1567061819243}
  2: {content: "开始统计蛋白质数目,肽段数目和Transition数目", time: 1567061819260}
  3: {content: "统计完毕", time: 1567061819267}
  4: {content: "Task Ended", time: 1567061819267}]
  name: "UPLOAD_LIBRARY_FILE-12eq"
  startTime: 1567061726666
  status: "SUCCESS"
  taskTemplate: "UPLOAD_LIBRARY_FILE"
  totalCost: 42
 */

  render() {
    if (10000 < this.props.standard_library_create_time) {
      // 传入了新状态
      this.handle_standard_library_create_by_name();
    }
    if (10000 < this.props.standard_library_query_task_time) {
      // 传入了新状态
      this.handle_standard_library_query_task();
    }

    const { peptide_file_list, csv_library_file_list } = this.state;
    const peptide_file_list_props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.peptide_file_list.indexOf(file);
          const new_file_list = state.peptide_file_list.slice();
          new_file_list.splice(index, 1);
          return {
            peptide_file_list: new_file_list
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          peptide_file_list: [...state.peptide_file_list, file]
        }));
        return false;
      },
      peptide_file_list
    };
    const csv_library_file_list_props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.csv_library_file_list.indexOf(file);
          const new_file_list = state.csv_library_file_list.slice();
          new_file_list.splice(index, 1);
          return {
            csv_library_file_list: new_file_list
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          csv_library_file_list: [...state.csv_library_file_list, file]
        }));
        return false;
      },
      csv_library_file_list
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
            title={<FormattedHTMLMessage id="propro.console" />}
          >
            <Link to={"/console"}>
              <img
                src={return_svg}
                style={{
                  height: "30px",
                  cursor: "pointer"
                }}
              />
            </Link>
          </Tooltip>

          <FormattedHTMLMessage id="propro.standard_library_create_title" />
        </div>

        <div
          style={{
            background: "#FFFFFF",
            padding: "20px",
            fontSize: "14px",
            border: "1px solid #e5e9f2",
            maxWidth: "600px",
            overflow: "auto"
          }}
        >
          {/* name */}

          <div
            className="input-group-sm mb-3"
            style={{
              maxWidth: "350px"
            }}
          >
            <div
              style={{
                paddingBottom: "10px"
              }}
            >
              <FormattedHTMLMessage id="propro.standard_library_detail_name" />
            </div>
            <Input
              value={this.state.standard_library_create_name}
              maxLength={30}
              onChange={this.change_library_name}
            />
            <div
              style={{
                fontSize: "12px",
                paddingTop: "3px"
              }}
              className={styles.font_primary_color}
            >
              <FormattedHTMLMessage id="propro.standard_library_create_only_name" />
            </div>
          </div>

          {/* type */}
          <div
            className="input-group-sm mb-3"
            style={{
              maxWidth: "350px"
            }}
          >
            <div
              style={{
                paddingBottom: "10px"
              }}
            >
              <FormattedHTMLMessage id="propro.standard_library_detail_lib_type" />
            </div>
            <div>
              <Radio.Group
                defaultValue={this.state.standard_library_type}
                onChange={this.change_library_type}
              >
                <Radio value="library">
                  <FormattedHTMLMessage id="propro.console_lib" />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                </Radio>
                <Radio value="irt_library">
                  <FormattedHTMLMessage id="propro.console_irt_lib" />
                  &nbsp;&nbsp;&nbsp;&nbsp;
                </Radio>
              </Radio.Group>
            </div>
          </div>

          {/* description */}
          <div
            className="input-group-sm mb-3"
            style={{
              maxWidth: "350px"
            }}
          >
            <div
              style={{
                paddingBottom: "10px"
              }}
            >
              <FormattedHTMLMessage id="propro.standard_library_detail_description" />
            </div>
            <TextArea
              onChange={this.change_detail_description}
              rows={5}
              maxLength={120}
            />
          </div>

          {/* upload library */}
          <div
            className="input-group-sm mb-3"
            style={{
              maxWidth: "350px"
            }}
          >
            <div
              style={{
                paddingBottom: "10px"
              }}
            >
              <span className={styles.font_red_color}>*</span>
              <FormattedHTMLMessage id="propro.standard_library_create_upload_csv_library" />
            </div>

            <Upload.Dragger {...csv_library_file_list_props}>
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">
                <FormattedHTMLMessage id="propro.standard_library_create_upload_file_description" />
              </p>
            </Upload.Dragger>
          </div>

          {/* upload peptide list */}
          <div
            className="input-group-sm mb-3"
            style={{
              maxWidth: "350px"
            }}
          >
            <div
              style={{
                paddingBottom: "10px"
              }}
            >
              <FormattedHTMLMessage id="propro.standard_library_create_only_upload_peptide_list" />
            </div>

            <Upload.Dragger {...peptide_file_list_props}>
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">
                <FormattedHTMLMessage id="propro.standard_library_create_upload_file_description" />
              </p>
            </Upload.Dragger>
          </div>

          {/* submit */}

          <div
            style={{
              marginTop: "30px",
              marginBottom: "10px"
            }}
          >
            <Button
              type="primary"
              style={{
                padding: "0px 15px",
                height: "32px",
                lineHeight: "32px"
              }}
              onClick={this.handle_submit}
            >
              <span>
                &nbsp;
                <FormattedHTMLMessage id="propro.standard_library_create_submit" />
              </span>
            </Button>
          </div>

          {/* 任务状态 */}
          {this.state.query_task_show && (
            <div
              style={{
                marginTop: "30px"
              }}
            >
              <Timeline
                pending={
                  null == this.state.query_task_interval ? false : "Running..."
                }
              >
                {this.state.query_task_elements}
              </Timeline>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Standard_library_create;
