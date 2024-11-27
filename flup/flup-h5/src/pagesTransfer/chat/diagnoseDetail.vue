<template>
  <div class="diagnoseDetail">
    <div class="diagnoseDetail-bg"></div>
    <!-- <div class="bg">
      <div class="bg1"></div>
      <div class="bg2"></div>
    </div>-->
    <div class="detailList">
      <div class="name">电子处方单</div>
      <div class="list-li">
        <div class="item-li">
          <span class="green"></span>
          诊断结果
        </div>
        <div class="item-content">{{diagnoseDetailData.consultDiagnose?diagnoseDetailData.consultDiagnose.chiefComplaint:"无"}}</div>
      </div>
      <div class="list-li">
        <div class="item-li">
          <span class="green"></span>
          诊断意见
        </div>
        <div class="item-content">{{diagnoseDetailData.consultDiagnose?diagnoseDetailData.consultDiagnose.dispositionSuggestions:'无'}}</div>
        <span v-if="!!zydiagnose" class="consult-report-title">中医诊断</span>
        <span v-if="!!zydiagnose" class="consult-report-content" v-html="zydiagnose"></span>
        <div v-if="!!zydiagnose" class="black-line"></div>
      </div>
      <div class="list-li">
        <div class="item-li">
          <span class="green"></span>
          RP
        </div>
        <div class="item-content">
          <!-- <div class="product">
            <div class="pill">西药处方</div>
            <div class="medicine">
              <div class="pro-name">奥美拉挫长荣胶囊</div>
              <div class="sum">1盒</div>
            </div>
            <div class="use">
              <div class="qwe">每次2片 每天1次 3天 口服</div>
            </div>
          </div>
          <div class="product">
            <div class="pill local">中药处方</div>
            <div class="medicine china">
              <div class="pro-name">白芷(后下) 10g</div>
            </div>
            <div class="use">
              <div class="qwe">每次2片 每天1次 3天 口服</div>
            </div>
          </div>-->
          <div v-for="(aitem,aindex) in recipes" :key="aindex" class="rp-item">
            <div class="medicine-type">
              <span :style="getMedicineTypeColor(aitem)">{{getMedicineType(aitem,aitem.index)}}</span>
            </div>
            <div v-for="(item,index) in aitem.consultRecipes" :key="index" style="width:100%;">
              <div class="medicine-name">
                <span>{{item.name}}</span>
                <span v-if="aitem.recipeType !== '3'">{{item.amount+item.amountUnit}}</span>
              </div>
              <div class="medicine-zy-item" v-if="item.prescriptiontype==='3'&&item.consultChineseMedicineList">
                <span
                  v-for="(zyitem,j) in item.consultChineseMedicineList"
                  :key="'i'+j"
                >{{zyitem.name+(zyitem.method?'('+zyitem.method+')':'')+zyitem.dosage+(zyitem.dosageUnit?zyitem.dosageUnit:'g')}}</span>
              </div>
              <div class="medicine-use">
                <span>用法用量：</span>
                <span v-if="!!item.dosageUnit">每次{{item.dosage+item.dosageUnit}}</span>
                <div v-if="item.timesState&&item.timesState!=='null'&&!!item.dosageUnit" class="divider-line-v"></div>
                <span v-if="item.timesState&&item.timesState!=='null'">{{item.timesState}}</span>
                <div class="divider-line-v"></div>
                <span>{{item.day}}天</span>
                <div class="divider-line-v"></div>
                <span>{{item.method}}</span>
                <div v-if="item.orderName" class="divider-line-v"></div>
                <span v-if="item.orderName">{{item.orderName}}</span>
                <div v-if="item.decoction" class="divider-line-v"></div>
                <span v-if="item.decoction">{{item.decoction}}</span>
              </div>
            </div>
          </div>
          <div class="payTips" v-if="recipes.length>0">注：请注意查收短信，并在短信平台进行支付！</div>
        </div>
      </div>
      <div class="list-li">
        <div class="item-li">
          <span class="green"></span>
          检查/检验项目
          <div class="pay" @click="toPay" v-if="type=='patient'">在线支付</div>
        </div>
        <div class="item-content">
          <div class="exam">
            <div>检查项目</div>
            <!-- <div class="exam-item">
              <div class="item-lable">X射线</div>
              <div class="item-value">腰腹</div>
            </div>-->
            <div class="sickness-histoty-wrapper exam-item" v-for="(checkItem,index) in jcList" :key="'a'+index">
              <div class="checkItem-name item-lable" style="margin-top:0px">{{checkItem.name}}</div>
              <div class="checkItem-content item-value">
                <div style="color:#666;">{{checkItem.project}}</div>
                <div class="sickness-histoty">{{checkItem.part}}{{checkItem.executeDepartment?`|${checkItem.executeDepartment}`:''}}</div>
              </div>
            </div>
          </div>
          <div class="exam">
            <div>检验项目</div>
            <!-- <div class="item-lable">
              <div class="item-lable">血常规</div>
            </div>-->
            <div class="sickness-histoty-wrapper item-lable" v-for="(checkItem,index) in jyList" :key="'b'+index">
              <div class="checkItem-name" style="margin-top:0px">{{checkItem.name}}</div>
              <div class="checkItem-content">
                <div style="color:#666;">{{checkItem.sampleType}}</div>
                <div class="sickness-histoty">{{checkItem.part}}{{checkItem.executeDepartment?`|${checkItem.executeDepartment}`:''}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="list-li">
        <div class="item-li">
          <span class="green"></span>
          问诊信息
        </div>
        <div class="item-content" v-if="diagnoseDetailData.consultPatient">
          <div class="info-type">患者信息</div>
          <div class="exam-item">
            <div class="item-lable">姓名</div>
            <div class="item-value">{{diagnoseDetailData.consultPatient.name}}</div>
          </div>
          <div class="exam-item">
            <div class="item-lable">性别</div>
            <div class="item-value">{{diagnoseDetailData.consultPatient.sex==1?'男':'女'}}</div>
          </div>
          <div class="exam-item">
            <div class="item-lable">年龄</div>
            <div class="item-value">{{diagnoseDetailData.consultPatient.age}}</div>
          </div>
          <div class="exam-item">
            <div class="item-lable">手机号</div>
            <div class="item-value">{{diagnoseDetailData.consultPatient.phone}}</div>
          </div>
          <div class="exam-item">
            <div class="item-lable">身份证号</div>
            <div class="item-value">
              {{ diagnoseDetailData.consultPatient.idCard.substring(0, 6) +
              '*********' +
              diagnoseDetailData.consultPatient.idCard.substring(14)}}
            </div>
          </div>
          <div class="exam-item">
            <div class="item-lable">就诊卡号</div>
            <div class="item-value">{{diagnoseDetailData.consultPatient.hisBrid}}</div>
          </div>
          <div class="info-type">主诉</div>
          <div class="info-value">{{diagnoseDetailData.consultDiagnose.chiefComplaint||"无"}}</div>
          <div class="info-type">现病史</div>
          <div class="info-value">{{diagnoseDetailData.consultDiagnose.illnessHistory||"无"}}</div>
          <div class="info-type">既往史</div>
          <div class="info-valuee">{{diagnoseDetailData.consultDiagnose.pastIllnessHistory||"无"}}</div>
          <div class="info-type">过敏史</div>
          <div class="info-value">{{diagnoseDetailData.consultDiagnose.allergicHistory||"无"}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import utils from '@/utils/utils.js';
export default {
  name: 'diagnoseDetail',
  data() {
    return {
      payed: false,
      orderId: '',
      diagnoseDetailData: {},
      recipes: [],
      jcList: [],
      jyList: [],
      zydiagnose: '',
      type: '',
    };
  },
  computed: {
    // ...mapState('chat',['isLogin','isDisabled','toBottom']),
  },
  created() {
    this.orderId = this.$route.query.orderId || ''; //c10e69d1137747b084c92c6a497f2c15
    this.type = this.$route.query.type || '';
    this.getDiagnoseDetail();
  },
  watch: {},
  methods: {
    getDiagnoseDetail() {
      this.recipes = [];
      this.jcList = [];
      this.jyList = [];
      this.$apis.diagnoseDetail({ orderId: this.orderId }).then((res) => {
        console.log(res, 'hhhhhhhhhh');
        this.diagnoseDetailData = Object.assign({ consultDiagnose: {} }, res);
        if (this.diagnoseDetailData.consultDiagnose && this.diagnoseDetailData.consultDiagnose.diagnose) {
          console.log(JSON.parse(this.diagnoseDetailData.consultDiagnose.diagnose), '==========');
          let dd = JSON.parse(this.diagnoseDetailData.consultDiagnose.diagnose).filter((item) => item.type === '1' || item.type === 1);
          let dd2 = JSON.parse(this.diagnoseDetailData.consultDiagnose.diagnose).filter((item) => item.type === '2' || item.type === 2);
          console.log('dd=', dd, 'dd2=', dd2);
          let result = '';
          let zyresult = '';
          dd.forEach(function (item, index) {
            let zdname = item.name;
            if (dd.length > 1) zdname = index + 1 + '.' + zdname;
            if (item.complain) zdname = zdname + ':' + item.complain;
            if (item.syndrome) zdname = zdname + '[' + item.syndrome + ']';
            let jsonchildInfo = JSON.parse(item.childInfo);
            if (jsonchildInfo.length > 0) {
              let childinfo = '';
              jsonchildInfo.forEach(function (child, i) {
                childinfo = childinfo + (child.name + (child.complain ? ':' + child.complain : '') + (i === jsonchildInfo.length - 1 ? '' : ';'));
                if (child.syndrome) {
                  childinfo = childinfo + '[' + child.syndrome + ']';
                }
              });
              zdname = zdname + '(' + childinfo + ')';
            }
            result += zdname + ';<br>';
          });
          this.diagnose = result;

          dd2.forEach(function (item, index) {
            let zdname = item.name;
            if (dd2.length > 1) zdname = index + 1 + '.' + zdname;
            if (item.complain) zdname = zdname + ':' + item.complain;
            if (item.syndrome) zdname = zdname + '[' + item.syndrome + ']';
            let jsonchildInfo = JSON.parse(item.childInfo);
            if (jsonchildInfo.length > 0) {
              let childinfo = '';
              jsonchildInfo.forEach(function (child, i) {
                childinfo = childinfo + (child.name + (child.complain ? ':' + child.complain : '') + (i === jsonchildInfo.length - 1 ? '' : ';'));
                if (child.syndrome) {
                  childinfo = childinfo + '[' + child.syndrome + ']';
                }
              });
              zdname = zdname + '(' + childinfo + ')';
            }
            zyresult += zdname + ';<br>';
          });
          this.zydiagnose = zyresult;
        }

        if (!this.diagnoseDetailData.consultPatient.photoUrl) {
          this.diagnoseDetailData.consultPatient.photoUrl = '';
        }
        console.log(this.diagnoseDetailData.consultPatient.name, 'detail');
        this.recipes = [];
        this.jcList = [];
        this.jyList = [];
        // if (!!res.xyRecipes && res.xyRecipes.length > 0) { this.recipes = (this.recipes || []).concat(res.xyRecipes || []) }

        // if (!!res.zcyRecipes && res.zcyRecipes.length > 0) { this.recipes = (this.recipes || []).concat(res.zcyRecipes || []) }

        // if (!!res.zyRecipes && res.zyRecipes.length > 0) { this.recipes = (this.recipes || []).concat(res.zyRecipes || []) }
        let xyRecipes = res.consultRecipeLinkDTOS.filter((item) => item.recipeType === '1' || item.recipeType === '2');
        let zyRecipes = res.consultRecipeLinkDTOS.filter((item) => item.recipeType === '3');
        xyRecipes.forEach((item, index) => {
          this.$set(item, 'index', index + 1);
        });
        zyRecipes.forEach((item, index) => {
          this.$set(item, 'index', index + 1);
        });
        this.recipes = [...xyRecipes, ...zyRecipes];
        console.log(this.recipes, '======');
        res.consultReports.forEach((item) => {
          if (item.type === 1) {
            this.jcList.push(item);
          } else if (item.type === 2) {
            this.jyList.push(item);
          }
        });
        this.getWriteCase();
      });
    },
    getWriteCase() {
      if (this.$route.query.writecase) {
        this.writecase = true;
        let caseDetail = this.$route.query.writecase;
        if (this.diagnoseDetailData.consultDiagnose) this.diagnoseDetailData.consultDiagnose = {};
        this.diagnoseDetailData.consultDiagnose.chiefComplaint = caseDetail.chiefComplaint;
        this.diagnoseDetailData.consultDiagnose.illnessHistory = caseDetail.illnessHistory;
        this.diagnoseDetailData.consultDiagnose.pastIllnessHistory = caseDetail.pastIllnessHistory;
        this.diagnoseDetailData.consultDiagnose.allergicHistory = caseDetail.allergicHistory;
        this.diagnoseDetailData.consultDiagnose.diagnose = caseDetail.nursingAdvice;
        this.diagnoseDetailData.consultDiagnose.dispositionSuggestions = caseDetail.dispositionSuggestions;
      }
    },
    getMedicineType(item, index) {
      let xylength = this.recipes.filter((item) => item.recipeType === '1' || item.recipeType === '2').length;
      let zylength = this.recipes.filter((item) => item.recipeType === '3').length;
      if (item.recipeType === '1') {
        return xylength > 1 ? '西药处方' + index : '西药处方';
      } else if (item.recipeType === '2') {
        return '中成药';
      } else if (item.recipeType === '3') {
        return zylength > 1 ? '中药处方' + index : '中药处方';
      } else {
        return '未知';
      }
    },
    getMedicineTypeColor(item) {
      if (item.recipeType === '1') {
        return { backgroundColor: '#189BF6' };
      } else if (item.recipeType === '2') {
        return { backgroundColor: '#4CBAFF' };
      } else if (item.recipeType === '3') {
        return { backgroundColor: '#F78A00' };
      } else return {};
    },
    async readMessageCallback() {
      if (this.preSales) {
        await this.$apis.personalReadMessageCallback({
          personalConsultId: this.preSalesId,
        });
      } else {
        await this.$apis.readMessageCallback({
          consultId: this.consultId,
        });
      }
    },
    toPay() {
      window.location.href = this.diagnoseDetailData.payUrl;
    },
  },
};
</script>
<style scoped lang="scss">
@import './style/index.scss';
.diagnoseDetail {
  background: #f6f6f6;
  height: 100%;
  width: 100%;
  .diagnoseDetail-bg {
    width: 100%;
    height: 240px;
    background: url('../../assets/images/diagnose-bg1.png') no-repeat 100%;
    background-size: cover;
  }
  .bg {
    position: absolute;
    left: 8px;
    right: 0px;
    top: 12px;
    height: 26px;
    z-index: 999;
    .bg1 {
      width: 100%;
      height: 16px;
      background: linear-gradient(180deg, #168638 20%, #32ae57 80%);
      border-radius: 16px 0 0 16px;
    }
    .bg2 {
      border-radius: 0 0 0 16px;
      margin-top: -10px;
      width: 100%;
      height: 19px;
      background: linear-gradient(180deg, #61c676 0%, rgba(170, 198, 228, 0) 80%);
    }
  }
  .detailList {
    position: absolute;
    left: 12px;
    right: 12px;
    top: 26px;
    bottom: 12px;
    background: #fff;
    padding: 10px;
    overflow-y: scroll;
    .name {
      font-family: PingFang SC;
      font-size: 16px;
      font-weight: 500;
      line-height: 20px;
      letter-spacing: 0.2px;
      color: #111111;
      text-align: center;
      padding-top: 18px;
    }
    .list-li {
      border-bottom: #e2e2e2 1px solid;
      padding: 10px;
      .item-li {
        font-family: PingFang SC;
        font-size: 17px;
        font-weight: 500;
        line-height: 20px;
        letter-spacing: 0.2px;
        color: #111111;
        display: flex;
        align-items: center;
        .green {
          background: #168638;
          width: 6px;
          height: 6px;
          border-radius: 6px;
          margin-right: 4px;
        }
        .pay {
          margin-left: auto;
          width: 64px;
          height: 18px;
          font-family: PingFang SC;
          font-size: 12px;
          font-weight: normal;
          line-height: 14px;
          letter-spacing: 0px;
          border-radius: 9.5px;
          color: #ffffff;
          background: #f0a022;
          text-align: center;
          line-height: 18px;
        }
      }
      .item-content {
        font-family: PingFang SC;
        font-size: 15px;
        font-weight: normal;
        line-height: 22.5px;
        letter-spacing: 0.2px;
        color: #666666;
        .product {
          .pill {
            width: 58px;
            height: 17px;
            line-height: 17px;
            color: #fff;
            font-family: PingFang SC;
            font-size: 12px;
            font-weight: 500;
            line-height: 12px;
            letter-spacing: 0.2px;
            color: #ffffff;
            background: #1c97fc;
            padding: 3px 4px 2px 4px;
            margin: 10px 0 0 0;
          }
          .local {
            background: #f78a00;
          }
          .medicine {
            display: flex;
            margin: 12px 0 4px 0;
            .pro-name {
              font-family: PingFang SC;
              font-size: 15px;
              font-weight: normal;
              line-height: 18px;
              letter-spacing: 0px;
              color: #333333;
            }
            .sum {
              margin-left: auto;
            }
          }
          .use {
            display: flex;
            font-family: PingFang SC;
            font-size: 14px;
            font-weight: normal;
            line-height: 23px;
            letter-spacing: 0.2px;
            color: #666666;
          }
        }
        .payTips {
          margin-top: 6px;
          font-family: PingFang SC;
          font-size: 14px;
          font-weight: normal;
          line-height: 17px;
          letter-spacing: 0.19px;
          color: #ff0000;
          text-align: center;
          background: #fff4f4;
          padding: 3px;
        }
        .exam-item {
          display: flex;
          .item-lable {
          }
          .item-value {
            margin-left: auto;
          }
        }
        .info-type {
          font-family: PingFang SC;
          font-size: 15px;
          font-weight: 500;
          line-height: 19px;
          letter-spacing: 0.2px;
          color: #333333;
          margin: 10px 0;
        }
        .info-value {
          font-family: PingFang SC;
          font-size: 16px;
          font-weight: normal;
          line-height: 24px;
          letter-spacing: 0.2px;
          color: #666666;
        }
      }
    }
  }
}
</style>