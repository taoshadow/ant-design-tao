// src/pages/propro/task/list.js
// task_list  任务 列表

/***
 * @Author              TangTao https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @CreateTime          2019-9-9 15:52:58
 * @UpdateTime          2019-11-2 23:19:28
 * @Archive             任务 列表
 */

/****************  导入组件 ***************************/
/****************  导入组件 ***************************/

import { connect } from "dva";
import Link from "umi/link";
import { FormattedHTMLMessage } from "react-intl";
import { Fragment } from "react";

import {
  BackTop,
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
  Descriptions,
  Tag,
  // 滑动输入框
  Slider,
  // 数字输入 文本框
  InputNumber
} from "antd";

let { Option } = Select;
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
import delete_svg from "../style/static/task/delete.svg";
import return_svg from "../style/static/dashboard/return.svg";
import preloader_svg from "../style/static/dashboard/preloader.svg";
import arrow_up_svg from "../style/static/analysis/arrow_up.svg";

import { throws } from "assert";

/****************  导入 styles end ***************************/

/***********  task_list View 初始化   ***************/
/***********  task_list View 初始化   ***************/

const task_list_state_to_props = state => {
  // 发送的对象
  let obj = {};

  // 先从 models 里读取 是否显示登录  当前语言
  const language = state["language"].language;
  if ("undefined" != typeof language) {
    obj.language = language;
  }

  let {
    task_list_data_status = -1,
    task_list_time = 0,
    task_list_data = {},
    delete_task_list_by_id_time = 0,
    delete_task_list_by_id_status = -1
  } = state["task_list"];

  (obj.delete_task_list_by_id_time = delete_task_list_by_id_time),
    (obj.delete_task_list_by_id_status = delete_task_list_by_id_status),
    (obj.task_list_data_status = task_list_data_status),
    (obj.task_list_data = task_list_data),
    (obj.task_list_time = task_list_time);

  return obj;
};

const task_list_dispatch_to_props = dispatch => {
  return {
    // 更新触发器
    query_task_list: () => {
      const action = {
        type: "task_list/query_task_list",
        payload: null
      };
      dispatch(action);
    },
    set_state_newvalue: data => {
      const action = {
        type: "task_list/set_state_newvalue",
        payload: data
      };
      dispatch(action);
    },
    delete_task_list_by_id: data => {
      const action = {
        type: "task_list/delete_task_list_by_id",
        payload: data
      };
      dispatch(action);
    },
    query_task_list_by_custom: data => {
      const action = {
        type: "task_list/query_task_list_by_custom",
        payload: data
      };
      dispatch(action);
    }
  };
};

/***********  task_list View 初始化 end  ***************/

