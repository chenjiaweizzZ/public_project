/**
 * 转入hooks
 */
import { ref, reactive } from "vue";
import { http } from "@/utils/http";
import { apiUrl } from "@/utils/api";
import msg from "@/utils/msg";
export default function (refuseFormRef) {
  let dialogVisible = ref(false);
  /**
   * 拒绝转入申请
   */
  const Refuse = () => {
    dialogVisible.value = true;
  };
  const handleClose = () => {
    if (!refuseFormRef.value) return;
    refuseFormRef.value.resetFields();
    dialogVisible.value = false;
  };
  const refuseConfirm = (formEl, params, transferType, operateType) => {
    if (!formEl) return;
    formEl.validate((valid, fields) => {
      if (valid) {
        http.post(apiUrl.reviewRecord, {}, params).then((res) => {
          if (res.retCode == 0) {
            msg.toast("操作成功");
            routingJump(transferType, operateType);
          }
        });
      }
    });
  };
  /**
   * 同意转入申请
   */
  const InAgree = (params, transferType, operateType, params1) => {
    ElMessageBox.confirm("是否同意转入申请？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    }).then(() => {
      http
        .post(apiUrl.reviewRecord, { params: params1 }, params)
        .then((res) => {
          if (res.retCode == 0) {
            msg.toast("操作成功");
            routingJump(transferType, operateType);
          }
        });
    });
  };
  /**
   * 路由跳转
   */
  const routingJump = (transferType, operateType) => {
    // 删除该tab页
    let beforeTitle = "";
    if (transferType == "MZ") {
      beforeTitle = operateType == 2 ? "门诊转入查看" : "门诊转入审核";
    }
    if (transferType == "ZY") {
      beforeTitle = operateType == 2 ? "住院转入查看" : "住院转入审核";
    }
    window.parent.postMessage(
      JSON.stringify({
        method: "removeTab",
        url: "",
        title: "",
        beforeTitle,
      }),
      "*"
    );
    // 跳转到列表tab页
    let urlx = "";
    if (location.pathname) {
      urlx = location.origin + location.pathname;
    } else {
      urlx = location.origin + "/pc";
    }
    let url =
      transferType == "MZ"
        ? `${urlx}#/outpatientServiceTo?isBack=true`
        : `${urlx}#/beinHospitalTo?isBack=true`;
    let title = transferType == "MZ" ? "门诊转入列表" : "住院转入列表";
    window.parent.postMessage(
      JSON.stringify({
        method: "addTab",
        url,
        title,
      }),
      "*"
    );
  };
  return {
    dialogVisible,
    Refuse,
    handleClose,
    refuseConfirm,
    InAgree,
  };
}
