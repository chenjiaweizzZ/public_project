<template>
  <div class="taskList">
    <div class="title">
      <span>今日任务</span>
      <IconRefresh @refresh="init()"></IconRefresh>
      <div class="right" @click="changeRecord">
        <img class="card-icon" src="@/assets/img/unfinish-icon.png" alt v-if="allRecard" />
        <img class="card-icon" src="@/assets/img/radio-icon.png" alt v-else />
        只显示未随访
      </div>
    </div>
    <div class="list infinite-scroll" ref="listRef">
      <div v-for="(item, index) in taskList" class="item-list" :key="index">
        <div class="card-1">
          <div class="item-title">
            <img class="card-icon" src="@/assets/img/card-icon.png" width="16" height="16" alt />
            {{item.patientName}}
          </div>
          <div v-for="(task,key, indexs) in item.planClassfiedArr" class="task-list" :key="key">
            <div class="plan-name">
              <div class="short"></div>
              {{ key}}
            </div>
            <div class="hospital_name">{{task[0].hospitalName}}</div>
            <div class="task" v-for="m in task" :key="m.serialNo">
              <img class="card-icon" src="@/assets/img/finished-icon.png" width="16" height="16" alt v-if="m.flupTimeReal" />
              <img class="card-icon" src="@/assets/img/unfinish-icon.png" width="16" height="16" alt v-if="!m.flupTimeReal" />
              <div class="task-name" @click.stop="taskDetail(m)">{{m.flupType}}</div>
              <div class="assistant">{{m.doctorName}}</div>
            </div>
          </div>
        </div>
        <div class="card-2">
          <div class="cycle-left"></div>
          <div class="cycle-right"></div>
          <div style="display: flex;align-items: center;">
            <img class="card-icon" src="@/assets/img/phone-icon.png" width="16" height="16" alt />
            {{ item.phone }}
          </div>
          <div class="bind" v-if="item.nickNameList.length!=0">
            <div v-for="p in item.nickNameList" class="bind-list" :key="p.id">
              <img class="card" src="@/assets/img/person-icon.png" width="16" height="16" alt />
              {{p}}
            </div>
          </div>
        </div>
      </div>
      <div v-if="loading" class="loading">正在加载中...</div>
      <div v-if="!scrollRight" class="loading">已经到底啦~</div>
      <div v-if="taskList.length==0" class="no-data"></div>
    </div>
    <DrawerDetail :planDetailContent="planDetailContent" v-if="drawer" @close="closeDrawer"></DrawerDetail>
  </div>
