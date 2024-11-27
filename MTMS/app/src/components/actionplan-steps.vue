<template>
  <div class="selfSteps">
    <van-steps direction="vertical" :active="-1" class="pageSteps">
      <van-step :class="[dataList.length > 1 ? '' : 'oneList']" v-for="(item,index) in dataList" :key="index">
        <div class="top">
          <div class="timeBox">
            <div :class="item.status == 2 ? 'hisStory time' : 'time'" v-for="(citem,cindex) in item.showTime" :key="cindex">
              <!-- <van-icon name="setting-o" size="18px"></van-icon> -->
              <img src="../assets/images/disTime.png" v-if="cindex != 0 && item.status != 2" />
              <img src="../assets/images/entime.png" v-if="cindex == 0 && item.status != 2" />
              <img src="../assets/images/disTime.png" v-if="item.status == 2" />
              <div class="timeDetail">
                <p>{{citem.date}}</p>
                <p>{{citem.startTime}}-{{citem.endTime}}</p>
              </div>
            </div>

          </div>
          <div class="checkMore" @click="checkTime(item)">查看更多</div>
        </div>

        <div class="DetailBox" @click.stop="todetail(item.id)">
          <div class="boxTop">
            <p :class="item.delflag == 1 && item.status == 0 ? 'nodel title' : 'title'">
              <span>{{item.theme}}</span>
              <span class="typeTips">{{item.typename}}</span>
            </p>
            <img src="../assets/images/deleteIcon.png" @click.stop="updatestatus(item.id)" v-if="item.delflag == 1 && item.status == 0"
            />
          </div>

          <div class="intro">
            <p>主讲人/主持人：{{item.speakerName}}</p>
            <p>科室：{{item.showofficename}}</p>
            <p class="p-title">活动地点：{{item.place}}</p>
          </div>
        </div>
      </van-step>
      <van-step class="oneItem" v-if="dataList.length == 1">
      </van-step>
    </van-steps>
    <van-dialog v-model="showTime" :title="dialogTitle" className="timeDialog">
      <van-steps direction="vertical" :active="-1" class="detailTime">
        <van-step v-if="pastTime.length > 1">
          <p class="pastTime">
            <span>{{pastTime.length}}个已过时段</span>
            <span class="actionBtn" v-if="!isShowDetail" @click="toggleArrow">展开<van-icon name="arrow-down" color="#2F7DCD"
                size="15px"></van-icon></span>
            <span class="actionBtn" v-else @click="toggleArrow">收起<van-icon name="arrow-up" color="#2F7DCD" size="15px"></van-icon></span>
          </p>
          <div class="pastBox" v-if="isShowDetail">
            <p v-for="(item,index) in pastTime" :key="index">{{item.dateStr}}</p>
          </div>
        </van-step>
        <van-step v-if="pastTime.length == 1">
          <p>{{pastTime[0].dateStr}}</p>
        </van-step>
        <van-step v-for="(item,index) in currentTime" :key="indx">
          <p :class="index == 0 ? 'firstItem' : ''"> <img src="../assets/images/entime.png" class="timeicon" v-if="index == 0"
              width="18" /><span>{{item.dateStr}}</span></p>
        </van-step>
      </van-steps>
    </van-dialog>
  </div>
