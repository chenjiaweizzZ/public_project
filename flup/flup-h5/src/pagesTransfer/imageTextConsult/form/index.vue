<template>
  <div class="itConsult">
    <van-overlay :show="tipShow" :lock-scroll="false">
      <form-tip @agree="agree" @close="close"></form-tip>
    </van-overlay>
    <div class="itConsult-payBtns" v-show="!isDetail">
      <div class="itConsult-payBtns-left">
        <span class="itConsult-payBtns-left-text">总付款</span>
        <span class="itConsult-payBtns-left-price">{{ price }}</span>
        <span class="itConsult-payBtns-left-unit">元</span>
      </div>
      <div class="itConsult-payBtns-right" @click="toPay">
        提交咨询
      </div>
    </div>
    <div class="itConsult-form" :class="{'bottom18' : !isDetail}">
      <div class="itConsult-form-patient" @click.stop="changePatient">
        <span class="itConsult-form-patient-left">就诊人</span>
        <span class="itConsult-form-patient-right">{{ patientInfo.text }}<van-icon name="arrow" color="#111111" size="25" /></span>
      </div>
      <div class="itConsult-form-title">咨询目的<span class="itConsult-form-title-required">*</span></div>
      <div class="itConsult-form-content">
        <van-checkbox-group v-model="consultPurpose" direction="horizontal" :disabled="isDetail">
          <van-checkbox :name="1" icon-size="24px" checked-color="#32AE57" shape="square">病情咨询</van-checkbox>
          <van-checkbox :name="2" icon-size="24px" checked-color="#32AE57" shape="square">报告解读</van-checkbox>
          <van-checkbox :name="3" icon-size="24px" checked-color="#32AE57" shape="square">用药咨询</van-checkbox>
          <van-checkbox :name="0" icon-size="24px" checked-color="#32AE57" shape="square">其它</van-checkbox>
        </van-checkbox-group>
      </div>
      <div class="itConsult-form-title">病情描述<span class="itConsult-form-title-required">*</span></div>
      <div class="itConsult-form-content itConsult-form-content2">
        <van-field v-model="diseaseDescription" :readonly="isDetail" :placeholder="isDetail ? '' : '请详细描述您的状况，例如年龄、性别、症状、持续时间、检查结果、以往病史等，以便医生能更好地分析诊断您的病情'" type="textarea" rows="2" autosize maxlength="400" :show-word-limit="!isDetail" />
      </div>
      <div class="itConsult-form-title">{{ isDetail ? '病情图片' : '上传病情图片' }}</div>
      <div class="itConsult-form-content noMarginBottom">
        <div class="itConsult-form-content-imgs">
          <div class="itConsult-form-content-img" v-for="(item, index) in imageList" :key="index">
            <img :src="$baseURL.ICDMApiUrl + '/file/image/' + item" @click="viewImg(index)">
            <img src="@/assets/images/delect.png" class="delete-icon" @click="deleteImg(index)" v-show="!isDetail">
          </div>
          <div class="itConsult-form-content-img" v-if="imageList.length < 9 && !isDetail">
            <img src="@/assets/images/addPhoto.png" alt="" @click="getImage()">
          </div>
        </div>
      </div>
      <div class="itConsult-form-tip" v-show="!isDetail">请上传最多9张,如病历、检查检验、药品等相关图片</div>
      <div class="itConsult-form-title">服药情况<span class="itConsult-form-title-required">*</span></div>
      <div class="itConsult-form-content itConsult-form-content2">
        <van-field v-model="medicineStatus" :readonly="isDetail" :placeholder="isDetail ? '' : '请输入药物名称及服用频率和剂量（如没有则填无）'" type="textarea" rows="2" autosize />
      </div>
      <div class="itConsult-form-title">补充描述</div>
      <div class="itConsult-form-content itConsult-form-content2">
        <van-field v-model="otherDescription" :readonly="isDetail" :placeholder="isDetail ? '' : '请输入内容'" type="textarea" rows="1" autosize />
      </div>
      <div class="itConsult-form-title">想获得什么帮助</div>
      <div class="itConsult-form-content itConsult-form-content2">
        <van-field v-model="whatHelp" :readonly="isDetail" :placeholder="isDetail ? '' : '请输入内容'" type="textarea" rows="1" autosize />
      </div>
      <div class="itConsult-form-title">线下医院是否就诊过</div>
      <div class="itConsult-form-content  noMarginBottom">
        <van-radio-group v-model="hasOfflineClinic" direction="horizontal" @change="offlineCliniChange" :disabled="isDetail">
          <van-radio :name="1" checked-color="#32AE57" shape="square" icon-size="24px">有</van-radio>
          <van-radio :name="0" checked-color="#32AE57" shape="square" icon-size="24px">没有</van-radio>
        </van-radio-group>
      </div>
      <div class="itConsult-form-content  noMarginBottom" v-show="hasOfflineClinic">
        <van-field v-model="visitingHospital" label="就诊医院" :placeholder="isDetail ? '' : '请输入'" input-align="right" :readonly="isDetail" />
      </div>
      <div class="itConsult-form-content" v-show="hasOfflineClinic">
        <van-field v-model="diagnosticResults" label="诊断结果" :placeholder="isDetail ? '' : '请输入'" input-align="right" :readonly="isDetail" />
      </div>
      <div class="itConsult-form-title">是否有其他症状</div>
      <div class="itConsult-form-content  noMarginBottom">
        <van-radio-group v-model="hasOtherSymptom" direction="horizontal" :disabled="isDetail">
          <van-radio :name="1" checked-color="#32AE57" shape="square" icon-size="24px">有</van-radio>
          <van-radio :name="0" checked-color="#32AE57" shape="square" icon-size="24px">没有</van-radio>
        </van-radio-group>
      </div>
      <div class="itConsult-form-title">症状持续时间</div>
      <div class="itConsult-form-content  noMarginBottom">
        <van-radio-group v-model="durationOfSymptoms" direction="horizontal" :disabled="isDetail">
          <van-radio :name="0" checked-color="#32AE57" shape="square" icon-size="24px">近一周</van-radio>
          <van-radio :name="1" checked-color="#32AE57" shape="square" icon-size="24px">一个月</van-radio>
          <van-radio :name="2" checked-color="#32AE57" shape="square" icon-size="24px">几个月</van-radio>
          <van-radio :name="3" checked-color="#32AE57" shape="square" icon-size="24px">常年持续</van-radio>
        </van-radio-group>
      </div>
      <!-- <div class="itConsult-form-agreement" v-if="!isDetail">
        <div class="itConsult-form-box">
          <span class="checkbox-container">
          <van-checkbox v-model="isAgree" shape="square" checked-color="#32AE57"></van-checkbox>
        </span>
        <span class="p1">点击咨询按钮即表示同意</span>
        <span class="p2" @click="agreementShow = true">《互联网诊疗风险告知及知情同意书》</span>
        </div>
      </div>
      <div class="itConsult-form-agreement-tip" v-if="!isDetail">医生基于患者自述病情所发表的言论仅供参考，不能作为诊断和治疗的直接依据。</div> -->
    </div>
    <van-popup v-model="showPicker" round position="bottom" get-container="#app">
      <van-picker title="切换就诊人" :columns="patientList" @cancel="onCancel" @confirm="onConfirm" show-toolbar :default-index="pickerBindIndex" ref="patientPicker" />
    </van-popup>
    <van-popup v-model="agreementShow" position="bottom" :style="{ height: '80%' }">
      <div class="itConsult-agreement">
        <div class="itConsult-agreement-btnGroup">
          <van-icon name="cross" size="20" @click="agreementShow = false" />
        </div>
        <div class="itConsult-agreement-title">
          {{ myAgrementTitle }}
        </div>
        <p>
          {{ myAgreementContent }}
        </p>
      </div>
    </van-popup>
  </div>
