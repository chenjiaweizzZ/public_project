<!-- 组件不支持动态删减，key是根据index来做的-->

<template>
  <!-- 病历导航栏 -->
  <el-row
    style="border:1px solid #e6e6e6;"
    :style="{ height: height }"
    type="flex"
    class="case-history-nav"
  >
    <div class="container">
      <!-- <DischargeAbstract/> -->
      <slot></slot>
    </div>
    <div class="menu">
      <el-row type="flex" align="middle">
        <div class="blue-line"></div>
        <span style="font-size: 14px;color:#111;margin-left:8px">病历文书</span>
      </el-row>
      <el-row>
        <!-- <div v-for="(item1, index1) in list" :key="index1">
          <el-row @click.native="clickTitle(index1)" class="menu-title" type="flex" align="middle">
            <i :class="isUnFlod[index1] ? 'el-icon-arrow-right' : 'el-icon-arrow-down'" style="font-weight:bold"></i>
            <span class="title-text">{{ item1.title }}</span>
          </el-row> -->
        <ul class="menu-list">
          <li
            class="menu-item"
            :class="activeResult == index ? 'menu-item-active' : ''"
            v-for="(item, index) in list"
            :key="index"
            @click="clickItem(item, index)"
          >
            <div class="item-blue-line"></div>
            <div style="margin-left:12px">
              <div class="menu-item-title">{{ item.title }}</div>
              <div class="menu-item-time">{{ item.time }}</div>
            </div>
          </li>
        </ul>
        <!-- </div> -->
      </el-row>
    </div>
  </el-row>
</template>

<script>
export default {
  props: {
    activeIndex: {
      type: Number,
      default: 0
    },
    height: {
      type: String,
      default: '300px'
    },
    list: {
      type: Array,
      default: () => [
        {
          title: '手术记录',
          time: '200'
        },
        {
          title: '手术记录',
          time: '200'
        }
      ]
    }
  },

  watch: {
    activeIndex(data) {
      this.activeResult = data
    }
  },
  data() {
    return {
      isUnFlod: [],
      activeResult: 0,
      selectedItem: {
        index: this.activeIndex
      }
    }
  },
  components: {
    DischargeAbstract: () => import('../components/DischargeAbstract.vue')
  },
  methods: {
    // clickTitle(index) {
    //   let ele = this.$refs[`ulEle${index}`][0];
    //   if (ele.offsetHeight > 0) {
    //     ele.style.height = "0px";
    //   } else {
    //     ele.style.height = "auto";
    //   }
    //   this.$set(this.isUnFlod, index, !this.isUnFlod[index]);
    // },
    clickItem(item, index) {
      this.selectedItem.index = index
      this.$emit('seletedData', {
        item,
        index
      })
    }
  },
  created() {
    let isUnFlod = this.list.map(() => false)
    this.isUnFlod = this.$Vue.observable(isUnFlod)
  }
}
</script>

<style lang="scss" scoped>
.case-history-nav {
  height: 100%;
  .container {
    height: 100%;
    // flex-grow: 1;
    overflow: auto;
    flex: 6;
  }
  .menu {
    border-left: 1px solid #e6e6e6;
    height: 100%;
    width: 200px;
    padding: 8px;
    overflow: auto;
    flex: 1;
  }
  .menu-title {
    height: 60px;
    cursor: pointer;
    color: #111111;
    font-size: 14px;

    &:hover {
      background: #eee;
    }
  }
  .menu-item {
    height: 60px;
    cursor: pointer;
    color: #111111;
    font-size: 14px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    &:hover {
      background: #eee;
    }
    .item-blue-line {
      width: 4px;
      // background: #0075ff;
      height: 100%;
    }
    .menu-item-title {
    }
    .menu-item-time {
      font-size: 12px;
      color: #666;
      margin-top: 5px;
    }
    &.menu-item-active {
      background: #e4f1ff;
      .item-blue-line {
        background: #0075ff;
      }
    }
  }
  .title-text {
    margin-left: 8px;
  }
  .menu-list {
    overflow: hidden;
    margin-top: 10px;
  }
}
</style>
