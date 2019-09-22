// src/pages/propro/library/standard_library.js
// 公共标准库

/***
 * @Author              TangTao https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @CreateTime          2019-8-25 18:25:38
 * @UpdateTime          2019-9-2 21:59:18
 * @Archive             标准库
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

/***********  standard_library View 初始化   ***************/
/***********  standard_library View 初始化   ***************/

const standard_library_state_to_props = state => {
  // 发送的对象
  let obj = {};

  // 先从 models 里读取 是否显示登录  当前语言
  const language = state["language"].language;
  if ("undefined" != typeof language) {
    obj.language = language;
  }

  let {
    standard_library_list_status = -1,
    standard_library_list_time = 0,
    current_page,
    total_page,
    library_list,
    standard_library_set_public_time,
    standard_library_set_public_status
  } = state["standard_library"];

  (obj.standard_library_set_public_status = standard_library_set_public_status),
    (obj.standard_library_set_public_time = standard_library_set_public_time),
    (obj.standard_library_list_status = standard_library_list_status),
    (obj.standard_library_list_time = standard_library_list_time),
    (obj.current_page = current_page),
    (obj.total_page = total_page),
    (obj.library_list = library_list);

  return obj;
};

const standard_library_dispatch_to_props = dispatch => {
  return {
    // 更新触发器
    get_standard_library_list: () => {
      const action = {
        type: "standard_library/get_standard_library_list",
        payload: null
      };
      dispatch(action);
    },
    set_state_newvalue: data => {
      const action = {
        type: "standard_library/set_state_newvalue",
        payload: data
      };
      dispatch(action);
    },
    set_library_public_by_id: data => {
      const action = {
        type: "standard_library/set_library_public_by_id",
        payload: data
      };
      dispatch(action);
    }
  };
};

/***********  standard_library View 初始化 end  ***************/

@connect(
  standard_library_state_to_props,
  standard_library_dispatch_to_props
)
class Standard_library extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 查询标准库的次数
      query_standard_library_list_times: 0,
      //   查询到的标准库数据
      standard_library_list_data: [],
      // 默认没有数据 状态为 -1 这个变量 暂时用不着 但是后续扩展会用到
      standard_library_list_status: -1,
      search_text: ""
      //   language: this.props.language
    };

    this.props.get_standard_library_list();
    // 配置 message
    message.config({
      top: 500,
      duration: 2,
      maxCount: 5,
      getContainer: () => document.body
    });
  }

  handle_standard_library_list = () => {
    setTimeout((i = this.state.query_standard_library_list_times) => {
      this.setState({ query_standard_library_list_times: i + 1 });
    }, 230);
    // 时间戳设置为 0
    this.props.set_state_newvalue({
      target: "standard_library_list_time",
      value: 0
    });

    // 检查状态
    if (0 == this.props.standard_library_list_status) {
      // 数据获取成功
      setTimeout(() => {
        // 调用 添加更新数据函数
        this.change_standard_library_list_data(this.props);
        // 添加服务端数据
        this.setState({
          // 标记 成功
          standard_library_list_status: 0
        });
      }, 200);
    } else {
      // 数据获取失败
      setTimeout(() => {
        this.setState({
          standard_library_list_status: -1
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

  change_standard_library_list_data = obj => {
    //   提取 model 层 传过来的数据
    const { current_page, total_page, library_list } = obj;
    let obj_data = new Array();
    let index = 1;
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
      obj_temp.index = index++;
      obj_temp.key = "library_list_" + i;
      obj_temp.name = name;
      obj_temp.is_public = doPublic;
      obj_temp.creator = creator;

      // 转换时间戳为指定的日期格式
      obj_temp.create_date = tao.format_time(createDate);
      // 蛋白质数目
      obj_temp.protein_count = proteinCount;
      // 肽段数目
      obj_temp.total_count = totalCount;
      obj_data.push(obj_temp);
    }

    this.setState({
      standard_library_list_data: obj_data
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
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          <FormattedHTMLMessage id="propro.standard_library_search" />
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          <FormattedHTMLMessage id="propro.standard_library_reset" />
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

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ search_text: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ search_text: "" });
  };

  set_this_public = (id = "", status) => {
    let { language } = this.props;
    if (false == status && 5 < id.length) {
      // 调用 公开标准库接口
      // 提示
      message.loading(
        Languages[language]["propro.standard_library_set_public"] +
          " : " +
          Languages[language]["propro.prompt_running"],
        0.5
      );
      this.props.set_library_public_by_id({ id: id });
    } else {
      // 不需要更新
      message.info(
        Languages[language]["propro.standard_library_set_public"] +
          " : " +
          Languages[language]["propro.prompt_cancel"],
        1
      );
      return -1;
    }
  };

  handle_standard_library_set_public = () => {
    // 时间戳设置为 0
    this.props.set_state_newvalue({
      target: "standard_library_set_public_time",
      value: 0
    });

    // 提取返回状态
    let { standard_library_set_public_status, language } = this.props;

    if (0 == standard_library_set_public_status) {
      // 更新成功
      setTimeout(() => {
        this.setState({ standard_library_list_status: -1 });
      }, 800);
      setTimeout(() => {
        // 调用重新获取数据接口 注意演示 防止过度刷新请求
        this.props.get_standard_library_list();
      }, 1100);

      setTimeout(() => {
        // 提示
        message.success(
          Languages[language]["propro.standard_library_set_public"] +
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
          Languages[language]["propro.standard_library_set_public"] +
            " : " +
            Languages[language]["propro.prompt_failed"],
          4
        );
      }, 520);
    }
  };

  render() {
    const columns = [
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
            <FormattedHTMLMessage id="propro.standard_library_index" />
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
            <FormattedHTMLMessage id="propro.standard_library_name" />
          </span>
        ),
        key: "name",
        ...this.get_column_search_props("name"),
        render: list => {
          return (
            <Link to={"/library/standard_library/detail/" + list.id}>
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
            <FormattedHTMLMessage id="propro.standard_library_id" />
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
            <FormattedHTMLMessage id="propro.standard_library_is_public" />
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
            <FormattedHTMLMessage id="propro.standard_library_protein_count" />
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
            <FormattedHTMLMessage id="propro.standard_library_protein_count" />
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
            <FormattedHTMLMessage id="propro.standard_library_create_time" />
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
            <FormattedHTMLMessage id="propro.standard_library_creator" />
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
            <FormattedHTMLMessage id="propro.standard_library_operation" />
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
                  <FormattedHTMLMessage id="propro.standard_library_detail" />
                }
              >
                <Link to={"/library/standard_library/detail/" + list.id}>
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
                  <FormattedHTMLMessage id="propro.standard_library_update" />
                }
              >
                <Link
                  to={
                    "/library/standard_library/update/" +
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
                  <FormattedHTMLMessage id="propro.standard_library_set_public" />
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

    // 监控 standard_library_list 数据变化
    if (0 != this.props.standard_library_list_time) {
      // 资源有更新
      this.handle_standard_library_list();
    }

    if (0 != this.state.standard_library_list_status) {
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

    if (10000 < this.props.standard_library_set_public_time) {
      this.handle_standard_library_set_public();
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
          <FormattedHTMLMessage id="propro.standard_library_title" />
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
            columns={columns}
            pagination={{
              position: "bottom",
              hideOnSinglePage: true
            }}
            dataSource={this.state.standard_library_list_data}
          />
        </div>
      </div>
    );
  }
}

export default Standard_library;
