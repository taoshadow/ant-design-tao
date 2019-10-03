// src/pages/propro/irt_library/list.js
// irt 标准库 列表

/***
 * @Author              TangTao https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-9-3 21:40:02
 * @UpdateTime          2019-9-4 15:28:14
 * @Archive             irt 库 列表
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
import detail_svg from "../style/static/library/detail.svg";
import public_library_scg from "../style/static/library/public.svg";
import update_library_svg from "../style/static/library/update.svg";
import return_svg from "../style/static/dashboard/return.svg";
import preloader_svg from "../style/static/dashboard/preloader.svg";

/****************  导入 styles end ***************************/

/***********  irt_standard_library View 初始化   ***************/
/***********  irt_standard_library View 初始化   ***************/

const irt_standard_library_state_to_props = state => {
  // 发送的对象
  let obj = {};

  // 先从 models 里读取 是否显示登录  当前语言
  const language = state["language"].language;
  if ("undefined" != typeof language) {
    obj.language = language;
  }

  let {
    irt_standard_library_list_status = -1,
    irt_standard_library_list_time = 0,
    irt_standard_library_list_data = {},
    // 设置更新的状态标记
    irt_standard_library_list_set_public_status,
    irt_standard_library_list_set_public_time
  } = state["irt_standard_library_list"];

  (obj.irt_standard_library_list_set_public_status = irt_standard_library_list_set_public_status),
    (obj.irt_standard_library_list_set_public_time = irt_standard_library_list_set_public_time),
    (obj.irt_standard_library_list_status = irt_standard_library_list_status),
    (obj.irt_standard_library_list_time = irt_standard_library_list_time),
    (obj.irt_standard_library_list_data = irt_standard_library_list_data);

  return obj;
};

const irt_standard_library_dispatch_to_props = dispatch => {
  return {
    // 更新触发器
    get_irt_standard_library_list: () => {
      const action = {
        type: "irt_standard_library_list/get_irt_standard_library_list",
        payload: null
      };
      dispatch(action);
    },
    set_state_newvalue: data => {
      const action = {
        type: "irt_standard_library_list/set_state_newvalue",
        payload: data
      };
      dispatch(action);
    },
    set_library_public_by_id: data => {
      const action = {
        type: "irt_standard_library_list/set_library_public_by_id",
        payload: data
      };
      dispatch(action);
    }
  };
};

/***********  irt_standard_library View 初始化 end  ***************/

