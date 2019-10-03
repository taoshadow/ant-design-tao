// src/pages/propro/library/public_irt_standard_library_detail.js
// 公共标准库列表id 详情

/***
 * @Author              TangTao  https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-9-7 22:12:01
 * @UpdateTime          2019-9-4 18:12:43
 * @Archive             显示 public_irt 标准库 指定 id 的详情
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
  Tag,
  Descriptions,
  Badge
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
import detail_svg from "../style/static/library/detail.svg";
import proteins_list_svg from "../style/static/library/list.svg";
import unordered_list_svg from "../style/static/dashboard/unordered_list.svg";
import return_svg from "../style/static/dashboard/return.svg";
import preloader_svg from "../style/static/dashboard/preloader.svg";

/****************  导入 styles end ***************************/

/***********  public_irt_standard_library View 初始化   ***************/
/***********  public_irt_standard_library View 初始化   ***************/

const public_irt_standard_library_state_to_props = state => {
  let obj = {};

  // 先从 models 里读取 是否显示登录  当前语言
  const language = state["language"].language;
  if ("undefined" != typeof language) {
    obj.language = language;
  }

  let {
    // 资源列表数据
    // 通过 time 来判断是否更新了数据 通过 status 来判断数据的状态
    // -1 表示没有数据 0 有数据 -2 出错 获取数据失败
    public_irt_standard_library_detail_status,
    // 最新获取数据的时间戳
    public_irt_standard_library_detail_time,
    public_irt_standard_library_detail_data,

    // 生成肽段
    public_irt_standard_library_detail_generate_time,
    public_irt_standard_library_detail_generate_status,
    // 更新状态
    public_irt_standard_library_detail_aggregate_status,
    public_irt_standard_library_detail_aggregate_time,

    // 删除肽段
    public_irt_standard_library_detail_delete_pseudopeptides_status,
    public_irt_standard_library_detail_delete_pseudopeptides_time,

    // 删除库
    public_irt_standard_library_detail_delete_status,
    public_irt_standard_library_detail_delete_time
  } = state["public_irt_standard_library_detail"];

  (obj.public_irt_standard_library_detail_generate_time = public_irt_standard_library_detail_generate_time),
    (obj.public_irt_standard_library_detail_generate_status = public_irt_standard_library_detail_generate_status),
    (obj.public_irt_standard_library_detail_delete_time = public_irt_standard_library_detail_delete_time),
    (obj.public_irt_standard_library_detail_delete_status = public_irt_standard_library_detail_delete_status),
    (obj.public_irt_standard_library_detail_delete_pseudopeptides_time = public_irt_standard_library_detail_delete_pseudopeptides_time),
    (obj.public_irt_standard_library_detail_delete_pseudopeptides_status = public_irt_standard_library_detail_delete_pseudopeptides_status),
    (obj.public_irt_standard_library_detail_aggregate_time = public_irt_standard_library_detail_aggregate_time),
    (obj.public_irt_standard_library_detail_aggregate_status = public_irt_standard_library_detail_aggregate_status),
    (obj.public_irt_standard_library_detail_data = public_irt_standard_library_detail_data),
    (obj.public_irt_standard_library_detail_time = public_irt_standard_library_detail_time),
    (obj.public_irt_standard_library_detail_status = public_irt_standard_library_detail_status);
  return obj;
};

const public_irt_standard_library_dispatch_to_props = dispatch => {
  return {
    // 发起查询
    get_public_irt_standard_library_detail: data => {
      const action = {
        type:
          "public_irt_standard_library_detail/get_public_irt_standard_library_detail",
        payload: data
      };
      dispatch(action);
    },

    // 重新统计
    aggregate: id => {
      const action = {
        type: "public_irt_standard_library_detail/aggregate",
        payload: id
      };
      dispatch(action);
    },

    // 生成伪肽段
    generate: obj => {
      const action = {
        type: "public_irt_standard_library_detail/generate",
        payload: obj
      };
      dispatch(action);
    },

    // 删除肽段
    delete_pseudopeptides: obj => {
      const action = {
        type: "public_irt_standard_library_detail/delete_pseudopeptides",
        payload: obj
      };
      dispatch(action);
    },

    // 删除标准库
    delete_public_irt_standard_library_by_id: obj => {
      const action = {
        type:
          "public_irt_standard_library_detail/delete_public_irt_standard_library_by_id",
        payload: obj
      };
      dispatch(action);
    },

    set_state_newvalue: data => {
      const action = {
        type: "public_irt_standard_library_detail/set_state_newvalue",
        payload: data
      };
      dispatch(action);
    }
  };
};

