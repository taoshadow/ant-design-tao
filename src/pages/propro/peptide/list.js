// /src/pages/propro/peptide/list.js

// 肽段列表

/***
 * @Author              TangTao https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @CreateTime          2019-8-30 14:59:05
 * @UpdateTime          2019-8-28 22:17:29
 * @Archive             肽段列表  公共标准库 标准库 irt 共用
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
  Timeline,
  InputNumber,
  Slider
} from "antd";
const { TextArea } = Input;
const { Option } = Select;
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

/***********  peptide_list View 初始化   ***************/
/***********  peptide_list View 初始化   ***************/

const peptide_list_state_to_props = state => {
  let obj = {};

  // 先从 models 里读取 是否显示登录  当前语言
  const language = state["language"].language;
  if ("undefined" != typeof language) {
    obj.language = language;
  }

  let {
    peptide_list_data,
    peptide_list_time,
    peptide_list_data_status
  } = state["peptide_list"];

  (obj.peptide_list_data = peptide_list_data),
    (obj.peptide_list_time = peptide_list_time),
    (obj.peptide_list_data_status = peptide_list_data_status);
  return obj;
};

const peptide_list_dispatch_to_props = dispatch => {
  return {
    // 更新触发器
    query_peptide_list: data => {
      const action = {
        type: "peptide_list/query_peptide_list",
        payload: data
      };
      dispatch(action);
    },
    set_state_newvalue: data => {
      const action = {
        type: "peptide_list/set_state_newvalue",
        payload: data
      };
      dispatch(action);
    }
  };
};

/***********  peptide_list View 初始化 end  ***************/