</template>

<script>
import formTip from "../components/formTip.vue";
import { ImagePreview } from "vant";
import { agreementTitle, agreementContent } from "../hooks/agreemenText.js";
import axios from "axios";
export default {
  components: {
    formTip,
  },
  data() {
    return {
      isDetail: false,
      tipShow: false,
      patientList: [],
      patientInfo: "",
      showPicker: false,
      pickerBindIndex: 0,
      pickerBindIndexSave: 0,
      consultPurpose: [],
      diseaseDescription: "",
      medicineStatus: "",
      otherDescription: "",
      whatHelp: "",
      hasOtherSymptom: "",
      radio: "",
      value: "",
      imageList: [],
      specId: "",
      price: "",
      visitingHospital: "",
      diagnosticResults: "",
      durationOfSymptoms: "",
      hasOfflineClinic: "",
      isAgree: false,
      agreementShow: false,
      myAgrementTitle: agreementTitle,
      myAgreementContent: agreementContent
    };
  },
  // computed: {
  //   agrementTitle() {
  //     return agrementTitle
  //   }
  // },
  created() {
    if (this.$route.query.orderSerialNo) {
      this.isDetail = true;
      this.getDetail(this.$route.query.orderSerialNo);
    } else {
      let { specId, price } = this.$route.query;
      this.specId = specId;
      this.tipShow = true;
      this.price = price;
      this.getPatientList();
    }
  },
  methods: {
    agree() {
      this.tipShow = false;
    },
    close() {
      this.$router.back();
    },
    getDetail(orderSerialNo) {
      this.$apis.selectConsultGraphicDetail(orderSerialNo).then((res) => {
        let { retData } = res;
        this.getPatientList(retData.patientId);
        this.consultPurpose = retData.consultPurpose.split(",").map(Number);
        this.diseaseDescription = retData.diseaseDescription;
        if(retData.platConsultGraphicFilesDtos) {
          this.imageList = retData.platConsultGraphicFilesDtos.map(
            (i) => i.fileRecordId
          );
        }
        this.visitingHospital = retData.visitingHospital;
        this.diagnosticResults = retData.diagnosticResults;
        this.medicineStatus = retData.medicineStatus;
        this.otherDescription = retData.otherDescription;
        this.whatHelp = retData.whatHelp;
        this.hasOfflineClinic = retData.hasOfflineClinic;
        this.hasOtherSymptom = retData.hasOtherSymptom;
        this.durationOfSymptoms = retData.durationOfSymptoms;
      });
    },
    getPatientList(patientId) {
      this.$apis.getPatientList().then((res) => {
        if (res && res.retData && res.retData.list && res.retData.list.length) {
          this.patientList = res.retData.list.map((item) => {
            return {
              text:
                item.patientName +
                "   " +
                item.idNo.substring(0, 4) +
                "***********" +
                item.idNo.substring(item.idNo.length - 4),
              value: item.userId,
              isDefault: item.isDefault,
            };
          });
          let patientDefault = {};
          if (patientId) {
            patientDefault = this.patientList.find(
              (i) => i.userId == patientId
            );
          } else {
            patientDefault = this.patientList.find((i) => i.isDefault == 1);
          }
          if (patientDefault) {
            this.patientInfo = patientDefault;
            this.pickerBindIndex = this.patientList.findIndex(
              (i) => i.isDefault == 1
            );
            this.pickerBindIndexSave = this.patientList.findIndex(
              (i) => i.isDefault == 1
            );
          } else {
            this.patientInfo = this.patientList[0];
          }
        } else {
          this.patientInfo = "暂无就诊人";
        }
      });
    },
    getImage() {
      let that = this;
      wx.chooseImage({
        count: 9 - that.imageList.length, // 默认9
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album"], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          let localIds = res.localIds;
          that.$toast.loading({
            duration: 0,
          });
          console.log("--------------------", res);
          localIds.forEach((i) => {
            wx.getLocalImgData({
              localId: i.toString(),
              success: function (info) {
                let localData = info.localData;
                if (localData.indexOf("data:image") != 0) {
                  //判断是否有这样的头部
                  localData = "data:image/jpeg;base64," + localData;
                }
                localData = localData
                  .replace(/\r|\n/g, "")
                  .replace("data:image/jgp", "data:image/jpeg");
                let file = that.base64toFile(localData);
                let formData = new FormData();
                formData.append("file", file);
                axios({
                  method: "post",
                  url: that.$baseURL.ICDMApiUrl + "/file/upload",
                  headers: {
                    openId:
                      localStorage.getItem("openId") ||
                      (localStorage.getItem("userInfo") &&
                        JSON.parse(localStorage.getItem("userInfo")).openId),
                    "content-type": "multipart/form-data",
                  },
                  data: formData,
                }).then((res) => {
                  let imageUrl = res.data.retData.id;
                  // that.$baseURL.ICDMApiUrl +
                  // "/file/image/" +
                  that.imageList.push(imageUrl);
                  that.$toast.clear();
                });
                // let url = URL.createObjectURL(file);
                // that.base64List.push(file);
                // that.imageList.push(url);
              },
            });
          });
          console.log(that.imageList);
        },
      });
    },
    deleteImg(index) {
      this.imageList.splice(index, 1);
    },
    viewImg(index) {
      ImagePreview({
        images: this.imageList.map(
          (i) => this.$baseURL.ICDMApiUrl + "/file/image/" + i
        ),
        startPosition: index,
      });
    },
    base64toFile(dataurl, filename = "file") {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let suffix = mime.split("/")[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime,
      });
    },
    changePatient() {
      if (this.isDetail) {
        return;
      }
      this.showPicker = true;
    },
    onCancel() {
      this.showPicker = false;
      this.pickerBindIndex = this.pickerBindIndexSave;
      this.$refs.patientPicker.setColumnIndex(0, this.pickerBindIndexSave);
    },
    onConfirm(patient, index) {
      this.patientInfo = patient;
      this.pickerBindIndex = index;
      this.pickerBindIndexSave = index;
      this.showPicker = false;
    },
    offlineCliniChange(value) {
      if (value == 0) {
        this.visitingHospital = "";
        this.diagnosticResults = "";
      }
    },
    toPay() {
      if (
        this.consultPurpose == "" ||
        this.diseaseDescription == "" ||
        this.medicineStatus == ""
      ) {
        this.$toast("请填写必填信息!");
        return;
      }
      // if(!this.isAgree) {
      //   this.$toast("请先阅读并同意互联网诊疗风险告知及知情同意书");
      //   return
      // }
      let params = {
        consultPurpose: this.consultPurpose.join(","),
        diagnosticResults: this.diagnosticResults,
        diseaseDescription: this.diseaseDescription,
        durationOfSymptoms: this.durationOfSymptoms,
        fileRecordIds: this.imageList,
        hasOfflineClinic: this.hasOfflineClinic,
        hasOtherSymptom: this.hasOtherSymptom,
        invoiceInfo: "",
        medicineStatus: this.medicineStatus,
        needInvoice: 0,
        otherDescription: this.otherDescription,
        patientId: this.patientInfo && this.patientInfo.value,
        payType: 0,
        remark: "",
        sourceType: 0,
        specId: this.specId,
        visitingHospital: this.visitingHospital,
        whatHelp: this.whatHelp,
      };
      this.$apis.initiateGraphicConsultation(params).then((res) => {
        let { retData } = res;
        if (retData) {
          window.location.href = retData.payUrl;
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.itConsult {
  &-payBtns {
    height: 58px;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 14px;
    &-left {
      display: flex;
      align-items: center;
      &-text {
        font-size: 16px;
        font-weight: normal;
        letter-spacing: 0.2px;
        color: #666666;
        margin-right: 10px;
      }
      &-price {
        font-size: 24px;
        font-weight: 600;
        letter-spacing: 0.2px;
        color: #ff5500;
      }
      &-unit {
        font-size: 13px;
        font-weight: normal;
        letter-spacing: -0.31px;
        color: #ff5500;
        position: relative;
        top: 3px;
        margin-left: 1px;
      }
    }
    &-right {
      background: #f0a022;
      padding: 10px 28px;
      font-size: 16px;
      font-weight: 500;
      text-align: center;
      letter-spacing: 0.19px;
      color: #ffffff;
      border-radius: 20px;
    }
  }
  .bottom18 {
    padding-bottom: 68px;
  }
  &-form {
    // padding-bottom: 68px;
    &-patient {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 44px;
      line-height: 44px;
      background: #ffffff;
      padding: 0 14px;
      margin-bottom: 12px;
      &-left {
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 0.2px;
        color: #333333;
      }

      &-right {
        font-size: 15px;
        font-weight: normal;
        text-align: right;
        letter-spacing: 0.2px;
        color: #666666;
        height: 40px;
        display: flex;
        align-items: center;
      }
    }
    &-title {
      height: 44px;
      background: #ffffff;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 0.2px;
      color: #333333;
      padding: 0 14px;
      display: flex;
      align-items: center;
      &-required {
        font-size: 16px;
        font-weight: normal;
        line-height: 19px;
        letter-spacing: 0px;
        color: #f6424b;
        margin-left: 2px;
      }
    }
    &-content {
      background: #ffffff;
      padding: 0 14px 6px;
      margin-bottom: 12px;
      &-imgs {
        display: flex;
        flex-wrap: wrap;
        justify-content: start;
        width: 100%;
        .itConsult-form-content-img {
          width: 27vw;
          height: 27vw;
          position: relative;
          margin: 6px;
          img {
            width: 100%;
            height: 100%;
          }

          .delete-icon {
            position: absolute;
            top: -5px;
            right: -5px;
            width: 16px;
            height: 16px;
          }
        }
      }
    }
    &-agreement {
      padding: 10px 14px;
      &-form-box {
        display: inline;
      }
      .p1 {
        display: inline;
      }
      .p2 {
        color: #00982d;
        display: inline;
      }
      .checkbox-container {
        display: inline-block;
        width: 20px;
      }
    }
    &-agreement-tip {
      padding: 0px 14px 6px;
      font-size: 14px;
      font-weight: normal;
      letter-spacing: 0px;
      color: #999999;
    }
    .noMarginBottom {
      margin-bottom: 0px;
    }
    &-tip {
      background: #ffffff;
      font-size: 14px;
      font-weight: normal;
      letter-spacing: 0.3px;
      color: #666666;
      padding: 0 14px 14px;
      margin-bottom: 12px;
    }
  }
  &-agreement {
    padding: 10px 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    height: 80vh;
    overflow: hidden;
    &-btnGroup {
      display: flex;
      justify-content: end;
      align-items: center;
      height: 20px;
    }
    &-title {
      display: flex;
      justify-content: center;
      font-size: 18px;
      font-weight: 500;
      letter-spacing: 0px;
      color: #111111;
      margin-bottom: 10px;
      height: 20px;
    }
    p {
      text-indent: 2em;
      flex: 1;
      overflow: scroll;
    }
  }
}
</style>


<style lang="scss">
.itConsult {
  &-form {
    .van-checkbox {
      margin-bottom: 10px;
    }
    .van-radio {
      margin-bottom: 10px;
    }
    .van-checkbox__label {
      font-size: 20px;
      font-weight: normal;
      letter-spacing: 0px;
      color: #111111;
    }
    .van-radio__label {
      font-size: 20px;
      font-weight: normal;
      letter-spacing: 0px;
      color: #111111;
    }
    .van-cell {
      padding: 0;
    }
    &-form-content2 {
      .van-field__word-limit {
        position: absolute;
        bottom: -8px;
        top: unset;
      }
      .van-cell__value {
        margin-bottom: 10px;
      }
    }
    .van-checkbox__icon--disabled.van-checkbox__icon--checked
      .van-icon-success {
      color: #fff;
      border-color: rgb(50, 174, 87);
      background-color: rgb(50, 174, 87);
    }
    .van-radio__icon--disabled.van-radio__icon--checked .van-icon-success {
      color: #fff;
      border-color: rgb(50, 174, 87);
      background-color: rgb(50, 174, 87);
    }
  }
}
</style>