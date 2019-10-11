// src/pages/propro/experiment/detail.js
// detail 实验数据 列表

/***
 * @Author              TangTao https://www.promiselee.cn/tao
 * @Email               tangtao2099@outlook.com
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-10-11 16:26:11
 * @UpdateTime          2019-10-7 21:32:51
 * @Archive             实验数据列表
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
  BackTop
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

import arrow_up_svg from "../style/static/analysis/arrow_up.svg";
import return_svg from "../style/static/dashboard/return.svg";
import preloader_svg from "../style/static/dashboard/preloader.svg";
import modify_svg from "../style/static/experiment/modify.svg";
import chart_svg from "../style/static/experiment/chart.svg";
import process_svg from "../style/static/experiment/process.svg";

/****************  导入 styles end ***************************/

/***********  experiment View 初始化   ***************/
/***********  experiment View 初始化   ***************/

const experiment_state_to_props = state => {
  // 发送的对象
  let obj = {};

  // 先从 models 里读取 是否显示登录  当前语言
  const language = state["language"].language;
  if ("undefined" != typeof language) {
    obj.language = language;
  }

  let {
    experiment_detail_status = -1,
    experiment_detail_time = 0,
    experiment_detail_data = {},
    experiment_detail_delete_status = -1,
    experiment_detail_delete_time = 0,
    experiment_detail_delete_data = {}
  } = state["experiment_detail"];

  (obj.experiment_detail_delete_status = experiment_detail_delete_status),
    (obj.experiment_detail_delete_time = experiment_detail_delete_time),
    (obj.experiment_detail_delete_data = experiment_detail_delete_data),
    (obj.experiment_detail_status = experiment_detail_status),
    (obj.experiment_detail_time = experiment_detail_time),
    (obj.experiment_detail_data = experiment_detail_data);

  return obj;
};

const experiment_dispatch_to_props = dispatch => {
  return {
    // 更新触发器
    get_experiment_detail: () => {
      const action = {
        type: "experiment_detail/get_experiment_detail",
        payload: null
      };
      dispatch(action);
    },
    delete_experiment_detail: data => {
      const action = {
        type: "experiment_detail/delete_experiment_detail",
        payload: data
      };
      dispatch(action);
    },
    set_state_newvalue: data => {
      const action = {
        type: "experiment_detail/set_state_newvalue",
        payload: data
      };
      dispatch(action);
    }
  };
};

/***********  experiment View 初始化 end  ***************/