@connect(
  peptide_list_state_to_props,
  peptide_list_dispatch_to_props
)
class Peptide_list extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 库id
      peptide_list_id: null,
      // 库名称
      peptide_list_name: null,
      // 默认没有数据 状态为 -1  出错 -2 成功 0
      peptide_list_data_status: -1,
      // 所有的库 用来让用户进行选择
      peptide_list_all_librarys: null,
      // 查询得到并且解析格式化的肽段列表表格数据
      peptide_list_table_data: null,
      // 表格搜索内容
      search_text: null,
      // 页面大小 通过调整它来设置
      page_size: null,
      total_numbers: null,
      load_percentage_value: 0,
      // 记录查询的时间
      task_list_query_time: null
    };

    // 配置 message
    message.config({
      top: 500,
      duration: 2,
      maxCount: 5,
      getContainer: () => document.body
    });

    setTimeout(() => {
      // 获取当前肽段的 id
      this.get_current_peptide_list_id();
    }, 300);
  }

  get_current_peptide_list_id = () => {
    // /library/peptide/list/5d0848fee0073c6ffc69752d
    let url = this.props.history.location.pathname;
    // 提取 id
    let index = url.lastIndexOf("/");
    let id = url.substring(index + 1, url.length);
    this.props.query_peptide_list({ id: id });
    setTimeout(() => {
      // 写入 id
      this.setState({
        peptide_list_id: id
      });
    }, 120);
  };

  // 处理新的肽段资源
  handle_peptide_list = () => {
    // 首先时间戳归零
    this.props.set_state_newvalue({
      target: "peptide_list_time",
      value: 0
    });
    let { peptide_list_data_status, language, peptide_list_data } = this.props;

    if (0 == peptide_list_data_status) {
      //   成功
      setTimeout(() => {
        // 提取所有库
        let {
          libraries,
          peptideList: peptide_list,
          totalNumbers: total_numbers,
          pageSize: page_size
        } = peptide_list_data;
        let { length: len } = libraries;
        let librarys_arr = null;

        // 防止踩空
        if (0 < len) {
          librarys_arr = new Array(len);

          for (let i = 0; i < len; i++) {
            librarys_arr[i] = (
              <Option key={libraries[i].id} value={libraries[i].id}>
                {libraries[i].name}
              </Option>
            );
          }
        }

        let { length: len1 } = peptide_list;

        let load_percentage_value = -1;
        // 处理肽段表格数据
        let obj_table = null;
        if (0 < len1) {
          obj_table = new Array(len1);
          let obj_temp = {};
          /*
          charge: 3
          decoyFragmentMap: {b4: {…}, b5: {…}, y5: {…}, y6: {…}, y7: {…}, …}
          decoySequence: "NIATIVLSFNEEQYNK"
          decoyUnimodMap: {}
          fragmentMap: {b4: {…}, b5: {…}, y5: {…}, y6: {…}, y7: {…}, …}
          fullName: "EQNIVFNAETYSNLIK"
          id: "5d084f24e0073ca454d2cac5"
          isUnique: true
          libraryId: "5d0848fee0073c6ffc69752d"
          mz: 628.323024087333
          peptideRef: "EQNIVFNAETYSNLIK_3"
          proteinName: "1/sp|P42704|LPPRC_HUMAN"
          rt: 84.2
          sequence: "EQNIVFNAETYSNLIK"
            */
          for (let i = 0; i < len1; i++) {
            let {
              charge,
              decoyFragmentMap,
              decoySequence,
              fragmentMap,
              fullName,
              id,
              isUnique,
              libraryId,
              mz,
              peptideRef,
              proteinName,
              rt,
              sequence
            } = peptide_list[i];

            // 重命名  因为防止后面表格处理时命名混乱 同时还可以二次处理数据 便于扩展
            (obj_temp.key = i),
              (obj_temp.charge = charge),
              (obj_temp.decoy_fragment_map = decoyFragmentMap),
              (obj_temp.decoy_sequence = decoySequence),
              (obj_temp.fragment_map = fragmentMap),
              (obj_temp.fullname = fullName),
              (obj_temp.id = id),
              (obj_temp.is_unique = isUnique),
              (obj_temp.library_id = libraryId),
              (obj_temp.mz = mz),
              (obj_temp.peptide_ref = peptideRef),
              (obj_temp.protein_name = proteinName),
              (obj_temp.rt = rt),
              // 肽段序列
              (obj_temp.sequence = sequence),
              (obj_table[i] = obj_temp),
              (obj_temp = {});
          }
          // 计算出加载的百分比
          load_percentage_value = Math.ceil((len1 / total_numbers) * 100);
        }

        // 最后把处理过得数据提交到状态
        this.setState({
          peptide_list_data_status: 0,
          peptide_list_name: peptide_list_data.libraryInfo.name,
          peptide_list_id: peptide_list_data.libraryInfo.id,
          peptide_list_table_data: obj_table,
          peptide_list_all_librarys: librarys_arr,
          load_percentage_value: load_percentage_value,
          page_size: page_size,
          total_numbers: total_numbers,
          task_list_query_time: tao.current_format_time()
        });
      }, 200);
    } else {
      //   数据获取失败
      Modal.error({
        title: "False",
        content: Languages[language]["propro.network_error"],
        okText: Languages[language]["propro.user_modal_know"]
      });
      // 过一段时间 尝试再次连接服务器 这个时间要稍微长一点 用户体验会比较好
      setTimeout(() => {
        this.get_current_peptide_list_id();
      }, 15000);
    }
  };

  change_search_peptide_list_id = id => {
    //
    if (5 > id.length) {
      return -1;
    }

    //  写入状态
    this.setState({
      peptide_list_id: id
    });
  };

  handle_query_peptide_list_by_id = () => {
    let {
      peptide_list_id: id,
      load_percentage_value,
      page_size,
      total_numbers
    } = this.state;

    // 读取加载进度

    let new_page_size = null;

    new_page_size = Math.ceil((total_numbers * load_percentage_value) / 100);

    if (1 == load_percentage_value) {
      // 注意 这里 1% 还有可能是用户没有设置
      // 所以如果计算出的结果大于1000 就使用1000 大于1%就不考虑
      // 这样做的目的也是为了性能考虑
      // 这个1000 是服务器的默认页大小
      new_page_size = 1000 < new_page_size ? 1000 : new_page_size;
    }

    // 限制最小 page_size
    let min_size = 30;
    // 得出真正的 value 即新的 page_size
    // new_page_size = min_size >= new_page_size ? min_size : new_page_size;

    //   调用查询接口
    this.props.query_peptide_list({ id: id, page_size: new_page_size });
    //  写入状态
    this.setState({
      peptide_list_id: id,
      peptide_list_data_status: -1
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
          <FormattedHTMLMessage id="propro.standard_library_list_search" />
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          <FormattedHTMLMessage id="propro.standard_library_list_reset" />
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

  render() {
    if (10000 < this.props.peptide_list_time) {
      // 传入了新状态
      this.handle_peptide_list();
    }

    if (0 != this.state.peptide_list_data_status) {
      // 说明还没有可以使用的数据 提示加载 ...
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

    let { peptide_list_data: data } = this.props;
    let {
      peptide_list_table_data,
      load_percentage_value,
      task_list_query_time
    } = this.state;

    if (null == peptide_list_table_data) {
      peptide_list_table_data = [];
    }

    // 计算出详情
    let library_type =
      0 == data.libraryInfo.type ? "public_library" : "standard_library";

    //   配置表格
    const columns = [
      {
        // 标准库id
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            No
          </span>
        ),
        dataIndex: "key",
        key: "key",
        ...this.get_column_search_props("key"),
        render: list => {
          return (
            <span
              className={styles.font_green_color}
              style={{
                fontSize: "8px"
              }}
            >
              {list + 1}
            </span>
          );
        }
      },
      {
        // 标准库名称
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            蛋白质名称
          </span>
        ),
        key: "protein_name",
        ...this.get_column_search_props("protein_name"),
        render: list => {
          return (
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
              <Link
                to={
                  "/peptide/detail/" +
                  this.state.peptide_list_id +
                  "/" +
                  list.id
                }
              >
                {list.protein_name}
              </Link>
            </div>
          );
        }
      },

      {
        //   	肽段荷质比MZ
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            肽段荷质比MZ
          </span>
        ),
        dataIndex: "mz",
        key: "mz",
        ...this.get_column_search_props("mz"),
        render: list => {
          return (
            <span
              className={styles.font_green_color}
              style={{
                fontSize: "8px"
              }}
            >
              {list}
            </span>
          );
        }
      },
      {
        // RT
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            RT
          </span>
        ),
        dataIndex: "rt",
        key: "rt",
        ...this.get_column_search_props("rt"),
        render: list => {
          return (
            <span
              className={styles.font_green_color}
              style={{
                fontSize: "8px"
              }}
            >
              {list}
            </span>
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
            PeptideRef
          </span>
        ),
        dataIndex: "peptide_ref",
        key: "peptide_ref11111",
        ...this.get_column_search_props("peptide_ref"),
        render: data => {
          return (
            <div
              style={{
                fontSize: "8px",
                wordWrap: "break-word",
                wordBreak: "break-all",
                minWidth: "200px",
                maxWidth: "200px"
              }}
            >
              {data}
            </div>
          );
        }
      },
      {
        // 	肽段序列
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            肽段序列
          </span>
        ),
        dataIndex: "sequence",
        key: "sequence",
        ...this.get_column_search_props("sequence"),
        render: data => {
          return (
            <div
              style={{
                fontSize: "8px",
                wordWrap: "break-word",
                wordBreak: "break-all",
                minWidth: "200px",
                maxWidth: "200px"
              }}
            >
              {data}
            </div>
          );
        }
      },
      {
        // 	肽段序列
        title: (
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              letterSpacing: "1px"
            }}
          >
            伪肽段
          </span>
        ),
        dataIndex: "decoy_sequence",
        key: "decoy_sequence",
        ...this.get_column_search_props("decoy_sequence"),
        render: data => {
          return (
            <div
              style={{
                fontSize: "8px",
                wordWrap: "break-word",
                wordBreak: "break-all",
                minWidth: "200px",
                maxWidth: "200px"
              }}
            >
              {data}
            </div>
          );
        }
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
          <FormattedHTMLMessage id="propro.peptide_list_title" />
        </div>

        <Row>
          <Col lg={24} xl={24} xxl={24}>
            <Col span={24}>
              <div
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
                    <FormattedHTMLMessage id="propro.peptide_list_library_information" />
                  }
                >
                  <Descriptions.Item
                    label={
                      <FormattedHTMLMessage id="propro.peptide_list_name" />
                    }
                  >
                    <Tooltip
                      placement="right"
                      title={
                        <FormattedHTMLMessage id="propro.peptide_list_see_detail" />
                      }
                    >
                      <Link
                        to={
                          "/library/" +
                          library_type +
                          "/detail/" +
                          data.libraryInfo.id
                        }
                      >
                        <span
                          className={
                            "badge " +
                            styles.font_white_color +
                            " " +
                            styles.bg_green_color
                          }
                          style={{
                            padding: "5px 8px"
                          }}
                        >
                          {data.libraryInfo.name}
                        </span>
                      </Link>
                    </Tooltip>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={<FormattedHTMLMessage id="propro.peptide_list_id" />}
                  >
                    <span className={styles.font_primary_color}>
                      {data.libraryInfo.id}
                    </span>
                  </Descriptions.Item>

                  {/* 搜索用时 */}
                  <Descriptions.Item
                    label={
                      <FormattedHTMLMessage id="propro.peptide_list_search_time" />
                    }
                  >
                    <span className={styles.font_primary_color}>
                      {data.searchTime}
                    </span>
                    &nbsp;ms
                  </Descriptions.Item>

                  {/* 查询时间 */}
                  <Descriptions.Item
                    label={
                      <FormattedHTMLMessage id="propro.peptide_list_load_time" />
                    }
                  >
                    <span className={styles.font_primary_color}>
                      {task_list_query_time}
                    </span>
                  </Descriptions.Item>

                  {/* 已经加载的页数 */}
                  <Descriptions.Item
                    label={
                      <FormattedHTMLMessage id="propro.peptide_list_load_numbers" />
                    }
                  >
                    <span
                      className={
                        0 >= peptide_list_table_data.length
                          ? styles.font_red_color
                          : styles.font_primary_color
                      }
                    >
                      {peptide_list_table_data.length}
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item
                    label={
                      <FormattedHTMLMessage id="propro.peptide_list_total_numbers" />
                    }
                  >
                    <span
                      className={
                        0 == data.totalNumbers
                          ? styles.font_red_color
                          : styles.font_primary_color
                      }
                    >
                      {data.totalNumbers}
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
                      <FormattedHTMLMessage id="propro.peptide_list_load_percentage" />
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

                <div>
                  <FormattedHTMLMessage id="propro.peptide_list_search_by_name_title" />
                  &nbsp;:&nbsp;&nbsp;
                  <Select
                    showSearch
                    style={{ width: "300px" }}
                    placeholder={
                      <FormattedHTMLMessage id="propro.peptide_list_search_by_name" />
                    }
                    onChange={this.change_search_peptide_list_id}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.state.peptide_list_all_librarys}
                  </Select>
                  <Button
                    type="primary"
                    style={{
                      padding: "0px 15px",
                      margin: "0px 50px 0px 10px",
                      height: "32px",
                      lineHeight: "32px"
                    }}
                    name="password"
                    onClick={this.handle_query_peptide_list_by_id}
                  >
                    <span>
                      &nbsp;
                      <FormattedHTMLMessage id="propro.peptide_list_search" />
                    </span>
                  </Button>
                </div>
                <div style={{ margin: "10px 0px" }}>
                  简略模式&nbsp;: &nbsp; &nbsp;
                  <Switch
                    checkedChildren={<Icon type="check" />}
                    unCheckedChildren={<Icon type="close" />}
                  />
                </div>
              </div>
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
                columns={columns}
                pagination={{
                  position: "top",
                  hideOnSinglePage: true,
                  defaultPageSize: 100
                }}
                style={{
                  fontSize: "8px"
                }}
                key="2019-8-30 22:45:51"
                dataSource={this.state.peptide_list_table_data}
              />
            </Col>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Peptide_list;