</template>
<script setup>
// import FollowupContent from './components/followup_content.vue';
import DrawerDetail from './components/drawerDetail';
import { onMounted, ref, inject, onUnmounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { CirclePlus } from '@element-plus/icons-vue';
const _http = inject('http');
const _apiUrl = inject('apiUrl');
const allRecard = ref(false);
const drawer = ref(false);

const planDetailContent = ref({});
const pageNo = ref(1);
const loading = ref(false);
// const language = ref('zh-cn');
const taskList = ref([]);
const listRef = ref();
const scrollRight = ref(true);
const disabledDate = (time) => {
  return Date.now() - 3600 * 1000 * 24 > time.getTime();
};
onMounted(() => {
  // pageNo.value = 1;
  // taskList.value = [];
  // getTaskList();
  init();
  let el;
  if (listRef) {
    el = listRef.value;
  } else {
    el = window;
  }
  el.addEventListener('scroll', handleScroll);
});
onUnmounted(() => {
  let el;
  if (listRef.value) {
    el = listRef.value;
  } else {
    el = window;
  }
  el.removeEventListener('scroll', handleScroll);
});
function init() {
  scrollRight.value = true;
  pageNo.value = 1;
  taskList.value = [];
  getTaskList();
}
function changeRecord() {
  allRecard.value = !allRecard.value;
  init();
}
const getTaskList = () => {
  loading.value = true;
  _http
    .get(_apiUrl.getFlupPatientPlusPlan, {
      params: {
        pageNo: pageNo.value,
        pageSize: 20,
        flupStatus: allRecard.value ? '' : 'Executing',
      },
    })
    .then((res) => {
      if (res) {
        if (res.list.length > 0) {
          taskList.value = [...taskList.value, ...res.list];
          pageNo.value++;
          taskList.value.forEach((i) => {
            i.nickNameList = i.nickname ? i.nickname.split(',') : [];
            //根据计划分类
            i.planClassfiedArr = classifiedAccordingToKey(i.planList, 'flupPlan');
          });
          scrollRight.value = res.list.length < 20 ? false : true; //是否继续滑动加载条件
        } else {
          scrollRight.value = false;
        }
        loading.value = false;
      } else {
        ElMessage.error('当前系统错误');
      }
    });
};
//根据计划分类
function classifiedAccordingToKey(objectArray, key) {
  var newObj = {};
  objectArray.forEach(function (obj) {
    var array = newObj[obj[key]] || [];
    array.push(obj);
    newObj[obj[key]] = array;
  });
  return newObj;
}
//滑动加载
const handleScroll = () => {
  // console.log('pageNopageNo');
  const container = document.querySelector('.infinite-scroll');
  const { scrollTop, scrollHeight, clientHeight } = container;
  if (scrollTop + clientHeight >= scrollHeight && !loading.value && scrollRight.value) {
    getTaskList();
  }
};
function taskDetail(task) {
  planDetailContent.value = { ...task };
  drawer.value = true;
}
function closeDrawer(obj) {
  if (obj.refresh) {
    // taskList.value = [];
    // pageNo.value = 1;
    // getTaskList();
    init();
  }
  if (obj.close) {
    drawer.value = false;
    planDetailContent.value = {};
  }
}
</script>
<style lang="scss" scoped>
.taskList {
  position: relative;
  height: 100%;
  .title {
    position: relative;
    padding: 10px;
    border: 1px solid #e6e6e6;
    display: flex;
    align-items: center;
    z-index: 999;
    .icon-refresh {
      margin-left: 10px;
    }
    .right {
      cursor: pointer;
      position: absolute;
      right: 10px;
      display: flex;
      align-items: center;
      img {
        width: 16px;
        height: 16px;
        margin-right: 10px;
      }
    }
  }
  .list {
    overflow-y: scroll;
    position: absolute;
    top: 43px;
    bottom: 0px;
    padding: 10px;
    left: 0;
    right: 0;
    .item-list {
      margin-bottom: 14px;
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.08);
      .card-1 {
        .item-title {
          background: #d6efdd;
          font-family: MicrosoftYaHei-Bold-Bold;
          font-size: 14px;
          font-weight: bold;
          letter-spacing: 0em;
          color: #111111;
          padding: 6px 10px;
          border-radius: 8px 8px 0 0;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          img {
            width: 16px;
            height: 16px;
            margin-right: 10px;
          }
          .el-button {
            height: 20px;
            border-radius: 10px;
            padding: 0px 8px;
            gap: 10px;
            background: #ffffff;
            font-family: MicrosoftYaHei;
            font-size: 12px;
            line-height: 20px;
            color: #333333;
            border: #ffffff;
            float: right;
          }
        }
        .task-list {
          margin-bottom: 10px;
          padding: 0 10px;
          .plan-name {
            // color: #502e00;
            // margin-bottom: 10px;
            // background: #fff3d3;
            // border-radius: 10px;
            // display: inline-block;
            // font-size: 12px;
            // line-height: 20px;
            // padding: 0 8px;
            font-family: MicrosoftYaHei-Regular;
            font-size: 14px;
            font-weight: normal;
            line-height: 20px;
            letter-spacing: 0em;
            color: #111111;
            display: flex;
            align-items: center;
            .short {
              width: 4px;
              height: 17px;
              opacity: 1;
              background: #2d81ed;
              margin-right: 6px;
            }
          }
          .hospital_name {
            font-family: MicrosoftYaHei;
            font-size: 12px;
            font-weight: normal;
            letter-spacing: 0em;
            color: #666666;
            margin-bottom: 10px;
            padding-left: 10px;
          }
          .task {
            display: flex;
            font-family: MicrosoftYaHei-Regular;
            font-size: 14px;
            font-weight: normal;
            text-align: right;
            letter-spacing: 0px;
            align-items: center;
            .task-name {
              color: #2d81ed;
              margin-left: 8px;
              width: 100%;
              text-align: left;
              cursor: pointer;
            }
            .assistant {
              text-align: right;
              color: #111111;
              width: 100%;
            }
          }
        }
      }
      .card-2 {
        padding: 10px;
        font-family: MicrosoftYaHei-Regular;
        font-size: 14px;
        font-weight: normal;
        letter-spacing: 0px;
        color: #333333;
        border-top: 1px #e6e6e6 dashed;
        background: #fafafa;
        position: relative;
        .cycle-left {
          position: absolute;
          left: -5px;
          top: -5px;
          width: 10px;
          height: 10px;
          // border-radius: 0 5px 5px 0;
          // background: #f6f6f6;
          background: url('../../assets/img/cycle-1.png') no-repeat;
          background-size: cover;
        }
        .cycle-right {
          position: absolute;
          right: -5px;
          top: -5px;
          width: 10px;
          height: 10px;
          // border-radius: 5px 0 0 5px;
          // background: #f6f6f6;
          background: url('../../assets/img/cycle-2.png') no-repeat;
          background-size: cover;
        }
        .bind {
          display: flex;
          color: #666;
          .bind-list {
            width: 100%;
            display: flex;
            align-items: center;
          }
        }
      }
    }
    .loading {
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    .no-data {
      width: 100%;
      height: 100%;
      background: #fff url('../../assets/img/noData1.png') no-repeat center 30%;
      background-size: 42%;
    }
  }
  .el-overlay {
    .el-drawer__header {
      margin-bottom: 0px;
    }
    .drawer-header {
      font-family: MicrosoftYaHei;
      font-size: 16px;
      font-weight: normal;
      letter-spacing: 0em;
      color: #111111;
      display: flex;
      align-items: center;
      .short {
        width: 4px;
        height: 17px;
        opacity: 1;
        background: #2d81ed;
        margin-right: 6px;
      }
    }
    .el-drawer__body {
      .base {
        border-bottom: 1px solid #c4cbd4;
        font-family: MicrosoftYaHei;
        font-size: 14px;
        font-weight: normal;
        text-align: right;
        letter-spacing: 0em;
        color: #3b5370;
        padding-bottom: 12px;
        .base-centent {
          display: flex;
          margin-top: 10px;
          .label {
            width: 35%;
            text-align: right;
            min-width: 84px;
          }
          .text {
            color: #111111;
            margin-left: 14px;
            width: 100%;
            text-align: left;
            .el-input {
              width: 100% !important;
            }
          }
        }
      }
      .content {
        padding: 12px 0 0 0;
        font-family: MicrosoftYaHei;
        font-size: 16px;
        font-weight: normal;
        letter-spacing: 0em;
        color: #111111;
        .detail {
          background: #fafafa;
          padding: 10px;
          margin-top: 10px;
          .question {
            .el-form-item__label {
              justify-content: flex-start !important;
            }
          }
        }
      }
    }
    .el-drawer__footer {
      .destory {
        border: 1px solid #db524b;
        color: #db524b;
        background: #ffffff;
      }
      .tips {
        color: #666;
        text-align: center;
        font-size: 12px;
        padding: 10px 0;
      }
    }
  }
}
</style>

