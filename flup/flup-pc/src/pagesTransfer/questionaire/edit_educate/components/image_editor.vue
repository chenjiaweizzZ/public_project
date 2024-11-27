<template>
  <div>
    <div class="el-upload el-upload--picture-card upload" @click="onImgClick">
      <div v-if="imgUrl">
        <img :src="imgUrl" class="img" />
        <div v-if="!isEdit" class="delete-wrapper">
          <i class="el-icon-delete"></i>
        </div>
      </div>
      <i v-else class="el-icon-plus"></i>
    </div>

    <el-dialog
      title="编辑封面"
      :visible.sync="isDialogShow"
      :close-on-click-modal="false"
      width="650px"
    >
      <div class="marginX20 margin20X">
        <SelectImg @on-select="onOriginImgChange" class="margin-bottom20"></SelectImg>
        <div class="row1">
          <VueCropper
            class="img-cropper"
            ref="cropper"
            outputType="png"
            :img="originImg"
            :outputSize="1"
            :info="true"
            :canMove="true"
            :canMoveBox="true"
            :autoCrop="true"
            :autoCropWidth="200"
            :autoCropHeight="200"
            :fixed="true"
            @realTime="realTime"
          ></VueCropper>
          <div class="cropper-preview flex-align-justify">
            <div :style="{transform:`scale(${ 150 / previews.w })`}">
              <div :style="previews.div" class="preview">
                <img :src="previews.url" :style="previews.img" />
              </div>
            </div>
          </div>
        </div>
        <div style="display:flex;flex-direction:row-reverse;" class="margin-top20">
          <el-button @click="onComfirm" type="primary" class="margin-left20">保存</el-button>
          <el-button @click="onCancel">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { VueCropper } from "vue-cropper";
import SelectImg from "./select_img";
import {base64StringToBlob} from 'blob-util';

export default {
  components: {
    VueCropper,
    SelectImg
  },
  data() {
    return {
      imgUrl: "",
      originImg: "",
      previews: {},
      isDialogShow: false,
      isEdit: false
    };
  },
  methods: {
    onCancel() {
      this.isDialogShow = false;
    },
    onImgClick() {
      if (this.isEdit) {
        this.isDialogShow = true;
        this.isEdit = true;
      } else {
        if (this.imgUrl) {
          this.imgUrl = "";
          this.$emit("input", "");
        } else {
          this.isDialogShow = true;
          this.isEdit = true;
        }
      }
    },
    onOriginImgChange(data) {
      this.originImg = data;
    },
    onComfirm() {
      this.$refs.cropper.getCropData((data) => {
        console.log("压缩前的图片大小：" + data.length)
        let _this=this
        let img = new Image()
        img.src = data
        img.onload = function() {
          let data = _this.compress(img)
          console.log(data.slice(23))
          let blob = base64StringToBlob(data.slice(23))
          _this.imgUrl = window.URL.createObjectURL(blob);
          _this.$emit("on-change", blob);
          _this.isDialogShow = false;
        }
      })
    },
    compress(img) {
      let canvas = document.createElement("canvas"),
          ctx = canvas.getContext("2d"),
          initSize = img.src.length,
          width = img.width,
          height = img.height
        canvas.width = width
        canvas.height = height
        ctx.fillStyle = "#fff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, width, height)
        let ndata = canvas.toDataURL("image/jpeg", 0.8)
        console.log("压缩后的图片大小：" + ndata.length)
        return ndata
    },
    // onComfirm() {
    //   this.$refs.cropper.getCropBlob(blob => {
    //     if (!blob) return;
    //     blob.lastModifiedDate = new Date();
    //     blob.name = + new Date();
    //     this.imgUrl = window.URL.createObjectURL(blob);
    //     this.$emit("on-change", blob);
    //     this.isDialogShow = false;
    //   });
    // },
    // 实时预览函数
    realTime(data) {
      this.previews = data;
    }
  }
};
</script>

<style lang="scss" scoped>
.img {
  width: 100%;
  height: 100%;
}
.img-cropper {
  height: 440px !important;
  width: 440px !important;
}

.cropper-preview {
  border: 1px dashed #c0ccda;
  border-radius: 5px;
  width: 150px;
  height: 150px;
  overflow: hidden;
  .preview {
    overflow: hidden;
  }
}
.row1 {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.upload {
  position: relative;
  .delete-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.4);
    width: 100%;
    opacity: 0;
    height: 100%;
    transition: all 0.3s;
    .el-icon-delete {
      color: white;
    }
  }
  &:hover .delete-wrapper {
    opacity: 1;
  }
}
</style>
