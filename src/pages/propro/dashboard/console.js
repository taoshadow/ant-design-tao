// /src/pages/propro/dashboard/home.js

/***
 * @Author              TangTao
 * @Email               tangtao2099@outlook.com   https://www.promiselee.cn
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-8-9 01:31:04
 * @UpdateTime          2019-8-28 19:26:05
 * @Archive             用户设置界面
 */

/****************  导入组件 ***************************/
/****************  导入组件 ***************************/

import { connect } from "dva";
import Link from "umi/link";
import { FormattedHTMLMessage } from "react-intl";

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
  Tag
} from "antd";

import Highlighter from "react-highlight-words";

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
import add_svg from "../style/static/dashboard/add.svg";
import unordered_list_svg from "../style/static/dashboard/unordered_list.svg";
/****************  导入 styles end ***************************/

/***********  Console View 初始化   ***************/
/***********  Console View 初始化   ***************/

const consoleStateToProps = state => {
  // 发送的对象
  let obj = {};

  // 先从 models 里读取 是否显示登录  当前语言
  const language = state["language"].language;
  if ("undefined" != typeof language) {
    obj.language = language;
  }

  let {
    resource_list_status = -1,
    resource_list_time = 0,
    task_running_count = "",
    lib_count = "",
    irt_lib_count = "",
    public_lib_count = "",
    public_irt_count = "",
    exp_swath_count = "",
    exp_prm_count = "",
    project_count = "",
    overview_count = ""
  } = state["console"];

  (obj.resource_list_status = resource_list_status),
    (obj.resource_list_time = resource_list_time),
    (obj.task_running_count = task_running_count),
    (obj.lib_count = lib_count),
    (obj.irt_lib_count = irt_lib_count),
    (obj.public_lib_count = public_lib_count),
    (obj.public_irt_count = public_irt_count),
    (obj.exp_swath_count = exp_swath_count),
    (obj.exp_prm_count = exp_prm_count),
    (obj.project_count = project_count),
    (obj.overview_count = overview_count);
  return obj;
};

const consoleDispatchToProps = dispatch => {
  return {
    // 更新触发器
    get_console_resource_list: () => {
      const action = {
        type: "console/get_console_resource_list",
        payload: null
      };
      dispatch(action);
    },
    set_state_newvalue: data => {
      const action = {
        type: "console/set_state_newvalue",
        payload: data
      };
      dispatch(action);
    }
  };
};

/***********  Console View 初始化 end  ***************/

