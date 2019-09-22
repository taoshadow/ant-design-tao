// src/pages/propro/library/public_library.js
// 公共标准库

/***
 * @Author              TangTao https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @CreateTime          2019-8-14 23:48:57
 * @UpdateTime          2019-8-16 01:05:41
 * @Archive             公共标准库
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
import proteins_list_svg from "../style/static/library/list.svg";
import unordered_list_svg from "../style/static/dashboard/unordered_list.svg";
import return_svg from "../style/static/dashboard/return.svg";
import preloader_svg from "../style/static/dashboard/preloader.svg";

/****************  导入 styles end ***************************/

/***********  public_library View 初始化   ***************/
/***********  public_library View 初始化   ***************/

const public_library_state_to_props = state => {
  // 发送的对象
  let obj = {};

  // 先从 models 里读取 是否显示登录  当前语言
  const language = state["language"].language;
  if ("undefined" != typeof language) {
    obj.language = language;
  }

  let {
    public_library_list_status = -1,
    public_library_list_time = 0,
    current_page,
    total_page,
    library_list
  } = state["public_library"];

  (obj.public_library_list_status = public_library_list_status),
    (obj.public_library_list_time = public_library_list_time),
    (obj.current_page = current_page),
    (obj.total_page = total_page),
    (obj.library_list = library_list);
  return obj;
};

const public_library_dispatch_to_props = dispatch => {
  return {
    // 更新触发器
    get_public_library_list: () => {
      const action = {
        type: "public_library/get_public_library_list",
        payload: null
      };
      dispatch(action);
    },
    set_state_newvalue: data => {
      const action = {
        type: "public_library/set_state_newvalue",
        payload: data
      };
      dispatch(action);
    }
  };
};

/***********  public_library View 初始化 end  ***************/

@connect(
  public_library_state_to_props,
  public_library_dispatch_to_props
)
class Public_library extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query_public_library_list_times: 0,
      public_library_list_data: [],
      // 默认没有数据 状态为 -1 这个变量 暂时用不着 但是后续扩展会用到
      public_library_list_status: -1,
      searchText: ""
      //   language: this.props.language
    };

    this.props.get_public_library_list();
  }

  handle_public_library_list = () => {
    setTimeout((i = this.state.query_public_library_list_times) => {
      this.setState({ query_public_library_list_times: i + 1 });
    }, 230);
    // 时间戳设置为 0
    this.props.set_state_newvalue({
      target: "public_library_list_time",
      value: 0
    });

    // 检查状态
    if (0 == this.props.public_library_list_status) {
      // 数据获取成功
      setTimeout(() => {
        // 调用 添加更新数据函数
        this.change_public_library_list_data(this.props);
        // 添加服务端数据
        this.setState({
          // 标记 成功
          public_library_list_status: 0
        });
      }, 200);
    } else {
      // 数据获取失败
      setTimeout(() => {
        this.setState({
          public_library_list_status: -1
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

  change_public_library_list_data = obj => {
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
      public_library_list_data: obj_data
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
          <FormattedHTMLMessage id="propro.public_library_search" />
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          <FormattedHTMLMessage id="propro.public_library_reset" />
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
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    )
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: "" });
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
            <FormattedHTMLMessage id="propro.public_library_index" />
          </span>
        ),
        dataIndex: "index",
        key: "index"
        // width: "30%",
        // ...this.get_column_search_props("id")
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
            <FormattedHTMLMessage id="propro.public_library_name" />
          </span>
        ),
        // dataIndex: "name",
        key: "name",
        // width: "20%"
        ...this.get_column_search_props("name"),
        render: list => {
          return (
            <Link to={"/library/public_library/detail/" + list.id}>
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
            <FormattedHTMLMessage id="propro.public_library_id" />
          </span>
        ),
        dataIndex: "id",
        key: "id",
        // width: "30%",
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
            <FormattedHTMLMessage id="propro.public_library_is_public" />
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
            <FormattedHTMLMessage id="propro.public_library_protein_count" />
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
            <FormattedHTMLMessage id="propro.public_library_protein_count" />
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
            <FormattedHTMLMessage id="propro.public_library_create_time" />
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
            <FormattedHTMLMessage id="propro.public_library_creator" />
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
            <FormattedHTMLMessage id="propro.public_library_operation" />
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
                  <FormattedHTMLMessage id="propro.public_library_detail" />
                }
              >
                <Link to={"/library/public_library/detail/" + list.id}>
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

              {/* 肽段列表链接 */}
              <Tooltip
                title={
                  <FormattedHTMLMessage id="propro.public_library_peptides_list" />
                }
              >
                <Link to={"/peptide/list/" + list.id}>
                  <button
                    type="button"
                    className={"btn " + `${styles.bg_primary_color}`}
                    style={{
                      padding: "5px 10px",
                      margin: "5px"
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

              {/* 蛋白列表链接 */}
              <Tooltip
                title={
                  <FormattedHTMLMessage id="propro.public_library_protein_list" />
                }
              >
                <Link to={"/protein/list/" + list.id}>
                  <button
                    type="button"
                    className={"btn " + `${styles.bg_green_color}`}
                    style={{
                      padding: "5px 10px",
                      margin: "5px"
                    }}
                  >
                    <img
                      src={proteins_list_svg}
                      style={{
                        height: "20px"
                      }}
                    />
                  </button>
                </Link>
              </Tooltip>
            </Fragment>
          );
        }
      }
    ];

    // 监控 public_library_list 数据变化
    if (0 != this.props.public_library_list_time) {
      // 资源有更新
      this.handle_public_library_list();
    }

    if (0 != this.state.public_library_list_status) {
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
          <FormattedHTMLMessage id="propro.public_library_title" />
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
            dataSource={this.state.public_library_list_data}
          />
        </div>
      </div>
    );
  }
}

export default Public_library;
