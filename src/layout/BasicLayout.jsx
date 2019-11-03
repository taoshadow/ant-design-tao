// path: /src/layout/BasicLayout.jsx
// 存放控制台界面的布局

import {
  ConfigProvider,
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
  Tabs
} from "antd";
import { Fragment } from "react";
import Link from "umi/link";
import { connect } from "dva";

import prorpo_logo from "../assets/propro-logo-vertical.png";

/************** 导入 style  ***************/
/************** 导入 style  ***************/
// css
import "./Common.css";
import "./BasicLayout.css";
import "bootstrap/dist/css/bootstrap.min.css";
// less
import "antd/dist/antd.less";
import styles from "./BasicLayout.less";

// svg
import admin_svg from "../assets/basiclayout/admin.svg";
import user_svg from "../assets/basiclayout/user.svg";
/************** 导入 style end ***************/

/***********  国际化配置   ***************/
/***********  国际化配置   ***************/
//  1 引入组件
import {
  IntlProvider,
  addLocaleData,
  FormattedMessage,
  FormattedHTMLMessage
} from "react-intl";

//  2 引入语言包支持
import locale_en from "react-intl/locale-data/en";
import locale_zh from "react-intl/locale-data/zh";

//  3 引入自定义的语言文件 json 格式
import messages_zh from "../locale/zh_CN";
import messages_en from "../locale/en_US";

const Languages = {
  zh: messages_zh,
  en: messages_en
};

//  4 设置语言支持
addLocaleData([...locale_en, ...locale_zh]);

/***********  国际化配置 end  ***************/

// 开发模式
let dev_consolelog = function() {
  let len = arguments.length;
  for (let i = 0; i < len; i++) {
    console.log(arguments[i]);
  }
};

import tao from "../utils/common.js";

const { Header, Footer, Content, Sider } = Layout;

const { SubMenu } = Menu;

//  select 复选框
const { Option } = Select;

/***********  Basic 初始化   ***************/
/***********  Basic 初始化   ***************/

// state 更新
const basicStateToProps = state => {
  // 先从 models 里读取
  let language = state["language"].language;

  // 获取登录状态
  let {
    login_status,
    username,
    email,
    telephone,
    nick,
    organization,
    roles
  } = state["login"];

  return {
    language,
    login_status,
    username,
    email,
    telephone,
    nick,
    organization,
    roles
  };
};

// 语言改变触发器
const basicDispatchToProps = dispatch => {
  return {
    changeLanguage: language => {
      const action = {
        //  触发类型
        type: "language/changeLanguage",
        // 数据 payload 传入新的语言
        payload: language
      };
      dispatch(action);
    },
    doLogout: e => {
      const action = {
        //  触发类型
        type: "login/doLogout"
      };
      dispatch(action);
    }
  };
};

/***********  Basic 初始化 end  ***************/

// 注入
@connect(
  basicStateToProps,
  basicDispatchToProps
)
export default class BasicLayout extends React.Component {
  constructor(props) {
    super(props);
    dev_consolelog("Initializing ...");

    this.state = {
      current: "header_home",
      // slider 默认收紧
      collapsed: true
    };

    dev_consolelog("Initialization successful .");
  }

  //  切换语言 触发
  changeLanguage = e => {
    dev_consolelog(`change language ${e}`);
    this.props.changeLanguage({
      language: e
    });
  };