@connect(
  consoleStateToProps,
  consoleDispatchToProps
)
class Console extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query_resource_list_times: 0,
      resource_list_data: [],
      // 默认没有数据 状态为 -1
      resource_list_status: -1,
      language: this.props.language
    };

    // 默认没有数据  主动触发
    this.query_resource_list();
  }

  handle_resource_list = () => {
    // 更新值
    // 延时 为了防止还未渲染完成就再次更新
    setTimeout((i = this.state.query_resource_list_times) => {
      this.setState({ query_resource_list_times: i + 1 });
    }, 300);
    // 时间戳设置为 0
    this.props.set_state_newvalue({ target: "resource_list_time", value: 0 });

    // 检查状态
    if (0 == this.props.resource_list_status) {
      // 数据获取成功
      setTimeout(() => {
        // 调用 添加更新数据函数
        this.change_resource_list_data(this.props);
        // 添加服务端数据
        this.setState({
          // 标记 成功
          resource_list_status: 0
        });
      }, 200);
    } else {
      // 数据获取失败
      setTimeout(() => {
        this.setState({
          resource_list_status: -1
        });
      }, 220);
      Modal.error({
        title: "False",
        content: Languages[this.props.language]["propro.network_error"],
        okText: Languages[this.props.language]["propro.user_modal_know"]
      });
      return -1;
    }

    return 0;
  };

  query_resource_list = () => {
    // 防止过度更新数据 也有可能存在死循环  设置一个 阈值
    // 阈值主要在调试开发过程中有用 发布时保留不会有坏处
    // 不了解整个流程情况下不能删除该阈值 否则会有其他错误
    if (50 > this.state.query_resource_list_times) {
      // 尝试提取数据
      // 注意 这里不先从 model 中 获取  不存在就直接重新从网络获取
      // 因为 model 相当于缓存 并不是最新数据 所以主动重新发起查询
      if (0 != this.state.resource_list_status) {
        // 发起查询
        this.props.get_console_resource_list();
      }
    }
  };

  change_resource_list_data = obj => {
    // 数据获取成功
    const {
      task_running_count,
      lib_count,
      irt_lib_count,
      public_lib_count,
      public_irt_count,
      exp_swath_count,
      exp_prm_count,
      project_count,
      overview_count
    } = obj;

    const { language } = this.props;
    // 添加服务端数据
    this.setState({
      resource_list_data: [
        {
          key: "public_lib_count",
          name: <FormattedHTMLMessage id="propro.console_public_lib" />,
          number: public_lib_count,
          name_link: "library/public_library",
          add: "",
          list: "public_standard_library/list"
        },
        {
          key: "public_irt_count",
          name: <FormattedHTMLMessage id="propro.console_public_irt" />,
          number: public_irt_count,
          name_link: "library/public_library",
          add: "",
          list: "public_irt_standard_library/list"
        },
        {
          key: "lib_count",
          name: <FormattedHTMLMessage id="propro.console_lib" />,
          number: lib_count,
          name_link: "standard_library",
          add: "/standard_library_create",
          list: "standard_library/list"
        },
        {
          key: "irt_lib_count",
          name: <FormattedHTMLMessage id="propro.console_irt_lib" />,
          number: irt_lib_count,
          name_link: "irt_standard_library/list",
          add: "home",
          list: "irt_standard_library/list"
        },
        {
          key: "exp_swath_count",
          name: <FormattedHTMLMessage id="propro.console_exp_swath" />,
          number: exp_swath_count,
          name_link: "library/public_library",
          add: "home",
          list: "home"
        },
        {
          key: "exp_prm_count",
          name: <FormattedHTMLMessage id="propro.console_exp_prm" />,
          number: exp_prm_count,
          name_link: "library/public_library",
          add: "home",
          list: "home"
        },
        {
          key: "project_count",
          name: <FormattedHTMLMessage id="propro.console_project" />,
          number: project_count,
          name_link: "library/public_library",
          add: "",
          list: "home"
        },
        {
          key: "overview_count",
          name: <FormattedHTMLMessage id="propro.console_overview" />,
          number: overview_count,
          name_link: "analysis/list",
          add: "",
          list: "analysis/list"
        },
        {
          key: "task_running_count",
          name: <FormattedHTMLMessage id="propro.console_task_running" />,
          number: task_running_count,
          name_link: "library/public_library",
          add: "",
          list: "task/list"
        }
      ]
    });
  };

  render() {
    // 监控 resource_list 数据变化
    if (0 != this.props.resource_list_time) {
      // 资源有更新
      this.handle_resource_list();
    }

    const columns = [
      {
        title: (
          <span
            style={{
              fontSize: "16px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            名称
          </span>
        ),
        key: "name",
        render: text => (
          <Link to={text.name_link}>
            <span
              style={{
                fontSize: "14px"
              }}
            >
              {text.name}
            </span>
          </Link>
        )
      },
      {
        title: (
          <span
            style={{
              fontSize: "16px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            数量
          </span>
        ),
        dataIndex: "number",
        key: "number",
        render: number => (
          <span
            style={{
              fontWeight: "600"
            }}
          >
            {number}
          </span>
        )
      },
      {
        title: (
          <span
            style={{
              fontSize: "16px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            操作
          </span>
        ),
        key: "action",
        render: (text, record) => (
          <span>
            {"" != text.add && (
              <Tooltip title="标准库列表">
                <Link to={"/" + text.add}>
                  <button
                    type="button"
                    className={"btn " + `${styles.bg_second_color}`}
                    style={{
                      padding: "5px 10px",
                      marginLeft: "10px"
                    }}
                  >
                    <img
                      src={add_svg}
                      style={{
                        height: "20px"
                      }}
                    />
                  </button>
                </Link>
              </Tooltip>
            )}
            {/* 显示分割线 */}
            {"" != text.add && "" != text.list && <Divider type="vertical" />}
            {"" != text.list && (
              <Tooltip title="标准库列表">
                <Link to={"/" + text.list}>
                  <button
                    type="button"
                    className={"btn " + `${styles.bg_primary_color}`}
                    style={{
                      padding: "5px 10px",
                      marginLeft: "10px"
                    }}
                  >
                    <img
                      src={unordered_list_svg}
                      style={{
                        height: "20px"
                      }}
                    />
                  </button>
                </Link>
              </Tooltip>
            )}
          </span>
        )
      }
    ];

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
          <FormattedHTMLMessage id="propro.console_resource_title" />
        </div>
        <Table
          columns={columns}
          dataSource={this.state.resource_list_data}
          loading={false}
          style={{
            background: "#ffffff"
          }}
        />
      </div>
    );
  }
}

export default Console;
