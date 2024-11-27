import { ElLoading, ElMessage } from "element-plus";
let _loadingInstance = null;
let _loadingTimer = null;
let msg = {
  /**
   * 正在加载
   * @param title 显示文案
   * @param timeout 时间
   */
  showLoading: (title = "loading", timeout = 5000) => {
    _loadingInstance && _loadingInstance.close();
    _loadingInstance = ElLoading.service({
      lock: true,
      text: title,
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
    _loadingTimer && clearTimeout(_loadingTimer);
    _loadingTimer = setTimeout(() => {
      _loadingInstance && _loadingInstance.close();
    }, timeout);
  },
  /**
   * 关闭正在加载
   */
  hideLoading: () => {
    _loadingInstance && _loadingInstance.close();
    _loadingTimer && _loadingInstance.close();
  },
  /**
   * 自动消失的提示框
   * @param msg 信息内容
   * @param type 消息类型； success(默认) / info / warning / error
   */
  toast: (message, type = "success") => {
    ElMessage({
      type,
      message,
    });
  },
};

export default msg;