</template>
<script>
  import { mapState, mapActions } from 'vuex'
  export default {
    data() {
      return {
        timeList: [1, 2, 3],
        currentTime: [],
        pastTime: [],
        showTime: false,
        dialogTitle: "",
        isShowDetail: false
      }
    },
    props: {
      dataList: {
        type: Array,
        default: function () {
          return []
        }
      },
      ishistory: {
        type: Boolean,
        default: false
      }
    },
    filters: {
      filterTime(val) {
        let temp = val.split(":")
        console.log(temp, "----")
        return temp[0] + ":" + temp[1]
        // if (temp.length > 2) {
        //   return temp[0] + ":" + temp[1]
        // } else {
        //   return val
        // }

      }
    },
    watch: {
      dataList(newVal, oldVal) {
        newVal.forEach(item => {
          item.actiontime = JSON.parse(item.actiontime)
          let timeArr = []
          let current = (new Date()).getTime()
          item.actiontime.forEach(titem => {
            let temp = titem.date.replace(/-/g,"/")
            let timeTemp = new Date(temp + " " + titem.endTime).getTime();
            let subtract = Number(timeTemp) - Number(current)
            let tempDate = titem.date.split("-")
            titem.date = tempDate[1] + "-" + tempDate[2]
            titem.startTime = titem.startTime.split(":").slice(0, 2).join(":")
            titem.endTime = titem.endTime.split(":").slice(0, 2).join(":")
            titem.subtract = subtract
            timeArr.push({
              subtract,
              ...titem
            })

          })

          item.showTime = timeArr.filter(fitem => { return fitem.subtract > 0 }).sort((a, b) => {
            return a.subtract - b.subtract
          })
          if (item.showTime.length == 0) {
            item.showTime = timeArr.slice(0,2);
          } else if (item.showTime.length > 3) {
            item.showTime = item.showTime.slice(0,2);
          }
          let temp = [];
          item.speakerlist.forEach(citem => {
            temp.push(citem.uname)
          })
          item.speakerName = temp.join("、");
        })
      }
    },
    methods: {
      ...mapActions([
        'showConfirm',
        'toast'
      ]),
      todetail(id) {
        let self = this;
        this.$router.push({
          name: 'fdAction_detail',
          query: {
            id: id,
            ishistory: self.ishistory
          }
        })
      },
      updatestatus(param) {
        let self = this;
        this.showConfirm({
          title: '温馨提示',
          msg: '您是否要删除当前教学活动计划？',
          theme: 'modal-confirm modal-white',
          cancel: function () { },
          ok: function () {
            self.post('/actionplan/delactionplanbyid', {
              command: 'actionplan/delactionplanbyid',
              sessionid: $.cookie('sid'),
              loginid: $.cookie('uid'),
              id: param,
            }).done((data) => {
              if (data && data.errcode == 0) {
                self.toast('删除成功~');
                self.$emit('confirm', '');//传给父组件
              }
            });
          },
        })
      },
      toggleArrow() {
        this.isShowDetail = !this.isShowDetail
      },
      checkTime(item) {
        this.showTime = true
        item.actiontime.forEach(item => {
          let dateTemp = item.date.split("-");
          let startTime = item.startTime.split(":").slice(0, 2).join(":")
          let endTime = item.endTime.split(":").slice(0, 2).join(":")
          item.dateStr = dateTemp[0] + "月" + dateTemp[1] + "日 " + startTime + "-" + endTime
        })
        // this.allTime = item.actiontime
        this.pastTime = item.actiontime.filter(fitem => {
          return fitem.subtract <= 0
        }).sort((a, b) => {
          return a.subtract - b.subtract
        })
        this.currentTime = item.actiontime.filter(fitem => {
          return fitem.subtract > 0
        }).sort((a, b) => {
          return a.subtract - b.subtract
        })
        console.log(this.pastTime, this.currentTime, "----")
        this.dialogTitle = item.theme
      }
    }
  }
</script>
<style>
  .pageSteps .van-step--vertical:not(:last-child)::after,
  .timeDialog .van-step--vertical:not(:last-child):after {
    border-bottom-width: 0px !important;
  }
  .pageSteps .van-step:last-child .van-step__line {
    width: 1px!important;
  }

  .pageSteps .van-step--vertical {
    padding-right: 0px !important;
    padding-top: 0px !important;
    /* padding-top: 14px!important; */
  }

  .detailTime .van-step--vertical {
    padding-right: 20px !important;

  }

  .timeDialog {
    border-radius: 8px !important;
    /* min-height: 200px; */
  }

  .timeDialog .van-dialog__content {
    min-height: 320px;
    max-height: 370px;
    overflow-y: scroll;
    margin-top: 16px;
  }

  .timeDialog .van-dialog__header {
    font-weight: bold;
    font-size: 18px;
    color: #111;
  }

  .oneItem {
    padding: 0 !important;
  }

  .oneList {
    padding-bottom: 0 !important;
  }