  handleClick = e => {
    console.log("click ", e);
    this.setState({
      current: e.key
    });
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  render() {
    // 提取 登录结果 目标语言
    const { language } = this.props;
    // let user = <User />;
    return (
      <IntlProvider locale={language} messages={Languages[language]}>
        <Layout style={{ minHeight: "120vh", minWidth: "1150px" }}>
          <Sider
            theme="light"
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
          >
            <Menu
              theme="light"
              // defaultOpenKeys
              defaultSelectedKeys={["home1"]}
              mode="inline"
            >
              <Menu.Item key="home1">
                <Link to="/console">
                  <Icon type="pie-chart" />
                  <span>首页</span>
                </Link>
              </Menu.Item>

              <Menu.Item key="1console">
                <Icon type="desktop" />
                <span>Option 2</span>
              </Menu.Item>

              <SubMenu
                key="sub1"
                title={
                  <span>
                    <Icon type="user" />
                    <span>User</span>
                  </span>
                }
              >
                <Menu.Item key="3">Tom</Menu.Item>
                <Menu.Item key="4">Bill</Menu.Item>
                <Menu.Item key="5">Alex</Menu.Item>
              </SubMenu>

              <SubMenu
                key="sub2"
                title={
                  <span>
                    <Icon type="team" />
                    <span>Team</span>
                  </span>
                }
              >
                <Menu.Item key="6">Team 1</Menu.Item>
                <Menu.Item key="8">Team 2</Menu.Item>
              </SubMenu>

              <Menu.Item key="9">
                <Icon type="file" />
                <span>File</span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header
              style={{
                background: "#fff",
                padding: 0,
                height: "60px",
                lineHeight: "50px",
                padding: "5px 10px 0px 5px",
                fontSize: "18px",
                borderBottom: "1px solid #ddd"
              }}
            >
              <div
                style={{
                  height: "50px",
                  lineHeight: "50px",
                  margin: "0px",
                  padding: "0px"
                }}
              >
                <Row type="flex" justify="space-between">
                  <Col lg={5} xl={5} style={{ marginTop: "0px" }}>
                    <Icon
                      className={styles.trigger}
                      type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
                      onClick={this.toggle}
                      style={{
                        padding: "0px 10px 0px 0px",
                        fontSize: "24px",
                        lineHeight: "40px",
                        verticalAlign: "top"
                      }}
                    />
                    <Link to="/home">
                      <img
                        src={prorpo_logo}
                        style={{
                          height: "40px",
                          cursor: "pointer",
                          marginTop: "0px"
                        }}
                      />
                      <span
                        style={{
                          fontSize: "20px",
                          fontWeight: "600",
                          padding: "0px",
                          display: "inline-block",
                          lineHeight: "40px"
                        }}
                        className={styles.myfont}
                      >
                        &nbsp;PROPRO
                      </span>
                    </Link>
                  </Col>
                  <Col lg={14} xl={15}>
                    <Row type="flex" justify="end">
                      <Col span={20}>
                        <Menu
                          onClick={this.handleClick}
                          selectedKeys={[this.state.current]}
                          mode="horizontal"
                        >
                          <Menu.Item key="header_home">
                            <Link to="/console">
                              <FormattedHTMLMessage id="propro.console" />
                            </Link>
                          </Menu.Item>
                          <SubMenu
                            title={
                              <span className="submenu-title-wrapper">
                                任务
                              </span>
                            }
                          >
                            <Menu.Item key="2019-8-9 00:51:05">
                              <Link to="/task/list">
                                <FormattedHTMLMessage id="propro.console_task_list" />
                              </Link>
                            </Menu.Item>
                            <Menu.Item key="2019-8-9 00:51:07">
                              创建项目
                            </Menu.Item>
                            <Menu.Item key="2019-8-9 00:51:11">
                              导入标准库
                            </Menu.Item>
                          </SubMenu>

                          <SubMenu
                            title={
                              <span className="submenu-title-wrapper">
                                {"标准库&iRT库"}
                              </span>
                            }
                          >
                            <Menu.Item key="2019-8-9 00:53:00">
                              标准库列表
                            </Menu.Item>
                            <Menu.Item key="2019-8-9 00:53:05">
                              IRT校准库列表
                            </Menu.Item>
                            <Menu.Item key="2019-8-9 00:53:36">
                              公共标准库
                            </Menu.Item>
                            <Menu.Item key="2019-8-9 00:54:42">
                              公共IRT库
                            </Menu.Item>
                            <Menu.Item key="2019-8-9 00:54:47">
                              肽段列表
                            </Menu.Item>
                          </SubMenu>

                          <Menu.Item key="2019-8-9 00:55:58">
                            <Link to="/project/list/">
                              <FormattedHTMLMessage id="propro.console_project" />
                            </Link>
                          </Menu.Item>
                          <Menu.Item key="2019-10-8 23:34:06">
                            <Link to="/experiment/list/">
                              <FormattedHTMLMessage id="propro.console_experiment_list" />
                            </Link>
                          </Menu.Item>
                          <SubMenu
                            title={
                              <span className="submenu-title-wrapper">
                                {"数据分析"}
                              </span>
                            }
                          >
                            <Menu.Item key="2019-8-9 00:56:44">
                              数据分析列表
                            </Menu.Item>
                            <Menu.Item key="2019-8-9 00:56:50">
                              交叉比对分析
                            </Menu.Item>
                          </SubMenu>

                          <SubMenu
                            title={
                              <span className="submenu-title-wrapper">
                                {"工具箱"}
                              </span>
                            }
                          >
                            <Menu.Item>肽段诊所</Menu.Item>
                            <Menu.Item>分子质量计算器</Menu.Item>
                          </SubMenu>
                          <Menu.Item key="2019-8-9 01:03:35">
                            OpenAPI 文档说明
                          </Menu.Item>
                        </Menu>
                      </Col>
                    </Row>
                  </Col>

                  <Col
                    lg={5}
                    xl={4}
                    style={{
                      // background:'#e34512',
                      textAlign: "right",
                      paddingRight: "5px"
                    }}
                  >
                    <Select
                      defaultValue={language}
                      style={{
                        padding: "5px 5px"
                        // marginLeft:'3px',
                        // height:'55px',
                      }}
                      onChange={this.changeLanguage}
                    >
                      <Option value="zh">中文</Option>
                      <Option value="en">English</Option>
                    </Select>

                    <UserButton />
                  </Col>
                </Row>
              </div>
            </Header>
            <Content
              style={{
                margin: "20px 10px",
                padding: 24,
                minHeight: 280,
                borderRadius: "5px"
              }}
            >
              <div
                style={{
                  padding: 24,
                  minHeight: 360
                }}
              >
                {this.props.children}
              </div>
            </Content>
          </Layout>
        </Layout>
      </IntlProvider>
    );
  }
}

// 注入
@connect(
  basicStateToProps,
  basicDispatchToProps
)
// 这个是 控制台 导航条最右边的用户按钮 针对不同状态显示不同结果
class UserButton extends React.Component {
  constructor(props) {
    super(props);
  }