@connect(
  irt_standard_library_state_to_props,
  irt_standard_library_dispatch_to_props
)
class Irt_standard_library_list extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //   查询到的标准库数据
      irt_standard_library_list_data: [],
      // 默认没有数据 状态为 -1 这个变量 暂时用不着 但是后续扩展会用到
      irt_standard_library_list_status: -1,
      // 请求失败再次发起请求的尝试次数
      irt_standard_library_list_false_time: 5,
      search_text: ""
      //   language: this.props.language
    };

    // 查询 irt 列表
    this.props.get_irt_standard_library_list();

    // 配置 message
    message.config({
      top: 500,
      duration: 2,
      maxCount: 5,
      getContainer: () => document.body
    });
  }

  handle_irt_standard_library_list = () => {
    // 时间戳设置为 0
    this.props.set_state_newvalue({
      target: "irt_standard_library_list_time",
      value: 0
    });

    // 检查状态
    if (0 == this.props.irt_standard_library_list_status) {
      // 数据获取成功
      setTimeout(() => {
        // 调用 添加更新数据函数
        this.change_irt_standard_library_list_data();
        // 添加服务端数据
        this.setState({
          // 标记 成功
          irt_standard_library_list_false_time: 5,
          // 标记数据为可用的状态
          irt_standard_library_list_status: 0
        });
      }, 200);
    } else {
      // 数据获取失败
      // 1-弹出警告
      Modal.error({
        title: "False",
        content: Languages[this.props.language]["propro.network_error"],
        okText: Languages[this.props.language]["propro.user_modal_know"]
      });
      // 过一段时间 尝试再次连接服务器 这个时间要稍微长一点 用户体验会比较好
      let { irt_standard_library_list_false_time } = this.state;
      // 2-判断是否需要再次发起请求
      if (0 >= irt_standard_library_list_false_time) {
        console.error(
          "@Author:tangtao; 系统已终止运行,请重新刷新页面; ",
          "初步诊断:未能成功连接到 propro-server 的服务器或者未能成功解析返回的数据"
        );
        // 终止发送
        return -1;
      }

      // 写入新的请求失败参数
      setTimeout(() => {
        this.setState({
          irt_standard_library_list_false_time: irt_standard_library_list_false_time--
        });
      }, 120);

      return -1;
    }

    return 0;
  };

  change_irt_standard_library_list_data = () => {
    //   提取 model 层 传过来的数据
    const {
      libraryList: library_list,
      totalPage: total_page,
      pageSize: page_size,
      currentPage: current_page
    } = this.props.irt_standard_library_list_data;

    let { length: len0 } = library_list;
    let obj_data = null;
    if (0 < len0) {
      obj_data = new Array(len0);
      let index = 0;
      for (let i in library_list) {
        // 提取
        let {
          id,
          name,
          doPublic,
          creator,
          createDate,
          proteinCount,
          totalCount
        } = library_list[i];

        // 缓存对象
        let obj_temp = {};
        obj_temp.id = id;

        // 添加索引是为了展示方便
        (obj_temp.index = index + 1),
          (obj_temp.key = "irt_library_list_" + i),
          (obj_temp.name = name),
          (obj_temp.is_public = doPublic),
          (obj_temp.creator = creator),
          // 转换时间戳为指定的日期格式
          (obj_temp.create_date = tao.format_time(createDate)),
          // 蛋白质数目
          (obj_temp.protein_count = proteinCount),
          // 肽段数目
          (obj_temp.total_count = totalCount),
          (obj_data[index++] = obj_temp);
      }
    }

    this.setState({
      irt_standard_library_list_data: obj_data
    });

    return 0;
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
          <FormattedHTMLMessage id="propro.irt_standard_library_list_search" />
        </Button>
        <Button
          onClick={() => this.handle_table_reset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          <FormattedHTMLMessage id="propro.irt_standard_library_list_reset" />
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

  set_this_public = (id = "", status) => {
    let { language } = this.props;
    if (false == status && 5 < id.length) {
      // 调用 公开标准库接口
      // 提示
      message.loading(
        Languages[language]["propro.irt_standard_library_list_set_public"] +
          " : " +
          Languages[language]["propro.prompt_running"],
        1
      );
      // 调用 更新接口
      this.props.set_library_public_by_id({ id: id });
    } else {
      // 不需要更新
      message.info(
        Languages[language]["propro.irt_standard_library_list_set_public"] +
          " : " +
          Languages[language]["propro.prompt_cancel"],
        1
      );
      return -1;
    }
  };

  handle_irt_standard_library_list_set_public = () => {
    // 时间戳设置为 0
    this.props.set_state_newvalue({
      target: "irt_standard_library_list_set_public_time",
      value: 0
    });

    // 提取返回状态
    let { irt_standard_library_list_set_public_status, language } = this.props;

    if (0 == irt_standard_library_list_set_public_status) {
      // 更新成功
      // 进入延时刷新
      setTimeout(() => {
        this.setState({ irt_standard_library_list_status: -1 });
      }, 800);
      setTimeout(() => {
        // 调用重新获取数据接口 注意演示 防止过度刷新请求
        this.props.get_irt_standard_library_list();
      }, 1100);

      setTimeout(() => {
        // 提示
        message.success(
          Languages[language]["propro.irt_standard_library_list_set_public"] +
            " : " +
            Languages[language]["propro.prompt_success"],
          2
        );
      }, 520);
    } else {
      // 执行公开 失败
      setTimeout(() => {
        // 提示
        message.error(
          Languages[language]["propro.irt_standard_library_list_set_public"] +
            " : " +
            Languages[language]["propro.prompt_failed"],
          4
        );
      }, 520);
    }
  };

  render() {
    // 定义 解析 配置 表格
    const irt_standard_library_list_table_columns = [
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
            <FormattedHTMLMessage id="propro.irt_standard_library_list_index" />
          </span>
        ),
        dataIndex: "index",
        key: "index"
      },
      {
        //   标准库名称
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.irt_standard_library_list_name" />
          </span>
        ),
        key: "name",
        ...this.get_column_search_props("name"),
        render: list => {
          return (
            <Link to={"/library/irt_standard_library/detail/" + list.id}>
              {list.name}
            </Link>
          );
        }
      },
      {
        //   标准库id
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.irt_standard_library_list_id" />
          </span>
        ),
        dataIndex: "id",
        key: "id",
        ...this.get_column_search_props("id")
      },
      {
        //   是否公开
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.irt_standard_library_list_is_public" />
          </span>
        ),
        dataIndex: "is_public",
        key: "is_public",
        render: text => (
          <span
            style={{
              fontSize: "14px"
            }}
          >
            {true == text ? (
              <span className={`${styles.font_green_color}`}>True</span>
            ) : (
              <span className={`${styles.font_red_color}`}>False</span>
            )}
          </span>
        )
      },
      {
        //   蛋白质数目
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.irt_standard_library_list_protein_count" />
          </span>
        ),
        dataIndex: "protein_count",
        key: "protein_count"
      },
      {
        //   肽段数目
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.irt_standard_library_list_protein_count" />
          </span>
        ),
        dataIndex: "total_count",
        key: "total_count"
      },
      {
        //   创建时间
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.irt_standard_library_list_create_time" />
          </span>
        ),
        dataIndex: "create_date",
        key: "create_date",

        ...this.get_column_search_props("create_date"),
        render: my_date => {
          return <span className={styles.font_primary_color}>{my_date}</span>;
        }
      },
      {
        //   创建者
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.irt_standard_library_list_creator" />
          </span>
        ),
        dataIndex: "creator",
        key: "creator",
        ...this.get_column_search_props("creator")
      },
      {
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            <FormattedHTMLMessage id="propro.irt_standard_library_list_operation" />
          </span>
        ),
        key: "action",
        render: list => {
          // 返回 三个链接
          return (
            <Fragment key="2019-8-16 00:32:54">
              {/* 详情链接 */}
              <Tooltip
                title={
                  <FormattedHTMLMessage id="propro.irt_standard_library_list_detail" />
                }
              >
                <Link to={"/irt_standard_library/detail/" + list.id}>
                  <button
                    type="button"
                    className={"btn " + `${styles.bg_second_color}`}
                    style={{
                      padding: "5px 10px",
                      margin: "5px 5px"
                    }}
                  >
                    <img
                      src={detail_svg}
                      style={{
                        height: "20px"
                      }}
                    />
                  </button>
                </Link>
              </Tooltip>
              {/* 更新标准库链接 */}
              <Tooltip
                title={
                  <FormattedHTMLMessage id="propro.irt_standard_library_list_update" />
                }
              >
                <Link
                  to={
                    "/library/irt_standard_library/update/" +
                    list.id +
                    "_" +
                    list.name
                  }
                >
                  <button
                    type="button"
                    className={"btn " + `${styles.bg_primary_color}`}
                    style={{
                      padding: "5px 10px",
                      margin: "5px"
                    }}
                  >
                    <img
                      src={update_library_svg}
                      style={{
                        height: "20px"
                      }}
                    />
                  </button>
                </Link>
              </Tooltip>
              {/* 肽段列表链接 */}
              <Tooltip
                title={
                  <FormattedHTMLMessage id="propro.irt_standard_library_list_set_public" />
                }
              >
                <button
                  type="button"
                  className={"btn " + `${styles.bg_green_color}`}
                  style={{
                    padding: "5px 10px",
                    margin: "5px"
                  }}
                  onClick={() => {
                    this.set_this_public(list.id, list.is_public);
                  }}
                >
                  <img
                    src={public_library_scg}
                    style={{
                      height: "20px"
                    }}
                  />
                </button>
              </Tooltip>
            </Fragment>
          );
        }
      }
    ];

    // 监控 irt_standard_library_list 数据变化
    if (10000 < this.props.irt_standard_library_list_time) {
      // 资源有更新
      this.handle_irt_standard_library_list();
    }

    if (0 != this.state.irt_standard_library_list_status) {
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

    if (10000 < this.props.irt_standard_library_list_set_public_time) {
      this.handle_irt_standard_library_list_set_public();
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
          <FormattedHTMLMessage id="propro.irt_standard_library_list_title" />
        </div>
        <div
          style={{
            background: "#FFFFFF",
            padding: "5px",
            border: "1px solid #e5e9f2",
            overflow: "auto"
          }}
        >
          <Table
            size={"middle"}
            columns={irt_standard_library_list_table_columns}
            pagination={{
              position: "bottom",
              hideOnSinglePage: true
            }}
            dataSource={this.state.irt_standard_library_list_data}
          />
        </div>
      </div>
    );
  }
}

export default Irt_standard_library_list;