/***********  public_irt_standard_library View 初始化 end  ***************/

@connect(
  public_irt_standard_library_state_to_props,
  public_irt_standard_library_dispatch_to_props
)
class Irt_standard_library_detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      public_irt_standard_library_detail_status: -1,
      public_irt_standard_library_detail_data: {},
      // 需要处理的库的id
      public_irt_standard_library_id: -1,
      modal_visible: false
    };
    //   调用查询
    this.query_list_detail();
    // 配置 message
    message.config({
      top: 480,
      duration: 2,
      maxCount: 5,
      getContainer: () => document.body
    });
  }

  // 查询详情数据
  query_list_detail = () => {
    // /library/public_irt_standard_library/detail/5c6d4e59fc6f9e0b70702806
    let url = this.props.history.location.pathname;
    // 提取 id
    let index = url.lastIndexOf("/");
    let id = url.substring(index + 1, url.length);
    // 这里不检查 id 的合法性 因为model service 层会自动处理
    // 主动发起查询请求
    this.props.get_public_irt_standard_library_detail({ id: id });
    setTimeout(() => {
      // 写入 id
      this.setState({
        public_irt_standard_library_id: id
      });
    }, 120);
  };

  handle_public_irt_standard_library_detail = () => {
    // 更新
    // 时间戳设置为 0
    this.props.set_state_newvalue({
      target: "public_irt_standard_library_detail_time",
      value: 0
    });

    if (0 == this.props.public_irt_standard_library_detail_status) {
      // 成功获取数据

      this.set_public_irt_standard_library_detail_data();
    } else {
      // 数据获取失败
      setTimeout(() => {
        this.setState({
          public_irt_standard_library_detail_status: -1,
          // 清空原数据
          public_irt_standard_library_detail_data: {}
        });
      }, 220);
      Modal.error({
        title: "False",
        content: Languages[this.props.language]["propro.network_error"],
        okText: Languages[this.props.language]["propro.user_modal_know"]
      });
      return -1;
    }
  };

  set_public_irt_standard_library_detail_data = () => {
    let { public_irt_standard_library_detail_data: data } = this.props;
    // 提取关键参数
    let obj_data = {};

    let {
      libraryInfo: library_info,
      maxRt: max_rt = null,
      minRt: min_rt = null
    } = data;

    /*
    createDate: 1560824062441
    creator: "王瑞敏"
    description: "肝癌标准库"
    doPublic: true
    fastaDeWeightPepCount: 0
    fastaDeWeightProtCount: 0
    generator: "shuffle"
    id: "5d0848fee0073c6ffc69752d"
    labels: []
    lastModifiedDate: 1567271004732
    libraryDeWeightPepCount: 56882
    libraryDeWeightProtCount: 2756
    name: "HCC_QE3_Lib"
    proteinCount: 7894
    totalCount: 300507
    totalUniqueCount: 272064
    type: 0
    uniqueProteinCount: 5138
    */
    let {
      createDate,
      creator,
      description,
      doPublic,
      fastaDeWeightPepCount,
      fastaDeWeightProtCount,
      generator,
      id,
      labels,
      lastModifiedDate,
      libraryDeWeightPepCount,
      libraryDeWeightProtCount,
      name,
      proteinCount,
      totalCount,
      totalUniqueCount,
      type,
      uniqueProteinCount
    } = library_info;

    // 提取数据 rename
    (obj_data.create_date = tao.format_time(createDate)),
      (obj_data.creator = creator),
      (obj_data.description = description),
      (obj_data.do_public = doPublic),
      (obj_data.fastade_weight_pepcount = fastaDeWeightPepCount),
      (obj_data.fastade_weight_protcount = fastaDeWeightProtCount),
      (obj_data.generator = generator),
      (obj_data.id = id),
      (obj_data.labels = labels),
      (obj_data.last_modified_date = tao.format_time(lastModifiedDate)),
      (obj_data.library_deweight_pepcount = libraryDeWeightPepCount),
      (obj_data.library_deweight_protcount = libraryDeWeightProtCount),
      (obj_data.name = name),
      (obj_data.protein_count = proteinCount),
      (obj_data.total_count = totalCount),
      (obj_data.total_unique_count = totalUniqueCount),
      (obj_data.type = type),
      (obj_data.unique_protein_count = uniqueProteinCount);

    setTimeout(() => {
      this.setState({
        public_irt_standard_library_detail_data: obj_data,
        public_irt_standard_library_list_detail_status: 0
      });
    }, 80);
  };

  // 重新统计
  aggregate = () => {
    // 获取到当前页面的id
    let id = this.state.public_irt_standard_library_id;

    // 调用接口
    this.props.aggregate(id);

    let { language } = this.props;
    // 弹出提示框
    message.loading(
      Languages[language][
        "propro.public_irt_standard_library_detail_re_statistic_analyse"
      ] +
        " : " +
        Languages[language][
          "propro.public_irt_standard_library_detail_running"
        ],
      3.5
    );
  };

  // 生成伪肽段
  generate = value => {
    // 读取 id
    let { language } = this.props;

    let id = this.state.public_irt_standard_library_id;

    let obj = {
      id: id,
      generator: value
    };
    // 调用 生成伪肽段 api
    this.props.generate(obj);
    // 弹出正在生成
    message.loading(
      Languages[language][
        "propro.public_irt_standard_library_detail_generating_pseudopeptides"
      ] +
        " : " +
        Languages[language][
          "propro.public_irt_standard_library_detail_running"
        ],
      3.5
    );
  };

  // 重新统计public_irt校准库
  handle_public_irt_standard_library_detail_aggregate = () => {
    // 更新
    // 时间戳设置为 0
    this.props.set_state_newvalue({
      target: "public_irt_standard_library_detail_aggregate_time",
      value: 0
    });

    let { language } = this.props;

    // 读取状态
    if (0 == this.props.public_irt_standard_library_detail_aggregate_status) {
      // 更新成功
      setTimeout(() => {
        // 提示
        message.success(
          Languages[language][
            "propro.public_irt_standard_library_detail_re_statistic_analyse"
          ] +
            " : " +
            Languages[language][
              "propro.public_irt_standard_library_detail_success"
            ],
          4
        );
      }, 220);
    } else {
      // 更新失败
      setTimeout(() => {
        // 提示
        message.error(
          Languages[language][
            "propro.public_irt_standard_library_detail_re_statistic_analyse"
          ] +
            " : " +
            Languages[language][
              "propro.public_irt_standard_library_detail_failed"
            ],
          4
        );
      }, 220);
    }
    return 0;
  };

  delete_pseudopeptides = () => {
    let { public_irt_standard_library_id: id } = this.state;
    let { language } = this.props;

    let obj = {
      id: id
    };
    this.props.delete_pseudopeptides(obj);
    message.loading(
      Languages[language][
        "propro.public_irt_standard_library_detail_delete_pseudopeptides"
      ] +
        " : " +
        Languages[language][
          "propro.public_irt_standard_library_detail_running"
        ],
      3.5
    );
  };

  handle_public_irt_standard_library_detail_delete_pseudopeptides = () => {
    // 处理 删除肽段
    // 时间戳设置为 0
    this.props.set_state_newvalue({
      target: "public_irt_standard_library_detail_delete_pseudopeptides_time",
      value: 0
    });

    let { language } = this.props;

    // 读取状态
    if (
      0 ==
      this.props.public_irt_standard_library_detail_delete_pseudopeptides_status
    ) {
      // 更新成功
      setTimeout(() => {
        // 提示
        message.success(
          Languages[language][
            "propro.public_irt_standard_library_detail_delete_pseudopeptides"
          ] +
            " : " +
            Languages[language][
              "propro.public_irt_standard_library_detail_success"
            ],
          4
        );
      }, 220);
    } else {
      // 更新失败
      setTimeout(() => {
        // 提示
        message.error(
          Languages[language][
            "propro.public_irt_standard_library_detail_delete_pseudopeptides"
          ] +
            " : " +
            Languages[language][
              "propro.public_irt_standard_library_detail_failed"
            ],
          4
        );
      }, 220);
    }
  };

  // 删除当前库
  delete_library_by_id = () => {
    // 获取到当前库的id
    // 发起警告
    this.setState({
      modal_visible: true
    });
  };

  // 删除库 确认
  delete_library_by_id_confirm = () => {
    let { public_irt_standard_library_id: id = null } = this.state;

    this.props.delete_public_irt_standard_library_by_id({
      id: id
    });
    this.setState({
      modal_visible: false
    });
  };

  // 删除库 取消
  delete_library_by_id_cancel = () => {
    this.setState({
      modal_visible: false
    });
  };

  // 执行删除库操作
  handle_public_irt_standard_library_detail_delete = () => {
    // 处理删除标准库的结果
    // 时间戳归零
    this.props.set_state_newvalue({
      target: "public_irt_standard_library_detail_delete_time",
      value: 0
    });
    let {
      public_irt_standard_library_detail_delete_status,
      language
    } = this.props;

    if (0 == public_irt_standard_library_detail_delete_status) {
      // 删除成功
      // 弹出删除成功
      setTimeout(() => {
        message.success(
          Languages[language][
            "propro.public_irt_standard_library_detail_delete_by_id"
          ] +
            " : " +
            Languages[language][
              "propro.public_irt_standard_library_detail_success"
            ],
          4
        );
      }, 110);

      // 延时跳转到 public_irt 标准库列表页面
      setTimeout(() => {
        this.props.history.push("/library/public_irt_standard_library/list");
      }, 800);
    } else {
      setTimeout(() => {
        // 删除失败
        message.error(
          Languages[language][
            "propro.public_irt_standard_library_detail_delete_by_id"
          ] +
            " : " +
            Languages[language][
              "propro.public_irt_standard_library_detail_failed"
            ],
          4
        );
      }, 120);
    }
  };

  handel_public_irt_standard_library_detail_generate = () => {
    // 处理删除标准库的结果
    // 时间戳归零
    this.props.set_state_newvalue({
      target: "public_irt_standard_library_detail_generate_time",
      value: 0
    });

    // 提取状态
    let {
      public_irt_standard_library_detail_generate_status,
      language
    } = this.props;

    // 这里暂时只处理 生成肽段成功的情况
    if (0 == public_irt_standard_library_detail_generate_status) {
      //
      // 成功生成伪肽段
      setTimeout(() => {
        // 提示
        message.success(
          Languages[language][
            "propro.public_irt_standard_library_detail_generating_pseudopeptides"
          ] +
            " : " +
            Languages[language][
              "propro.public_irt_standard_library_detail_success"
            ],
          4
        );
      }, 220);
    } else {
      // 失败 这里处理方式比较特殊 还有可能是因为网络断开 所以暂时不采取任何措施
      // pass
    }
  };

  render() {
    // 监控 public_irt_standard_library_list 数据变化
    if (10000 < this.props.public_irt_standard_library_detail_time) {
      // 资源有更新
      this.handle_public_irt_standard_library_detail();
    }
    if (0 != this.state.public_irt_standard_library_list_detail_status) {
      // 加载 ...
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

    if (10000 < this.props.public_irt_standard_library_detail_aggregate_time) {
      // 重新统计 更新
      this.handle_public_irt_standard_library_detail_aggregate();
    }

    if (10000 < this.props.public_irt_standard_library_detail_generate_time) {
      // 传回更新肽段
      this.handel_public_irt_standard_library_detail_generate();
    }

    if (
      10000 <
      this.props.public_irt_standard_library_detail_delete_pseudopeptides_time
    ) {
      // 删除肽段 更新
      this.handle_public_irt_standard_library_detail_delete_pseudopeptides();
    }

    // 监控删除标准库
    if (10000 < this.props.public_irt_standard_library_detail_delete_time) {
      this.handle_public_irt_standard_library_detail_delete();
    }

    const detail_data = this.state.public_irt_standard_library_detail_data;

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
              <FormattedHTMLMessage id="propro.public_irt_standard_library_list_title" />
            }
          >
            <Link to="/public_irt_standard_library/list">
              <img
                src={return_svg}
                style={{
                  height: "30px",
                  cursor: "pointer"
                }}
              />
            </Link>
          </Tooltip>

          <FormattedHTMLMessage id="propro.public_irt_standard_library_detail_title" />
        </div>
        {/* 提示用户警告信息 */}
        <Modal
          title={
            <b>
              <FormattedHTMLMessage id="propro.modal_title" />
            </b>
          }
          visible={this.state.modal_visible}
          onOk={this.delete_library_by_id_confirm}
          onCancel={this.delete_library_by_id_cancel}
          maskClosable={true}
          okText={<FormattedHTMLMessage id="propro.modal_confirm" />}
          cancelText={<FormattedHTMLMessage id="propro.modal_cancel" />}
        >
          <div className={styles.font_red_color}>
            <FormattedHTMLMessage id="propro.public_irt_standard_library_detail_delete_warning" />
          </div>
        </Modal>

        <div
          style={{
            background: "#FFFFFF",
            padding: "15px 10px",
            fontSize: "14px",
            border: "1px solid #e5e9f2",
            overflow: "auto"
          }}
        >
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
                bordered={true}
                column={4}
                size={"middle"}
                title={
                  <Fragment>
                    <Row>
                      <Col lg={8}>
                        <FormattedHTMLMessage id="propro.public_irt_standard_library_detail_creator" />
                        :&nbsp;
                        <span
                          className={"badge " + `${styles.bg_second_color}`}
                          style={{ padding: "5px 10px", color: "#ffffff" }}
                        >
                          {detail_data.creator}
                        </span>
                      </Col>
                      <Col lg={8}>
                        <FormattedHTMLMessage id="propro.public_irt_standard_library_detail_create_time" />
                        :&nbsp;
                        <span
                          className={"badge " + `${styles.bg_green_color}`}
                          style={{ padding: "5px 10px", color: "#FFFFFF" }}
                        >
                          {detail_data.create_date}
                        </span>
                      </Col>

                      <Col lg={8}>
                        <FormattedHTMLMessage id="propro.public_irt_standard_library_detail_last_modify_time" />
                        :&nbsp;
                        <span
                          className={"badge " + `${styles.bg_yellow_color}`}
                          style={{ padding: "5px 10px", color: "#FFFFFF" }}
                        >
                          {detail_data.last_modified_date}
                        </span>
                      </Col>
                    </Row>
                  </Fragment>
                }
              >
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.public_irt_standard_library_detail_id" />
                  }
                  span={2}
                >
                  {detail_data.id}
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.public_irt_standard_library_detail_name" />
                  }
                  span={2}
                >
                  {detail_data.name}
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.public_irt_standard_library_detail_library_type" />
                  }
                  span={2}
                >
                  <span className={styles.font_primary_color}>
                    {0 == detail_data.type ? (
                      <FormattedHTMLMessage id="propro.standard_library" />
                    ) : (
                      <FormattedHTMLMessage id="propro.public_irt_standard_library" />
                    )}
                  </span>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.public_irt_standard_library_detail_generator" />
                  }
                  span={2}
                >
                  <span className={styles.font_primary_color}>
                    {detail_data.generator}
                  </span>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.public_irt_standard_library_detail_protein_count" />
                  }
                  span={2}
                >
                  <span
                    className={styles.font_second_color}
                    style={{
                      fontWeight: "600"
                    }}
                  >
                    {0 == detail_data.protein_count ? (
                      <span className={styles.font_red_color}>0</span>
                    ) : (
                      detail_data.protein_count
                    )}
                  </span>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.public_irt_standard_library_detail_unique_protein_count" />
                  }
                  span={2}
                >
                  <span
                    className={styles.font_second_color}
                    style={{
                      fontWeight: "600"
                    }}
                  >
                    {0 == detail_data.unique_protein_count ? (
                      <span className={styles.font_red_color}>0</span>
                    ) : (
                      detail_data.unique_protein_count
                    )}
                  </span>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.public_irt_standard_library_detail_deweight_protein_count" />
                  }
                  span={2}
                >
                  <span
                    className={styles.font_second_color}
                    style={{
                      fontWeight: "600"
                    }}
                  >
                    {0 == detail_data.library_deweight_protcount ? (
                      <span className={styles.font_red_color}>0</span>
                    ) : (
                      detail_data.library_deweight_protcount
                    )}
                  </span>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.public_irt_standard_library_detail_peptide_count" />
                  }
                  span={2}
                >
                  <span
                    className={styles.font_second_color}
                    style={{
                      fontWeight: "600"
                    }}
                  >
                    {0 == detail_data.total_count ? (
                      <span className={styles.font_red_color}>0</span>
                    ) : (
                      detail_data.total_count
                    )}
                  </span>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.public_irt_standard_library_detail_unique_peptide_count" />
                  }
                  span={2}
                >
                  <span
                    className={styles.font_second_color}
                    style={{
                      fontWeight: "600"
                    }}
                  >
                    {0 == detail_data.total_unique_count ? (
                      <span className={styles.font_red_color}>0</span>
                    ) : (
                      detail_data.total_unique_count
                    )}
                  </span>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.public_irt_standard_library_detail_deweight_peptide_count" />
                  }
                  span={2}
                >
                  <span
                    className={styles.font_second_color}
                    style={{
                      fontWeight: "600"
                    }}
                  >
                    {0 == detail_data.library_deweight_pepcount ? (
                      <span className={styles.font_red_color}>0</span>
                    ) : (
                      detail_data.library_deweight_pepcount
                    )}
                  </span>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.public_irt_standard_library_detail_fastade_weight_protein_count" />
                  }
                  span={2}
                >
                  <span
                    className={styles.font_second_color}
                    style={{
                      fontWeight: "600"
                    }}
                  >
                    {0 == detail_data.fastade_weight_protcount ? (
                      <span className={styles.font_red_color}>0</span>
                    ) : (
                      detail_data.fastade_weight_protcount
                    )}
                  </span>
                </Descriptions.Item>

                {/* Fasta去除真肽段数目 */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.public_irt_standard_library_detail_fastade_weight_peptide_count" />
                  }
                  span={2}
                >
                  <span
                    className={styles.font_second_color}
                    style={{
                      fontWeight: "600"
                    }}
                  >
                    {0 == detail_data.fastade_weight_pepcount ? (
                      <span className={styles.font_red_color}>0</span>
                    ) : (
                      detail_data.fastade_weight_pepcount
                    )}
                  </span>
                </Descriptions.Item>

                {/* 详情描述 */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.public_irt_standard_library_detail_description" />
                  }
                  span={4}
                >
                  <span
                    className={styles.font_second_color}
                    style={{
                      fontWeight: "600"
                    }}
                  >
                    {"" == detail_data.description ? (
                      <span className={styles.font_red_color}>NULL</span>
                    ) : (
                      detail_data.description
                    )}
                  </span>
                </Descriptions.Item>

                {/* 肽段分析 2019-9-2 10:57:34 */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.public_irt_standard_library_detail_peptide_analyse" />
                  }
                  span={4}
                >
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    style={{
                      padding: "5px",
                      height: "30px",
                      fontSize: "12px",
                      lineHeight: "20px"
                    }}
                    onClick={this.aggregate}
                  >
                    {/* 重新统计 */}
                    <FormattedHTMLMessage id="propro.public_irt_standard_library_detail_re_statistic_analyse" />
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    style={{
                      padding: "5px",
                      height: "30px",
                      fontSize: "12px",
                      lineHeight: "20px",
                      marginLeft: "10px"
                    }}
                    onClick={() => {
                      this.generate("shuffle");
                    }}
                  >
                    {/* 生成伪肽段 shuffle */}
                    <FormattedHTMLMessage id="propro.public_irt_standard_library_detail_generating_pseudopeptides" />
                    (Shuffle)
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    style={{
                      padding: "5px",
                      height: "30px",
                      fontSize: "12px",
                      lineHeight: "20px",
                      marginLeft: "10px"
                    }}
                    // 这里为了处理冒泡 采用箭头方式传参
                    onClick={() => {
                      this.generate("nico");
                    }}
                  >
                    <FormattedHTMLMessage id="propro.public_irt_standard_library_detail_generating_pseudopeptides" />
                    (Nico)
                  </button>

                  {/* 删除肽段 */}
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    style={{
                      padding: "5px",
                      height: "30px",
                      fontSize: "12px",
                      lineHeight: "20px",
                      marginLeft: "10px"
                    }}
                    onClick={this.delete_pseudopeptides}
                  >
                    <FormattedHTMLMessage id="propro.public_irt_standard_library_detail_delete_pseudopeptides" />
                  </button>
                </Descriptions.Item>

                {/* 肽段 链接 */}
                <Descriptions.Item
                  label={
                    <FormattedHTMLMessage id="propro.public_irt_standard_library_detail_peptide_link" />
                  }
                  span={4}
                >
                  <Link
                    to={
                      "/peptide/list/" +
                      this.state.public_irt_standard_library_id
                    }
                  >
                    <button
                      type="button"
                      className="btn btn-outline-dark"
                      style={{
                        padding: "5px",
                        height: "30px",
                        fontSize: "12px",
                        lineHeight: "20px"
                      }}
                    >
                      {/* 肽段列表 */}
                      <FormattedHTMLMessage id="propro.public_irt_standard_library_detail_peptide_list" />
                    </button>
                  </Link>

                  <Link
                    to={
                      "/protein/list/" +
                      this.state.public_irt_standard_library_id
                    }
                  >
                    <button
                      type="button"
                      className="btn btn-outline-dark"
                      style={{
                        padding: "5px",
                        height: "30px",
                        fontSize: "12px",
                        lineHeight: "20px",
                        marginLeft: "10px"
                      }}
                    >
                      <FormattedHTMLMessage id="propro.public_irt_standard_library_detail_protein_list" />
                    </button>
                  </Link>
                </Descriptions.Item>
              </Descriptions>

              <Col
                lg={24}
                style={{
                  margin: "30px 0px"
                }}
              >
                <Link
                  to={
                    "/public_irt_standard_library/update/" +
                    detail_data.id +
                    "_" +
                    detail_data.name
                  }
                >
                  <button
                    type="button"
                    className="btn btn-info"
                    style={{
                      padding: "5px 10px",
                      height: "30px",
                      fontSize: "14px",
                      lineHeight: "20px",
                      marginLeft: "10px"
                    }}
                  >
                    <FormattedHTMLMessage id="propro.public_irt_standard_library_detail_modify" />
                  </button>
                </Link>
                <button
                  type="button"
                  className="btn btn-danger"
                  style={{
                    padding: "5px 10px",
                    height: "30px",
                    fontSize: "14px",
                    lineHeight: "20px",
                    marginLeft: "30px"
                  }}
                  onClick={this.delete_library_by_id}
                >
                  <FormattedHTMLMessage id="propro.public_irt_standard_library_detail_delete" />
                </button>
              </Col>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Irt_standard_library_detail;