  // 整个退出流程 考虑情况比较多 需要理顺代码才能明白退出过程中系统做了什么
  my_logout = e => {
    const { language } = this.props;
    let res = Languages[language]["propro.logout_run"];

    message.loading(res + "...", 1.3, () => {
      // 提示退出成功
      let res = Languages[language]["propro.logout_success"];
      message.success(res, 3);
    });

    setTimeout(() => {
      // 执行退出
      // 主动触发退出  清理系统垃圾 为即将使用做准备
      this.props.doLogout();
      // 提示重新加载
      let res = Languages[language]["propro.reloading"];
      message.loading(res + "...", 2, () => {
        // 执行跳转
        // 强制刷新到首页 这样会清空很多不必要的数据
        window.location.href = "/home";
      });
    }, 2000);
  };

  render() {
    // 1 提取
    const {
      language,
      login_status,
      username,
      email = "null",
      telephone = "null",
      nick = "null",
      organization = "null",
      roles = ""
    } = this.props;

    let my = my_roles => {
      let res_admin = <Fragment key="2019_8_5_152559" />;
      if ("admin" == my_roles) {
        // 管理员 添加新的操作
        res_admin = (
          <div>
            <img
              src={admin_svg}
              alt=""
              style={{
                marginRight: "10px",
                height: "15px",
                marginBottom: "5px"
              }}
            />

            <Link to="/login" className={styles.my_link}>
              <FormattedHTMLMessage id="propro.user_management" />
            </Link>
          </div>
        );
      }

      return (
        <div>
          {/* user_info_body_arrow */}
          <div
            style={{
              float: "right",
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderBottom: "10px solid ",
              marginTop: "-10px",
              borderRadius: "5px",
              marginRight: "20px"
            }}
            className={styles.user_info_body_arrow}
          />

          <div
            style={{
              background: "#fff",
              minHeight: "200px",
              minWidth: "280px",
              maxWidth: "650px",
              borderWidth: "0px",
              padding: "0px ",
              overflow: "hidden",
              marginTop: "10px",
              boxShadow: "0px 0px  10px 5px #eee",
              fontSize: "14px"
            }}
          >
            {/* 第一部分 */}
            <div
              style={{
                minHeight: "100px",
                padding: "20px 20px 10px",
                borderTop: "0px solid #fff",
                borderTopLeftRadius: "5px",
                borderTopRightRadius: "5px"
              }}
              className={styles.user_info_body}
            >
              <div
                style={{
                  fontWeight: "600",
                  fontSize: "16px",
                  marginBottom: "10px"
                }}
              >
                <Link to="/login">
                  <span className={styles.light_color}>{username}</span>
                </Link>
              </div>
              <div>
                <FormattedHTMLMessage id="propro.nick" />
                &nbsp;:&nbsp;&nbsp;
                {nick}
              </div>

              <div>
                <FormattedHTMLMessage id="propro.email" />
                &nbsp;:&nbsp;&nbsp;
                {email}
              </div>
              <div>
                <FormattedHTMLMessage id="propro.telephone" />
                &nbsp;:&nbsp;&nbsp;
                {telephone}
              </div>
              <div>
                <FormattedHTMLMessage id="propro.organization" />
                &nbsp;:&nbsp;&nbsp;
                {organization}
              </div>
            </div>

            {/* 第二部分 */}
            <div
              style={{
                padding: "10px 20px"
              }}
            >
              <div
                style={{
                  height: "20px",
                  lineHeight: "20px",
                  marginBottom: "5px"
                }}
              >
                <Link to="/user/setting" className={styles.my_link}>
                  <img
                    src={user_svg}
                    alt=""
                    style={{
                      marginRight: "10px",
                      height: "15px"
                    }}
                  />
                  <FormattedHTMLMessage id="propro.personal_center" />
                </Link>
              </div>
              {res_admin}
            </div>

            {/* 第三部分 */}
            <div
              style={{
                textAlign: "center",
                padding: "10px 0px",
                background: "#eee"
              }}
              className={styles.my_logout}
              onClick={this.my_logout}
            >
              <FormattedHTMLMessage id="propro.logout" />
            </div>
          </div>
        </div>
      );
    };

    // 输出的结果
    let res = <Fragment key="res_null" />;

    if (0 == login_status && "" != username) {
      // 已经登录
      let my_name = "";
      if (tao.strlen(username) > 11) {
        my_name = tao.substr(username, 11) + "...";
      } else {
        my_name = username;
      }

      res = (
        <Dropdown overlay={my(roles)} placement="bottomLeft">
          <Button
            style={{
              paddingLeft: "6px",
              paddingRight: "6px"
            }}
          >
            {my_name}
          </Button>
        </Dropdown>
      );
    } else {
      // 这里要取对立事件 不能取 0!= login_status 因为可能为 null 可能 undefined
      // 未登录
      res = (
        <Button
          type="primary"
          style={{
            padding: "0px 10px",
            marginLeft: "8px",
            height: "32px",
            lineHeight: "32px"
          }}
        >
          <Link
            to="/login"
            style={{
              color: "#fff",
              letterSpacing: "1px",
              lineHeight: "32px"
            }}
          >
            <span>
              &nbsp;
              <FormattedHTMLMessage defaultMessage="登录" id="propro.login" />
            </span>
          </Link>
        </Button>
      );
    }
    return res;
  }
}
