<template>
  <div>
    <div class="preview_left">
      <ul class="tab">
        <li :class="{'current':isTel}" @click="isTel = true">
          <i class="tel"></i>
        </li>
        <li :class="{'current':!isTel}" @click="isTel = false">
          <i class="computer"></i>
        </li>
      </ul>
    </div>
    <div class="content" :style="{'paddingBottom':authState == 1?'77px':'0'}">
      <div class="tel-bg" v-if="isTel">
        <div class="tel-pane">
          <div class="tel-content">
            <TemplateContent :type="type" :serial_no="$route.query.serial_no"></TemplateContent>
          </div>
        </div>
      </div>
      <div class="computer-pane" v-else>
        <TemplateContent :type="type" :serial_no="$route.query.serial_no"></TemplateContent>
      </div>
    </div>
    <div class="btns" v-if="authState == 1">
      <el-button
        type="danger"
        plain
        @click="openRejectDialog"
        style="min-width: 56px"
        >拒绝</el-button
      >
      <el-button type="success" @click="subAuditing">通过审核</el-button>
    </div>
    <rejectDialog ref="rejectDialog" @submit="onCancel" :serialNo="$route.query.serial_no" :type="newType"></rejectDialog>
  </div>
</template>

<script>
import TemplateContent from './template'
import rejectDialog from '@/pagesTransfer/auditManagement/components/rejectDialog'
export default {
  name: 'preview',
  data() {
    return {
      isTel: true,
    }
  },
  components: {
    TemplateContent,
    rejectDialog,
  },
  computed: {
    type() {
      //  if(this.$route.query.type === 'WJDC' || this.$route.query.serial_no.includes('WJDC')){
      //    return 1
      //  } else if(this.$route.query.type ==='JKXJ' || this.$route.query.serial_no.includes('JKXJ')) {
      //    return 2
      //  } else if(this.$route.query.type ==='TJXJ') {
      //    return 3
      //  } else if(this.$route.query.type === 'YYTX') {
      //    return 4
      //  } else if(this.$route.query.type === 'CYTX') {
      //    return 5
      //  }
      if (this.$route.query.serial_no.includes('WJDC')) {
        return 1
      } else if (this.$route.query.serial_no.includes('JKXJ')) {
        return 2
      } else if (this.$route.query.serial_no.includes('TJXJ')) {
        return 3
      } else if (this.$route.query.serial_no.includes('YYTX')) {
        return 4
      } else if (this.$route.query.type === 'CYTX') {
        return 5
      }
    },
    authState(){
      //0预览 1审核
      if(this.$route.query.authState){
        return this.$route.query.authState
      }
      return 0;
    },
    newType(){
      if (this.$route.query.serial_no.includes('WJDC')) {
        return 4
      } else if (this.$route.query.serial_no.includes('JKXJ')) {
        return 3
      }
      return 0;
    }
  },
  methods:{
    onCancel(){
      if(this.$isProduction && this.authState == 1){
        this.removeTab();
      }
    },
    removeTab(){
      var urlx
      if (location.pathname) {
        urlx = location.origin + location.pathname
      } else {
        urlx = location.origin + '/pc'
      }
      let url = urlx + '/#/auditManagement?type='+ this.newType;
      window.parent.postMessage(
          JSON.stringify({
            method: 'addTab',
            url: url,
            title:'审核管理',
          }),
          '*'
      )
    },
    openRejectDialog(){
      this.$refs.rejectDialog.isrefuse = true;
    },
    //审核通过
    subAuditing(){
      this.$confirm('确定要通过审核吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(async() => {
          await this.$apis.authApply({
            authState:1,
            serialNo:this.$route.query.serial_no,
            type:this.newType,
          })
          this.removeTab();
        }).catch(() => {       
        });
    },

  }
}
</script>

<style lang="scss" scoped>
/deep/.preview_left {
  width: 60px;
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 9;
  background: #fff;
  .tab {
    border: 1px solid #e6e9ed;
    padding: 0 5px;
    margin-bottom: 0;
    li {
      background: #f5f7fa;
      border-radius: 4px;
      line-height: 60px;
      height: 60px;
      width: 100%;
      margin: 5px 0;
      cursor: pointer;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      &.current {
        background: #00bc9c;
        .tel {
          background-position: 0 0;
        }
        .computer {
          background-position: -49px 0;
        }
      }
      .tel {
        background: url('../../../assets/images/ico.png');
        background-position: -24px 0;
        display: block;
        width: 23px;
        height: 31px;
      }
      .computer {
        background: url('../../../assets/images/ico.png');
        background-position: -82px 0;
        width: 32px;
        display: block;
        height: 31px;
      }
    }
  }
}
.content {
  img {
    max-width: 100%;
    height: auto;
  }
  padding-top: 10px;
  padding-right: 10px;
  display: flex;
  flex-direction: row-reverse;
  .tel-bg {
    width: 388px;
    height: 790px;
    background: url('../../../assets/images/bg-tel.png');
    margin: auto;
    position: relative;
    .tel-pane {
      position: absolute;
      top: 89px;
      left: 19px;
      overflow: hidden;
      height: 570px;
      width: 320px;
      .tel-content {
        overflow-y: scroll;
        overflow-x: hidden;
        height: 570px;
        width: 330px;
        img {
          max-width: 100% !important;
        }
      }
    }
  }
  .computer-pane {
    width: calc(100vw - 110px);
    overflow-x: scroll;
    min-height: calc(100vh - 20px);
    border: 1px solid #999;
    padding: 10px;
  }
}
.btns{
  width: 100%;
  height: 66px;
  background: #FFFFFF;
  box-shadow: 0px -2px 6px 0px rgba(0, 0, 0, 0.1819);
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 100;
  padding: 0 40px;
  line-height: 66px;
  text-align: right;
}
</style>