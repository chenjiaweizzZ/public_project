<template>
  <div
    class="demo-image__preview"
    v-for="(item, index) in list"
    :key="index"
  >
    <el-image
      style="width: 90px; height: 90px"
      :src="item"
      :zoom-rate="1.2"
      :max-scale="7"
      :min-scale="0.2"
      :preview-src-list="list"
      :initial-index="index"
      fit="cover"
    />
  </div>
</template>
<script setup>
import { computed } from "vue";
const props = defineProps({
  imageList: {
    type: Array,
    default: () => [],
  },
});

const list = computed(() => {
  return props.imageList.map((item) => {
    return item.url;
  });
});
</script>
<style lang="scss" scoped>
.demo-image__preview {
  margin: 0 10px 10px 0;
  img {
    width: 90px;
    height: 90px;
  }
}
</style>