</style>
<style scoped>
  .p-title {
    white-space: pre-wrap;  
    word-wrap: break-word;    
  }
  p {
    margin: 0 !important;
  }

  /* .selfSteps {
    margin-top: 8px;
  } */

  /* -------------------- */
  .timeBox {
    width: calc(100% - 41px);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
    overflow-x: scroll;
    padding-top: 10px;
  }

  .timeBox img {
    width: 18px;
    height: 18px;
  }

  .timeBox::-webkit-scrollbar {
    display: none;
  }

  .time {
    width: 108px;
    /* height: 65px; */
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    font-size: 15px;
    color: #333333;
    flex-shrink: 0;
    padding-bottom: 14px;
  }

  .timeBox .time:nth-child(2),
  .time:nth-child(3),.hisStory {
    opacity: 0.5;
  }

  .timeDetail {
    margin-left: 6px;

  }

  .timeDetail p:nth-child(1) {
    line-height: 21px;
    font-weight: 700;
  }

  .timeDetail p:nth-child(2) {
    font-size: 12px;
    color: #999999;
    line-height: 17px;
  }

  .top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .DetailBox {
    position: relative;
    /* width: calc(100% - 18px)!important; */
    border: 0.5px solid rgba(205, 205, 205, 1);
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.04);
    border-radius: 6px;
    box-sizing: content-box;
    padding: 14px 16px;
    margin-left: -22px;
    background: #fff;
    margin-right: 14px;
    z-index: 20;
  }

  .DetailBox .title {

    font-weight: bold;
    font-size: 17px;
    color: #111111;
    letter-spacing: 0.21px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .boxTop {
    display: flex;
    justify-content: space-between;
  }

  .boxTop img {
    width: 17px;
    height: 17px;
    margin-top: 3px;
  }

  .title span:nth-child(1) {
    line-height: 24px;
    display: inline;
  }

  .nodel {
    width: calc(100% - 24px);
  }

  .DetailBox .typeTips {
    display: inline-block;
    padding: 0 4px;
    border: 1px solid rgba(178, 178, 178, 1);
    font-size: 12px;
    color: #666666;
    letter-spacing: 0.21px;
    height: 15px;
    line-height: 15px;
    border-radius: 2px;
    font-weight: normal;
    margin-left: 8px;

  }

  .DetailBox .intro {
    font-size: 14px;
    color: #333333;
    margin-top: 10px;
    line-height: 20px;
  }

  .intro p {
    margin-bottom: 4px !important;
  }

  .checkMore {
    height: 51px;
    padding-top: 11px;
    width: 32px;
    font-size: 12px;
    color: #2F7DCD;
    letter-spacing: 0.6px;
    line-height: 18px;
    padding-left: 8px;
    box-shadow: 0px 0px 4px 0px rgba(232, 232, 232, 0.5);
    box-sizing: content-box;
  }

  .pastTime {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pastTime:nth-child(1) {
    font-size: 16px;
    color: #111;
  }

  .pastTime .actionBtn {
    font-size: 14px;
    color: #2F7DCD;
  }

  .pastTime .actionBtn i {
    margin-left: 3px;
    vertical-align: middle;
  }

  .pastBox {
    background: #F6F6F6;
    padding: 12px;
    margin-top: 10px;
  }

  .firstItem {
    font-size: 16px;
    color: #2F7DCD;
    font-weight: bold;
  }

  .timeicon {
    margin-right: 8px;
    vertical-align: middle;
  }

  .pastBox p {
    line-height: 24px;
  }
</style>