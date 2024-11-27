/**
 * 图片上传hooks
 */
import { ref } from "vue";
import msg from "@/utils/msg";
import { Plus } from "@element-plus/icons-vue";
export default function () {
  let dialogVisible1 = ref(false);
  let dialogImageUrl = ref("");
  // 上传文件之前的钩子
  const beforeUpload = (file) => {
    let fileMsg = file.name.substring(file.name.lastIndexOf(".") + 1);
    if (
      fileMsg == "JPEG" ||
      fileMsg == "JPG" ||
      fileMsg == "PNG" ||
      fileMsg == "jpeg" ||
      fileMsg == "jpg" ||
      fileMsg == "png"
    ) {
      return true;
    } else {
      msg.toast("请上传图片", "warning");
      return false;
    }
  };
  // 图片放大查看
  const handlePictureCardPreview = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url;
    dialogVisible1.value = true;
  };
  return {
    Plus,
    dialogVisible1,
    dialogImageUrl,
    beforeUpload,
    handlePictureCardPreview,
  };
}