@connect(
  experiment_state_to_props,
  experiment_dispatch_to_props
)
class Experiment_detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //   查询到的标准库数据
      experiment_detail_data: [],
      // 默认没有数据 状态为 -1 这个变量 暂时用不着 但是后续扩展会用到
      experiment_detail_status: -1,
      // 请求失败再次发起请求的尝试次数
      experiment_detail_false_time: 5,
      search_text: "",
      experiment_detail_table_columns: null,
      // modal 配置
      modal_visible: false,
      drawer_visible: false,
      drawer_data: null,
      delete_experiment_detail_id: null,
      analyse_overview_do_map: null
      //   language: this.props.language
    };

    // 查询 experiment_detail 列表
    setTimeout(() => {
      this.query_experiment_detail();
    }, 100);

    // 配置 message
    message.config({
      top: 500,
      duration: 2,
      maxCount: 5,
      getContainer: () => document.body
    });

    // 配置表格列参数
    this.config_table_columns();
  }

  // 查询数据接口
  query_experiment_detail = () => {
    //
    let url = this.props.history.location.pathname;
    let find_str = "/detail/";
    let index = url.lastIndexOf(find_str);
    let id = url.substring(index + find_str.length);

    let obj = {};
    if (3 < index) {
      // 找到 id 添加
      obj.id = id;
    }

    this.props.get_experiment_detail(obj);
  };

  refresh_data = () => {
    setTimeout(() => {
      // 显示加载界面
      this.setState({
        experiment_detail_status: -1
      });
      // 立即重新发起查询
      this.query_experiment_detail();
    }, 800);
  };

  handle_experiment_detail = () => {
    // 时间戳设置为 0
    this.props.set_state_newvalue({
      target: "experiment_detail_time",
      value: 0
    });

    // 检查状态
    if (0 == this.props.experiment_detail_status) {
      // 数据获取成功
      setTimeout(() => {
        // 调用 添加更新数据函数
        this.change_experiment_detail_data();
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
      let { experiment_detail_false_time } = this.state;
      // 2-判断是否需要再次发起请求
      if (0 >= experiment_detail_false_time) {
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
          experiment_detail_false_time: experiment_detail_false_time--
        });
      }, 120);

      return -1;
    }

    return 0;
  };

  change_experiment_detail_data = () => {
    console.log(this.props.experiment_detail_data);

    this.setState({
      //   // 标记 成功
      //   experiment_detail_false_time: 5,
      //   load_percentage_value: load_percentage_value,
      //   total_numbers: total_numbers,
      //   analyse_overview_do_map: analyse_overview_do_map,
      //   experiment_detail_query_time: tao.current_format_time(),
      //   experiment_detail_data: experiments_arr,
      //   // 标记数据为可用的状态
      //   experiment_detail_status: 0
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
          <FormattedHTMLMessage id="propro.experiment_detail_search" />
        </Button>
        <Button
          onClick={() => this.handle_table_reset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          <FormattedHTMLMessage id="propro.experiment_detail_reset" />
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

  config_table_columns = () => {
    setTimeout(() => {
      this.setState({
        // experiment_detail_table_columns: experiment_detail_table_columns
      });
    }, 40);
  };

  handle_table_search = (selectedKeys, confirm) => {
    confirm();
    this.setState({ search_text: selectedKeys[0] });
  };

  handle_table_reset = clearFilters => {
    clearFilters();
    this.setState({ search_text: "" });
  };

  delete_experiment_detail_by_id = id => {
    // 调用删除对话框
    this.setState({
      delete_experiment_detail_id: id,
      modal_visible: true
    });
  };

  delete_experiment_detail_by_id_confirm = () => {
    this.setState({
      modal_visible: false
    });
    let { language } = this.props;
    message.loading(
      Languages[language]["propro.experiment_detail_delete_tip"] +
        " : " +
        Languages[language]["propro.prompt_running"],
      2
    );
    // 延迟删除 为用户提供紧急停留时间
    setTimeout(() => {
      // 获取id
      let { delete_experiment_detail_id } = this.state;
      this.props.delete_experiment_detail({
        id: delete_experiment_detail_id
      });
    }, 1500);
  };

  delete_experiment_detail_by_id_cancel = () => {
    this.setState({
      modal_visible: false
    });
  };

  handle_delete_experiment_detail = () => {
    //
    // 时间戳设置为 0
    this.props.set_state_newvalue({
      target: "experiment_detail_delete_time",
      value: 0
    });

    let { experiment_detail_delete_status, language } = this.props;
    if (0 == experiment_detail_delete_status) {
      // 删除成功
      setTimeout(() => {
        message.success(
          Languages[language]["propro.experiment_detail_delete_tip"] +
            " : " +
            Languages[language]["propro.prompt_success"],
          4
        );
      }, 200);
    } else {
      // 删除失败 可能出在网络
      setTimeout(() => {
        message.error(
          Languages[language]["propro.experiment_detail_delete_tip"] +
            " : " +
            Languages[language]["propro.prompt_failed"],
          4
        );
      }, 200);

      return -1;
    }
    // 执行刷新到分析列表
    setTimeout(() => {
      // 重新加载数据
      this.refresh_data();
    }, 500);
  };

  /************   operation  *****************/
  /************   operation  *****************/
  /************   operation  *****************/

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

  /**************************** render ****************************/
  /**************************** render ****************************/
  /**************************** render ****************************/
  /**************************** render ****************************/

  render() {
    // 监控 experiment_detail 数据变化
    if (10000 < this.props.experiment_detail_time) {
      // 资源有更新
      this.handle_experiment_detail();
    }

    if (10000 < this.props.experiment_detail_delete_time) {
      this.handle_delete_experiment_detail();
    }

    if (0 != this.state.experiment_detail_status) {
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

    let { drawer_data, drawer_visible } = this.state;

    return 11111;
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
          <FormattedHTMLMessage id="propro.experiment_detail_title" />
        </div>

        {/* 提示用户 删除 警告信息 */}
        <Modal
          title={
            <b>
              <FormattedHTMLMessage id="propro.modal_title" />
            </b>
          }
          visible={this.state.modal_visible}
          onOk={this.delete_experiment_detail_by_id_confirm}
          onCancel={this.delete_experiment_detail_by_id_cancel}
          maskClosable={true}
          okText={<FormattedHTMLMessage id="propro.modal_confirm" />}
          cancelText={<FormattedHTMLMessage id="propro.modal_cancel" />}
        >
          <div className={styles.font_red_color}>
            <FormattedHTMLMessage id="propro.experiment_detail_delete_warning" />
          </div>
        </Modal>

        {true == drawer_visible && (
          <Drawer
            title={
              <FormattedHTMLMessage id="propro.analysis_score_detail_data_detail" />
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
          <Table
            size={"middle"}
            columns={this.state.experiment_detail_table_columns}
            pagination={{
              position: "bottom",
              hideOnSinglePage: true,
              defaultPageSize: 100
            }}
            dataSource={this.state.experiment_detail_data}
          />
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

export default Experiment_detail;
