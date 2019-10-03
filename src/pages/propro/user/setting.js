// /src/pages/propro/user/setting.js

/***
 * @Author              TangTao
 * @Email               tangtao2099@outlook.com   https://www.promiselee.cn/tao
 * @Copyright           西湖大学 propro Tangtao
 * @GitHub              https://github.com/tangtaoshadow
 * @Zhihu               https://www.zhihu.com/people/tang-tao-24-36/activities
 * @CreateTime          2019-8-8 00:10:55
 * @UpdateTime          2019-8-8 00:11:10
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
  Modal
} from "antd";

const { confirm } = Modal;

const { TabPane } = Tabs;

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
import styles from "../style/user/setting.less";

/****************  导入 styles end ***************************/

/***********  UserSetting View 初始化   ***************/
/***********  UserSetting View 初始化   ***************/

// state 发生改变 回调该函数 该函数返回新状态 直接导致页面刷新
const userSettingStateToProps = state => {
  // 发送的对象
  let obj = {};

  // 先从 models 里读取 是否显示登录  当前语言
  const language = state["language"].language;
  if ("undefined" != typeof language) {
    obj.language = language;
  }

  let {
    login_status = "",
    username = "",
    roles = "",
    update_info_time = 0,
    update_info_status = -1,
    update_passwd_time = 0,
    update_passwd_status = -1
  } = state["login"];

  // 自动剔除 null
  let email = "null" == state["login"].email ? "" : state["login"].email;
  let nick = "null" == state["login"].nick ? "" : state["login"].nick;
  let telephone =
    "null" == state["login"].telephone ? "" : state["login"].telephone;
  let organization =
    "null" == state["login"].organization ? "" : state["login"].organization;

  obj.login_status = login_status;
  obj.username = username;
  obj.email = email;
  obj.telephone = telephone;
  obj.nick = nick;
  obj.organization = organization;
  obj.roles = roles;
  obj.update_info_time = update_info_time;
  obj.update_info_status = update_info_status;
  obj.update_passwd_time = update_passwd_time;
  obj.update_passwd_status = update_passwd_status;

  return obj;
};

const userSettingDispatchToProps = dispatch => {
  return {
    // 更新触发器
    update_account_info: userInfo => {
      const action = {
        type: "login/update_account_info",
        payload: userInfo
      };
      dispatch(action);
    },
    update_account_password: userPasswd => {
      const action = {
        type: "login/update_account_password",
        payload: userPasswd
      };
      dispatch(action);
    },
    set_state_newvalue: data => {
      const action = {
        type: "login/set_state_newvalue",
        payload: data
      };
      dispatch(action);
    }
  };
};

/***********  UserSetting View 初始化 end  ***************/

// ******************  开始执行 *******************************
// ******************  开始执行 *******************************
// ******************  开始执行 *******************************