@connect(
  task_list_state_to_props,
  task_list_dispatch_to_props
)
class Task_list extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //   查询到的任务数据
      task_list_data: [],
      // 默认没有数据 状态为 -1 这个变量 暂时用不着 但是后续扩展会用到
      task_list_status: -1,
      // 请求失败再次发起请求的尝试次数
      task_list_false_time: 5,
      task_list_delete_id: null,
      delete_task_list_modal_visible: false,
      search_text: "",
      page_size: null,
      total_page: null,
      current_page: null,
      total_numbers: null,
      // 页面加载百分比 负数则失能
      load_percentage_value: -1,
      search_task_list_by_templates: null,
      // 记录查询数据的最新时间 要用客户端的时间
      task_list_query_time: null,
      task_templates: null
    };

    // 查询 task_list 列表
    this.props.query_task_list();

    // 配置 message
    message.config({
      top: 400,
      duration: 2,
      maxCount: 5,
      getContainer: () => document.body
    });
  }

  // task_list 服务端返回数据
  handle_task_list = () => {
    // 时间戳设置为 0
    this.props.set_state_newvalue({
      target: "task_list_time",
      value: 0
    });

    // 检查状态
    if (0 == this.props.task_list_data_status) {
      // 数据获取成功
      setTimeout(() => {
        // 调用 添加更新数据函数
        this.change_task_list_data();
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
      }, 80);

      // 过一段时间 尝试再次连接服务器 这个时间要稍微长一点 用户体验会比较好
      let { task_list_false_time } = this.state;
      // 2-判断是否需要再次发起请求
      if (0 >= task_list_false_time) {
        console.error(
          "@Author:tangtao; 抱歉,系统已终止运行,请重新刷新页面; ",
          "初步诊断:未能成功连接到 propro-server 的服务器 或者 未能成功解析返回的数据"
        );
        // 终止发送
        return -1;
      }

      // 写入新的请求失败参数
      setTimeout(() => {
        this.setState({
          task_list_false_time: task_list_false_time--
        });
      }, 90);

      return -1;
    }

    return 0;
  };

  delete_task_list_by_id = id => {
    // 弹出警告
    // 发起警告
    this.setState({
      delete_task_list_modal_visible: true,
      task_list_delete_id: id
    });
  };

  delete_task_list_by_id_cancel = () => {
    this.setState({
      delete_task_list_modal_visible: false,
      task_list_delete_id: null
    });
  };

  delete_task_list_by_id_confirm = () => {
    //
    let { task_list_delete_id: id = null } = this.state;

    this.setState({
      delete_task_list_modal_visible: false,
      task_list_delete_id: null
    });

    // 执行删除
    if (null == id) {
      console.warn("删除任务失败,请重新尝试");
      message.info(
        Languages[language]["propro.task_list_operation_delete"] +
          " : " +
          Languages[language]["propro.prompt_cancel"],
        1.4
      );
      return -1;
    }

    let { language } = this.props;
    // 弹出提示框
    message.loading(
      Languages[language]["propro.task_list_operation_delete"] +
        " : " +
        Languages[language]["propro.prompt_running"],
      2.5
    );

    setTimeout(() => {
      this.props.delete_task_list_by_id({ id: id });
    }, 400);
  };

  // 处理删除任务结果
  handle_delete_task_list_by_id = () => {
    // 时间戳先重新设置为 0
    this.props.set_state_newvalue({
      target: "delete_task_list_by_id_time",
      value: 0
    });

    let {
      delete_task_list_by_id_status: res_status = -100,
      language
    } = this.props;

    if (0 == res_status) {
      // 删除成功
      setTimeout(() => {
        // 弹出提示框
        message.success(
          Languages[language]["propro.task_list_operation_delete"] +
            " : " +
            Languages[language]["propro.prompt_success"],
          3
        );
      }, 1500);
      setTimeout(() => {
        this.handle_query_task_list_by_custom();
      }, 4000);
    } else {
      // 删除失败
      setTimeout(() => {
        // 提示
        message.error(
          Languages[language]["propro.task_list_operation_delete"] +
            " : " +
            Languages[language]["propro.prompt_failed"],
          4
        );
      }, 2000);
    }
  };

  change_task_list_data = () => {
    //   提取 model 层 传过来的数据

    /**
        currentPage: 1
        pageSize: 1000
        statusList: (5) ["UNKNOWN", "WAITING", "RUNNING", "SUCCESS", "FAILED"]
        taskTemplates: (14) ["DEFAULT", "SCAN_AND_UPDATE_EXPERIMENTS", "UPLOAD_LIBRARY_FILE", "EXTRACTOR", "IRT_EXTRACTOR", "EXTRACT_PEAKPICK_SCORE", "IRT_EXTRACT_PEAKPICK_SCORE", "IRT", "SCORE", "AIRUS", "SWATH_WORKFLOW", "COMPRESSOR_AND_SORT", "EXPORT_SUBSCORES_TSV_FILE_FOR_PYPROPHET", "BUILD_SCORE_DISTRIBUTE"]
        tasks: (302) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, …]
        totalPage
       */

    // 提取服务端数据
    let {
      currentPage: current_page,
      pageSize: page_size,
      // 任务状态
      statusList: status_list,
      // 任务模板
      taskTemplates: task_templates,
      // 任务列表
      tasks,
      totalPage: total_page,
      totalNumbers: total_numbers
    } = this.props.task_list_data;

    // 计算加载的百分比
    let load_percentage_value = -1;
    if (0 < total_page && 0 < tasks.length && 0 < total_numbers) {
      load_percentage_value = Math.ceil((tasks.length / total_numbers) * 100);
    }

    /*
        createDate: 1567865007231
        creator: "Admin"
        id: "5d73b8af5f563d5a68fb277c"
        lastModifiedDate: 1567865012625
        logs: [{content: "Task Started", time: 1567865007232}, {content: "删除旧数据完毕,开始文件解析", time: 1567865007847},…]
        name: "UPLOAD_LIBRARY_FILE-45545454"
        startTime: 1567865007232
        status: "SUCCESS"
        taskTemplate: "UPLOAD_LIBRARY_FILE"
        totalCost: 5393
      */

    let { length: len0 } = tasks;
    let obj_data = null;
    if (0 < len0) {
      obj_data = new Array(len0);
      let index = 0;
      // 缓存对象
      let obj_temp = {};
      for (let i in tasks) {
        // 提取服务端数据
        let {
          lastModifiedDate: last_modified_date,
          createDate: create_date,
          creator,
          id,
          logs,
          name,
          startTime: start_time,
          status,
          taskTemplate: task_template,
          totalCost: total_cost
        } = tasks[i];

        // 添加索引是为了展示方便
        (obj_temp.index = index + 1),
          (obj_temp.key = "task_list_" + i),
          (obj_temp.id = id),
          (obj_temp.name = name),
          (obj_temp.last_modified_date = tao.format_time(last_modified_date)),
          (obj_temp.creator = creator),
          // 转换时间戳为指定的日期格式
          (obj_temp.create_date = tao.format_time(create_date)),
          (obj_temp.logs = logs),
          (obj_temp.status = status),
          (obj_temp.start_time = start_time),
          (obj_temp.task_template = task_template),
          // 任务运行时间
          (obj_temp.total_cost = total_cost),
          (obj_data[index++] = obj_temp),
          (obj_temp = {});
      }
    }

    // 渲染 任务状态
    let { length: len1 } = task_templates;
    let task_templates_arr = null;
    if (0 < task_templates.length) {
      task_templates_arr = new Array(len1 + 1);
      task_templates_arr[0] = (
        <Option key={"ALL"} value={"ALL"}>
          {"ALL"}
        </Option>
      );
      for (let i = 0, j = 1; i < len1; i++) {
        task_templates_arr[j++] = (
          <Option key={task_templates[i]} value={task_templates[i]}>
            {task_templates[i]}
          </Option>
        );
      }
    }

    // 添加服务端数据
    this.setState({
      task_list_data: obj_data,
      // 标记 成功
      task_list_false_time: 5,
      // 标记数据为可用的状态
      task_list_status: 0,
      page_size: page_size,
      total_page: total_page,
      current_page: current_page,
      total_numbers: total_numbers,
      // 加载的百分比
      load_percentage_value: load_percentage_value,
      task_templates: task_templates_arr,
      task_list_query_time: tao.current_format_time()
    });

    return 0;
  };

  change_search_task_list_by_templates = value => {
    value += "";

    if (0 >= value.length) {
      console.warn("你在搞啥?");
      return -1;
    }

    // 设置搜索模板
    this.setState({
      search_task_list_by_templates: value
    });
  };

  change_load_percentage_value = value => {
    if (0 > value || 100 < value) {
      console.warn("你在搞啥?");
      return -1;
    }

    // 提取到最新 值

    this.setState({
      load_percentage_value: value
    });
  };

  get_column_search_props = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => this.handle_table_search(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handle_table_search(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          <FormattedHTMLMessage id="propro.task_list_search" />
        </Button>
        <Button
          onClick={() => this.handle_table_reset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          <FormattedHTMLMessage id="propro.task_list_reset" />
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[this.state.search_text]}
        autoEscape
        textToHighlight={text.toString()}
      />
    )
  });

  handle_table_search = (selectedKeys, confirm) => {
    confirm();
    this.setState({ search_text: selectedKeys[0] });
  };

  handle_table_reset = clearFilters => {
    clearFilters();
    this.setState({ search_text: "" });
  };

  handle_query_task_list_by_custom = () => {
    // 用户发起自定义查询
    // 尝试提取自定义的参数
    let {
      load_percentage_value,
      search_task_list_by_templates,
      page_size,
      total_page,
      task_templates,
      total_numbers
    } = this.state;
    let value =
      100 <= load_percentage_value ? 100 : Math.ceil(load_percentage_value);

    let new_page_size = null;
    // 根据 value 推算出 pageSize

    if (0 < parseInt(total_numbers)) {
      new_page_size = Math.ceil((total_numbers * value) / 100);
    }

    // 限制最小 page_size
    let min_size = 30;
    // 得出真正的 value 即新的 page_size
    new_page_size = min_size >= new_page_size ? min_size : new_page_size;

    if (
      0 >= (search_task_list_by_templates + "").length ||
      "ALL" == search_task_list_by_templates
    ) {
      // 数值为空 或者 指定 查询全部
      search_task_list_by_templates = null;
    }
    let obj = {
      // 根据自定义的加载百分比得出页大小
      page_size: new_page_size,
      // 指定的查询参数
      search_task_list_by_templates: search_task_list_by_templates
    };

    this.props.query_task_list_by_custom(obj);
    // 设置数据为不可用状态
    this.setState({
      task_list_status: -1
    });
  };

  render() {
    // 定义 解析 配置 表格
    const task_list_table_columns = [
      {
        //   序列号
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.task_list_index" />
          </span>
        ),
        dataIndex: "index",
        key: "index",
        ...this.get_column_search_props("index"),
        render: text => (
          <span
            style={{
              fontSize: "8px"
            }}
          >
            {text}
          </span>
        )
      },
      {
        //   任务名称
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.task_list_name" />
          </span>
        ),
        key: "name",
        ...this.get_column_search_props("name"),
        render: list => {
          return (
            <Tooltip
              placement="top"
              title={<FormattedHTMLMessage id="propro.task_list_link_detail" />}
            >
              <div
                style={{
                  fontSize: "8px",
                  wordWrap: "break-word",
                  wordBreak: "break-all",
                  minWidth: "200px",
                  maxWidth: "200px"
                }}
              >
                {/* 跳转到详情页面 */}
                <Link to={"/task/detail/" + list.id}>{list.name}</Link>
              </div>
            </Tooltip>
          );
        }
      },
      {
        // 任务模板
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.task_list_task_template" />
          </span>
        ),
        dataIndex: "task_template",
        key: "task_template",
        ...this.get_column_search_props("task_template"),
        render: text => (
          <span
            style={{
              fontSize: "8px"
            }}
          >
            {text}
          </span>
        )
      },
      {
        // "UNKNOWN", "WAITING", "RUNNING", "SUCCESS", "FAILED"
        //   任务状态
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.task_list_status" />
          </span>
        ),
        dataIndex: "status",
        key: "status",
        ...this.get_column_search_props("status"),

        render: text => {
          let class_name = null;

          switch (text) {
            case "SUCCESS":
              class_name = styles.font_green_color;
              break;
            case "FAILED":
              class_name = styles.font_red_color;
              break;
            case "RUNNING":
              class_name = styles.font_primary_color;
              break;
            case "WAITING":
              class_name = styles.font_yellow_color;
              break;
            case "UNKNOWN":
              // 暗红色
              class_name = styles.font_dark_red_color;
              break;
            default:
              class_name = null;
          }

          return (
            <span
              style={{
                fontSize: "8px"
              }}
              className={`${class_name}`}
            >
              {text}
            </span>
          );
        }
      },
      {
        //   任务创建时间
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.task_list_create_date" />
          </span>
        ),
        dataIndex: "create_date",
        key: "create_date",
        ...this.get_column_search_props("create_date"),
        render: text => (
          <span
            style={{
              fontSize: "8px"
            }}
            className={styles.font_primary_color}
          >
            {text}
          </span>
        )
      },
      {
        //   任务运行时间
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.task_list_running_total_time" />
          </span>
        ),
        dataIndex: "total_cost",
        key: "total_cost",
        ...this.get_column_search_props("total_cost"),
        render: text => (
          <span
            style={{
              fontSize: "8px"
            }}
            className={styles.font_primary_color}
          >
            {null == text ? (
              <span className={styles.font_red_color}> NULL</span>
            ) : (
              text
            )}
            &nbsp;ms
          </span>
        )
      },
      {
        // 任务最后修改时间
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.task_list_last_modified_date" />
          </span>
        ),
        dataIndex: "last_modified_date",
        key: "last_modified_date",
        ...this.get_column_search_props("last_modified_date"),
        render: text => (
          <span
            style={{
              fontSize: "8px"
            }}
            className={styles.font_primary_color}
          >
            {text}
          </span>
        )
      },
      {
        // 任务最后修改时间
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.task_list_creator" />
          </span>
        ),
        dataIndex: "creator",
        key: "creator",
        ...this.get_column_search_props("creator"),
        render: text => (
          <span
            style={{
              fontSize: "8px"
            }}
            className={styles.font_second_color}
          >
            {text}
          </span>
        )
      },
      {
        // 任务操作
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.task_list_operation" />
          </span>
        ),
        dataIndex: "id",
        key: "operation_id",
        render: text => (
          //   {/* 更新标准库链接 */}
          <Tooltip
            title={
              <FormattedHTMLMessage id="propro.task_list_operation_delete" />
            }
          >
            <button
              type="button"
              className={"btn btn-danger"}
              style={{
                padding: "5px 10px",
                margin: "5px"
              }}
              onClick={() => {
                this.delete_task_list_by_id(text);
              }}
            >
              <img
                src={delete_svg}
                style={{
                  height: "20px"
                }}
              />
            </button>
          </Tooltip>
        )
      }
    ];

    // 监控 task_list 数据变化
    if (10000 < this.props.task_list_time) {
      // 资源有更新
      this.handle_task_list();
    }

    if (0 != this.state.task_list_status) {
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

    if (10000 < this.props.delete_task_list_by_id_time) {
      this.handle_delete_task_list_by_id();
    }

    // 提取必要的参数
    let {
      load_percentage_value,
      task_list_data,
      task_templates,
      total_numbers,
      task_list_query_time
    } = this.state;

    if (null == task_list_data) {
      task_list_data = [];
    }
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
            <Link to="/console">
              <img
                src={return_svg}
                style={{
                  height: "30px",
                  cursor: "pointer"
                }}
              />
            </Link>
          </Tooltip>
          <FormattedHTMLMessage id="propro.task_list_title" />
        </div>

        {/* 提示用户警告信息 */}
        <Modal
          title={
            <b>
              <FormattedHTMLMessage id="propro.modal_title" />
            </b>
          }
          visible={this.state.delete_task_list_modal_visible}
          onOk={this.delete_task_list_by_id_confirm}
          onCancel={this.delete_task_list_by_id_cancel}
          maskClosable={true}
          okText={<FormattedHTMLMessage id="propro.modal_confirm" />}
          cancelText={<FormattedHTMLMessage id="propro.modal_cancel" />}
        >
          <div className={styles.font_red_color}>
            <FormattedHTMLMessage id="propro.task_list_delete_by_id_modal_warn" />
          </div>
        </Modal>

        <Row>
          <Col lg={24} xl={24} xxl={24}>
            <Col
              span={24}
              style={{
                background: "#FFFFFF",
                padding: "20px",
                fontSize: "14px",
                border: "1px solid #e5e9f2",
                // maxWidth: "600px",
                overflow: "auto"
              }}
            >
              <Descriptions
                title={
                  <FormattedHTMLMessage id="propro.task_list_table_info" />
                }
              >
                {/* 查询时间 */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.task_list_load_time" />
                  }
                >
                  <span className={styles.font_primary_color}>
                    {task_list_query_time}
                  </span>
                </Descriptions.Item>

                {/* 已加载 */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.task_list_load_numbers" />
                  }
                >
                  <span
                    className={
                      0 >= task_list_data.length
                        ? styles.font_red_color
                        : styles.font_primary_color
                    }
                  >
                    {task_list_data.length}
                  </span>
                </Descriptions.Item>

                {/* 总数目 */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.task_list_total_numbers" />
                  }
                >
                  <span
                    className={
                      0 >= total_numbers
                        ? styles.font_red_color
                        : styles.font_primary_color
                    }
                  >
                    {total_numbers}
                  </span>
                </Descriptions.Item>
              </Descriptions>
              {/* 显示加载百分比 */}
              <Col span={24}>
                <div style={{ float: "left" }}>
                  <div
                    style={{
                      float: "left",
                      height: "30px",
                      lineHeight: "30px"
                    }}
                  >
                    <FormattedHTMLMessage id="propro.task_list_load_percentage" />
                    &nbsp;:
                  </div>
                  <div
                    style={{
                      width: "300px"
                    }}
                  >
                    <Slider
                      min={0}
                      max={100}
                      style={{ margin: "10px 0px 0px 80px", height: "30px" }}
                      onChange={this.change_load_percentage_value}
                      value={Math.ceil(load_percentage_value)}
                    />
                  </div>
                </div>

                <div>
                  <InputNumber
                    min={1}
                    max={100}
                    style={{ marginLeft: "15px" }}
                    value={load_percentage_value}
                    onChange={this.change_load_percentage_value}
                  />
                </div>
              </Col>

              <Col span={24}>
                <div>
                  <FormattedHTMLMessage id="propro.task_list_search_by_templates_title" />
                  &nbsp;:&nbsp;&nbsp;
                  <Select
                    showSearch
                    style={{ width: "300px" }}
                    defaultValue="ALL"
                    placeholder={
                      <FormattedHTMLMessage id="propro.task_list_search_by_templates_title_prompt" />
                    }
                    disabled={null == task_templates}
                    onChange={this.change_search_task_list_by_templates}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.state.task_templates}
                  </Select>
                  <Button
                    type="primary"
                    style={{
                      padding: "0px 15px",
                      margin: "0px 50px 0px 10px",
                      height: "32px",
                      lineHeight: "32px"
                    }}
                    onClick={this.handle_query_task_list_by_custom}
                  >
                    <span>
                      &nbsp;
                      <FormattedHTMLMessage id="propro.task_list_search" />
                    </span>
                  </Button>
                </div>
              </Col>
            </Col>
            <Col
              span={24}
              style={{
                background: "#FFFFFF",
                padding: "20px",
                fontSize: "14px",
                margin: "30px 0px",
                border: "1px solid #e5e9f2",
                overflow: "auto"
              }}
            >
              <Table
                size={"middle"}
                columns={task_list_table_columns}
                pagination={{
                  position: "top",
                  hideOnSinglePage: true,
                  defaultPageSize: 100
                }}
                dataSource={task_list_data}
              />
            </Col>
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

export default Task_list;
