<template>
  <div>
    <div class="btn-wrapper">
      <span class="btn-text">{{text}}</span>
      <input
        class="btn-input"
        type="file"
        accept="image/png, image/jpeg, image/gif, image/jpg"
        @change="selectImg"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "SelectImg",
  props: {
    text: {
      type: String,
      default: "选择图片"
    }
  },
  methods: {
    selectImg(e) {
      // 选择图片
      if (!e.target.files.length) {
        return;
      }
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        this.$message({
          type: 'error',
          message:"图片类型必须是.gif,jpeg,jpg,png,bmp中的一种"
        })
        return false;
      }
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.onload = e => {
        this.$emit("on-select", e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-wrapper {
  position: relative;
  width: 80px;
  height: 30px;
  border-radius: 3px;
  font-size: 12px;
  color: #fff;
  background-color: #00bc9c;
  border-color: #00bc9c;
  cursor: pointer;
  display: inline-block;
  line-height: 1;
  text-align: center;
  box-sizing: border-box;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  &:hover {
    background-color: #00a085;
    border-color: #007763;
  }
  .btn-text {
    line-height: 30px;
  }
}
.btn-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 80px;
  height: 30px;
  opacity: 0;
  cursor: pointer;
  font-size: 0;
}
// .btn:hover {
//   color: #fff;
//   background-color: #00a085;
//   border-color: #007763;
// }
</style>
