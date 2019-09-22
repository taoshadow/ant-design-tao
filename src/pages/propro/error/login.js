//  /src/pages/propro/error/login.js
// 需要登录 弹出
import Link from "umi/link";
import { FormattedHTMLMessage } from "react-intl";
//   引入自定义的语言文件 js 格式
import messages_zh from "../../../locale/zh_CN";
import messages_en from "../../../locale/en_US";

const Languages = {
  zh: messages_zh,
  en: messages_en
};

import "bootstrap/dist/css/bootstrap.min.css";

class ErrorLogin extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        你好 ,<Link to="/login">请先登录</Link>
      </div>
    );
  }
}

export default ErrorLogin;