@connect(
  userSettingStateToProps,
  userSettingDispatchToProps
)
// 用户设置  每个人都有权限
class UserSetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      email: this.props.email,
      telephone: this.props.telephone,
      organization: this.props.organization,
      nick: this.props.nick,
      current_password: "",
      new_password: "",
      verify_password: "",
      modal_visible: false,
      modal_confirmLoading: false,
      modal_text: "TangTao"
    };
  }

  // 显示需要 登录 界面
  error_login = e => {
    this.props.history.push("/error/login");
  };

  // 通用设置
  set_info = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  update_my_account = e => {
    let obj = {};
    (obj.username = this.state.username),
      (obj.email = this.state.email),
      (obj.telephone = this.state.telephone),
      (obj.organization = this.state.organization),
      (obj.nick = this.state.nick);
    this.setState({
      modal_confirmLoading: true
    });
    // 延时 close
    setTimeout(() => {
      // 不需要再次检查显示状态
      // 因为为true 需要关闭 为 false 也是关闭
      this.setState({
        modal_visible: false,
        modal_confirmLoading: false
      });
    }, 1000);
    this.props.update_account_info({ account_info: obj });
  };

  update_account_password = e => {
    let obj = {};
    obj.current_password = this.state.current_password;
    obj.new_password = this.state.new_password;
    this.props.update_account_password({ account_password: obj });
  };

  handle_modal_cancel = e => {
    this.setState({
      modal_visible: false,
      modal_confirmLoading: false
    });
  };

  // 处理提交 form
  handle_submit = e => {
    const { language } = this.props;
    const { name } = e.target;
    let obj = this.state;
    if ("account" == name) {
      // 更新 account

      // 如果存在 空 弹出 警告 需要用户确认
      if ("" == obj.username) {
        // impossible 这是错误 不存在的 不理睬
        Modal.error({
          title: "This is an error ",
          // 小鬼 你想干啥 ??
          content:
            "What are you doing ? Please contact Tang Tao(tangtao2099@outlook.com)"
        });
        return -5;
      }

      let res = new Array();

      //  增强可读性
      res.username = obj.username;
      res.nick = obj.nick;
      res.email = obj.email;
      res.organization = obj.organization;
      res.telephone = obj.telephone;

      // 弹出提示 通过提示调用另个一个更新函数
      this.setState({
        modal_visible: true,
        modal_text: res
      });
      return 0;
    } else if ("password" == name) {
      // 先读取
      (obj.current_password = this.state.current_password),
        (obj.new_password = this.state.new_password),
        (obj.verify_password = this.state.verify_password);

      // 校验 新密码
      if (
        obj.new_password == obj.verify_password &&
        5 < obj.verify_password.toString().length &&
        "" != obj.current_password
      ) {
        // 三个 condition 新旧密码相同 新密码长度大于 5 输入原密码
        // 新密码初次校验通过
        // 调用更新密码
        this.update_account_password();
      } else {
        // 密码不符合条件
        // 弹出错误
        Modal.warning({
          title: Languages[language]["propro.user_modal_warning"],
          content: Languages[language]["propro.user_modal_password_warning"],
          maskClosable: false,
          okText: Languages[language]["propro.user_modal_know"]
        });
        return -2;
      }
    } else {
      // 不存在的情况  除非注入
      return -1;
    }
  };
  // let res = '';

  render() {
    const { language } = this.props;

    const { modal_text } = this.state;

    //   检测是否已经登录 没有登录 弹出先登录 因为页面有可能过期 刷新时弹出
    if (0 != this.props.login_status) {
      // 未登录
      this.error_login();
      return -1;
    }

    // 提取更新 状态
    // 这里通过 判断它大于一个比较大的数 而不是通过等于0 因为可能存在 负数或者 undefined
    if (1000000 < this.props.update_info_time) {
      // 更新 处理更新结果
      if (0 != this.props.update_info_status) {
        // 失败
        setTimeout(() => {
          message.error(
            Languages[language]["propro.user_update_account_failed"],
            2
          );
        }, 800);
      } else {
        // 成功
        setTimeout(() => {
          message.success(
            Languages[language]["propro.user_update_account_success"],
            1
          );
        }, 800);
      }

      this.props.set_state_newvalue({ target: "update_info_time", value: 0 });
    }

    // 检测 更新 密码状态
    if (1000000 < this.props.update_passwd_time) {
      // 更新 处理更新结果
      if (0 == this.props.update_passwd_status) {
        // 成功
        setTimeout(() => {
          message.success(
            Languages[language]["propro.user_update_account_success"],
            3
          );
          // 清空输入的密码
          this.setState({
            current_password: "",
            new_password: "",
            verify_password: ""
          });
        }, 800);
      } else if (-1 == this.props.update_passwd_status) {
        // 原密码输入错误
        Modal.error({
          title: Languages[language]["propro.user_modal_warning"],
          content: Languages[language]["propro.user_current_password_false"],
          maskClosable: false,
          okText: Languages[language]["propro.user_modal_know"]
        });
      } else {
        // 失败
        setTimeout(() => {
          message.error(
            Languages[language]["propro.user_update_account_failed"],
            3
          );
        }, 800);
      }
      this.props.set_state_newvalue({ target: "update_passwd_time", value: 0 });
    }

    // 返回格式化的信息
    let modal_account_content = () => {
      return (
        <div>
          <b>
            <FormattedHTMLMessage id="propro.user_username" />
            :&nbsp;
          </b>
          {"" != modal_text.username ? (
            modal_text.username
          ) : (
            <span className={styles.danger_color}>NULL</span>
          )}
          <br />
          <b>
            <FormattedHTMLMessage id="propro.nick" />
            :&nbsp;
          </b>
          {"" != modal_text.nick ? (
            modal_text.nick
          ) : (
            <span className={styles.danger_color}>NULL</span>
          )}
          <br />
          <b>
            <FormattedHTMLMessage id="propro.email" />
            :&nbsp;
          </b>
          {"" != modal_text.email ? (
            modal_text.email
          ) : (
            <span className={styles.danger_color}>NULL</span>
          )}
          <br />
          <b>
            <FormattedHTMLMessage id="propro.telephone" />
            :&nbsp;
          </b>
          {"" != modal_text.telephone ? (
            modal_text.telephone
          ) : (
            <span className={styles.danger_color}>NULL</span>
          )}
          <br />
          <b>
            <FormattedHTMLMessage id="propro.organization" />
            :&nbsp;
          </b>
          {"" != modal_text.organization ? (
            modal_text.organization
          ) : (
            <span className={styles.danger_color}>NULL</span>
          )}
          <br />
        </div>
      );
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
          <FormattedHTMLMessage id="propro.user_setting" />
        </div>

        {/* 提示用户警告信息 */}
        <Modal
          title={
            <b>
              <FormattedHTMLMessage id="propro.user_modal_title" />
            </b>
          }
          visible={this.state.modal_visible}
          onOk={this.update_my_account}
          confirmLoading={this.state.modal_confirmLoading}
          onCancel={this.handle_modal_cancel}
          maskClosable={true}
          okText={<FormattedHTMLMessage id="propro.user_modal_confirm" />}
          cancelText={<FormattedHTMLMessage id="propro.user_modal_cancel" />}
        >
          <div>{modal_account_content()}</div>
        </Modal>

        <Row>
          <Col lg={24} xl={20} xxl={16}>
            <Tabs
              tabPosition="top"
              className={styles.dark_color}
              style={{
                background: "#fff",
                padding: "0px 20px 20px",
                border: "1px solid #e5e9f2"
              }}
            >
              <TabPane
                // tab={Languages[language]["propro.user_account"]}
                tab={<FormattedHTMLMessage id="propro.user_account" />}
                key="2019-8-6 20:49:54"
                style={{
                  padding: "20px 0px"
                }}
              >
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
                    <FormattedHTMLMessage id="propro.user_username" />
                  </div>
                  <Input
                    value={this.state.username}
                    name="username"
                    disabled={false}
                    // 默认不开启编辑
                    // onChange={this.set_info}
                    key="2019-8-6 20:40:03"
                    maxLength={30}
                  />
                </div>

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
                    <FormattedHTMLMessage id="propro.nick" />
                  </div>
                  <Input
                    value={this.state.nick}
                    name="nick"
                    onChange={this.set_info}
                    key="2019-8-6 20:33:49"
                    maxLength={30}
                  />
                </div>

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
                    <FormattedHTMLMessage id="propro.email" />
                  </div>
                  <Input
                    value={this.state.email}
                    name="email"
                    onChange={this.set_info}
                    key="2019-8-6 20:33:43"
                    maxLength={30}
                  />
                </div>

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
                    <FormattedHTMLMessage id="propro.telephone" />
                  </div>
                  <Input
                    value={this.state.telephone}
                    name="telephone"
                    onChange={this.set_info}
                    key="2019-8-6 20:33:39"
                    maxLength={30}
                  />
                </div>

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
                    <FormattedHTMLMessage id="propro.organization" />
                  </div>
                  <Input
                    value={this.state.organization}
                    name="organization"
                    onChange={this.set_info}
                    maxLength={30}
                  />
                </div>

                <div
                  style={{
                    marginTop: "40px"
                  }}
                >
                  <Button
                    type="primary"
                    style={{
                      padding: "0px 15px",
                      height: "32px",
                      lineHeight: "32px"
                    }}
                    name="account"
                    onClick={this.handle_submit}
                  >
                    <span>
                      &nbsp;
                      <FormattedHTMLMessage id="propro.user_saveinfo" />
                    </span>
                  </Button>
                </div>
              </TabPane>

              <TabPane
                tab={<FormattedHTMLMessage id="propro.user_password" />}
                key="2019-8-6 20:33:54"
                style={{
                  padding: "20px 0px"
                }}
              >
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
                    <FormattedHTMLMessage id="propro.user_current_password" />
                  </div>
                  <Input.Password
                    // type={"password"}
                    value={this.state.current_password}
                    name="current_password"
                    onChange={this.set_info}
                    key="2019-8-6 21:03:02"
                    maxLength={30}
                  />
                  <div
                    style={{
                      fontSize: "10px"
                    }}
                  >
                    <Link to="/login" className={styles.user_forgot_password}>
                      <FormattedHTMLMessage id="propro.forgot_password" />
                    </Link>
                  </div>
                </div>

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
                    <FormattedHTMLMessage id="propro.user_new_password" />
                  </div>
                  <Input.Password
                    // type={"password"}
                    value={this.state.new_password}
                    name="new_password"
                    onChange={this.set_info}
                    key="2019-8-6 21:04:59"
                    maxLength={30}
                  />
                </div>

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
                    <FormattedHTMLMessage id="propro.user_verify_password" />
                  </div>
                  <Input.Password
                    // type={"password"}
                    value={this.state.verify_password}
                    name="verify_password"
                    onChange={this.set_info}
                    key="2019-8-6 21:03:12"
                    maxLength={30}
                  />
                </div>

                <div
                  style={{
                    marginTop: "40px"
                  }}
                >
                  <Button
                    type="primary"
                    style={{
                      padding: "0px 15px",
                      height: "32px",
                      lineHeight: "32px"
                    }}
                    name="password"
                    onClick={this.handle_submit}
                  >
                    <span>
                      &nbsp;
                      <FormattedHTMLMessage id="propro.user_saveinfo" />
                    </span>
                  </Button>
                </div>
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </div>
    );
  }
}

export default UserSetting;
