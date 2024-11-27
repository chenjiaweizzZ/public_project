<template>
  <div class="upload">
    <div class="upload-img">
      <div class="text">图片</div>
      <div>
        <van-uploader
          v-model="fileList"
          :after-read="afterRead"
          @delete="beforeDelete"
          multiple
          :disabled="disabled"
        >
          <template #preview-cover="{ file }">
            <div class="preview-cover van-ellipsis">{{ file.name }}</div>
          </template>
          <div class="upload-picture-card">
            <Plus />
          </div>
        </van-uploader>
        <div class="tips">上传完成后，图片稍后会同步至申请页面，请耐心等待</div>
      </div>
    </div>

    <!-- <van-button
      :loading="loading"
      type="primary"
      size="large"
      loading-text="提交中"
      @click="Submit"
      :disabled="disabled"
      >提交</van-button
    > -->
  </div>
</template>
<script setup name="upLoadH5">
import { ref, inject } from "vue";
import { useRoute } from "vue-router";
import { Plus } from "@element-plus/icons-vue";
// import { Toast, showSuccessToast } from "vant";
let fileList = ref([]); // 上传完成组件返回的文件信息
let imageList = ref([]); // 上传完成后接口返回的路径
let loading = ref(false);
let disabled = ref(false);
const _http = inject("http");
const _apiUrl = inject("apiUrl");
const route = useRoute();
console.log(route.query.formId);

// 上传文件之前的钩子
const beforeRead = (file) => {
  if (file.type !== "image/jpeg") {
    showToast("请上传 jpg 格式图片");
    return false;
  }
  return true;
};
// 上传文件请求
const afterRead = async (files) => {
  if (files instanceof Array) {
    files.forEach((item) => {
      item.status = "uploading";
      item.message = "上传中...";
      const formData = new FormData();
      formData.append("file", item.file);
      _http
        .uploadFile(_apiUrl.uploadFile, {
          formData: formData,
        })
        .then((res) => {
          item.status = "done";
          imageList.value.push({
            mediaType: res.retData.mediaType,
            url: `${window.globalURL.SRFApiUrl}/file/image/${res.retData.id}`,
            status: "success",
          });
          _http.post(
            _apiUrl.savePic,
            {},
            {
              formId: route.query.formId,
              address: res.retData.id
              // address: `${window.globalURL.SRFApiUrl}/file/image/${res.retData.id}`,
            }
          );
        });
    });
  } else {
    files.status = "uploading";
    files.message = "上传中...";
    const formData = new FormData();
    formData.append("file", files.file);
    _http
      .uploadFile(_apiUrl.uploadFile, {
        formData: formData,
      })
      .then((res) => {
        files.status = "done";
        imageList.value.push({
          mediaType: res.retData.mediaType,
          url: `${window.globalURL.SRFApiUrl}/file/image/${res.retData.id}`,
          status: "success",
        });
        _http.post(
          _apiUrl.savePic,
          {},
          {
            formId: route.query.formId,
            address: res.retData.id
            // address: `${window.globalURL.SRFApiUrl}/file/image/${res.retData.id}`,
          }
        );
      });
  }
};

// 删除文件
const beforeDelete = (file, detail) => {
  // 把需要删除的项根据下标删除
  let url = imageList.value[detail.index].url
  let index = url.lastIndexOf("/")
  _http
    .post(
      _apiUrl.deletePic,
      {},
      {
        formId: route.query.formId,
        address: url.slice(index + 1),
      }
    )
    .then((res) => {
      if (res.retCode == 0) {
        imageList.value.splice(detail.index, 1);
      }
    });
};

const Submit = () => {
  if (imageList.value.length < 1) {
    showToast("请上传图片");
  } else {
    loading.value = true;
    setTimeout(() => {
      showSuccessToast("提交成功");
      disabled.value = true;
      loading.value = false;
    }, 1000);
  }
};
</script>
<style lang="scss" scoped>
.upload {
  padding: 20px;
  display: flex;
  flex-direction: column;

  .upload-img {
    flex: 1;
    display: flex;
    .text {
      width: 60px;
      margin: 10px 10px 0 0;
    }
  }
  .preview-cover {
    position: absolute;
    bottom: 0;
    box-sizing: border-box;
    width: 100%;
    padding: 4px;
    color: #fff;
    font-size: 12px;
    text-align: center;
    background: rgba(0, 0, 0, 0.3);
  }
  .upload-picture-card {
    width: 80px;
    height: 80px;
    display: flex;
    background-color: #fafafa;
    border-radius: 6px;
    border: 1px dashed #cdd0d6;
    align-items: center;
    justify-content: center;
    svg {
      width: 28px;
      height: 28px;
    }
  }
  .tips {
    // margin-left: 60px;
    margin-top: 10px;
    font-size: 14px;
  }
}
</style>
