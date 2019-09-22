import { Card, Upload, Button, Icon, message } from "antd";
import reqwest from "reqwest";
import { FormattedMessage, FormattedHTMLMessage } from "react-intl";

class Test1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: []
    };
  }

  state = {
    uploading: false
  };

  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append("csv_library_file_list", file);
    });

    this.setState({
      uploading: true
    });

    // You can use any AJAX library you like
    reqwest({
      url: "/propro_server/library/update",
      token: window.localStorage.getItem("propro_token"),

      method: "post",
      processData: false,
      data: formData,
      success: () => {
        this.setState({
          fileList: [],
          uploading: false
        });
        console.log("upload successfully.");
      },
      error: () => {
        this.setState({
          uploading: false
        });
        console.log("upload failed.");
      }
    });
  };

  // before_upload = file => {
  //   this.setState(state => ({
  //     fileList: [...state.fileList, file]
  //   }));
  //   return false;
  // };

  render() {
    const { uploading, fileList } = this.state;
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file]
        }));
        return false;
      },
      fileList
    };

    return (
      <div>
        <Upload
          {...props}
          // beforeUpload={this.before_upload()}
          //
        >
          <Button>
            <Icon type="upload" /> Select File
          </Button>
        </Upload>
        <Button
          type="primary"
          onClick={this.handleUpload}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{ marginTop: 16 }}
        >
          {uploading ? "Uploading" : "Start Upload"}
        </Button>
      </div>
    );
  }
}

export default Test1;
