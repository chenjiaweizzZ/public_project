<template>
  <div
    :class="isMine ? 'my-text file-message ' : 'file-message'"
    @click="Download"
  >
    <div style="word-break: break-all;">
      {{ message.content.data.name }}
    </div>
    <img
      :class="isMine ? 'my-img' : ''"
      v-if="
        message.content.data.suffix == '.xls' ||
          message.content.data.suffix == '.xlsx'
      "
      src="../../../assets/images/xlsx.png"
      mode=""
    />
    <img
      :class="isMine ? 'my-img' : ''"
      v-if="
        message.content.data.suffix == '.doc' ||
          message.content.data.suffix == '.docx'
      "
      src="../../../assets/images/docx.png"
      mode=""
    />
    <img
      :class="isMine ? 'my-img' : ''"
      v-if="message.content.data.suffix == '.pdf'"
      src="../../../assets/images/PDF.png"
      mode=""
    />
  </div>
</template>
<script>
export default {
  props: {
    message: {
      type: Object,
      value: ""
    },
    isMine: {
      type: Boolean,
      value: true
    }
  },
  methods: {
    async Download() {
      let url = this.message.content.data.url;
      if (!url) return;
      const res = await fetch(url);
      const blob = await res.blob();
      const objectURL = URL.createObjectURL(blob);
      let link = document.createElement("a");
      let fileName = this.message.content.data.name;
      link.style.display = "none";
      link.href = objectURL;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
</script>
<style lang="scss" scoped>
.file-message {
  width: 234px;
  background: #fbfbfb;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  font-size: 14px;
  flex-direction: row-reverse;
  justify-content: flex-end;
  cursor: pointer;
}

.my-text {
  flex-direction: row;
  justify-content: space-between;
}

.file-message img {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  flex-shrink: 0;
  margin-right: 10px;
}

.file-message .my-image {
  margin-right: 0;
}
</style>
