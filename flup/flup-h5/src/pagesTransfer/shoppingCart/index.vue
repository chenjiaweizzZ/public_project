<template>
  <div class="shoppingCart" @click="pob" @touchstart="onTouchStart" @touchend="onTouchEnd">
    <div class="shoppingCart-title">
      <div class="shoppingCart-title-patient" @click.stop="changePatient" v-if="cartList.length">
        <span class="shoppingCart-title-patient-left">就诊人</span>
        <span class="shoppingCart-title-patient-right">{{ patientInfo.text }}<van-icon name="arrow" color="#111111" size="25" /></span>
      </div>
      <div class="shoppingCart-title-op">
        <span class="shoppingCart-title-op-left">预选方案</span>
        <span class="shoppingCart-title-op-middle" @click="addresShow = true" v-if="needExpress1 && addressList.length > 0">
          <van-icon name="location-o" color="#666" />{{ address.district }}{{ address.addresslocal }}
        </span>
        <span  class="shoppingCart-title-op-middle"  v-if="needExpress1 && addressList.length == 0" @click="toSetAddress">
          <van-icon name="location-o" color="#666" />请配置地址
        </span>
        <span class="shoppingCart-title-op-right" @click="manage">
          <span v-if="status">管理</span>
          <span v-if="!status" class="ouT">退出管理</span>
        </span>
      </div>
    </div>
    <div v-if="cartList.length">
      <div class="shoppingCart-list" v-for="(item, index) in cartList" :key="index">
        <div class="shoppingCart-list-dept">
          <van-checkbox v-model="item.checked" checked-color="#00982D" @click="checkDept(item)"></van-checkbox>
          <span class="shoppingCart-list-deptName">{{ item.packageClassName }}</span>
        </div>
        <div class="shoppingCart-list-package">
          <div class="packaGe" v-for="(iten, indez) in item.shoppingCartList" :key="indez">
            <van-swipe-cell>
              <div class="packaGe-box">
                <div class="packaGe-box-left">
                  <van-checkbox v-model="iten.checked" checked-color="#00982D" @click="checkPackage(item)"></van-checkbox>
                  <img :src="iten.specDisplayPicUrl">
                  <div class="packaGe-box-left-content" @click.stop="getPackageInfo(iten)">
                    <span class="iTem iTem1">{{ iten.packageName }}</span>
                    <span class="iTem iTem2">
                      <span class="afua">
                        <span class="iTem2-left">
                          {{ iten.specName }}
                          <span class="arr0w">
                            <van-icon name="arrow-down" color="#6BC586" />
                          </span>
                        </span>
                      </span>
                    </span>
                    <span class="iTem">
                      <span class="Un1t">¥</span>
                      <span class="pr1ce">{{ iten.specPrice | unit }}</span>
                    </span>
                  </div>
                </div>
                <div class="packaGe-box-right" @click.stop="updateBuyNum(iten)" @touchstart.stop @touchend.stop>
                  <div v-if="!status">
                    <van-icon name="close" color="#ff5035" size="24" @click="delThisCart(iten)" />
                  </div>
                  <div v-else-if="iten.specId == updateBuyNumSpecId">
                    <van-stepper input-width="18px" button-size="22px" v-model="iten.buyNumber" />
                  </div>
                  <div class="packaGe-box-right-num" v-else>
                    <span class="packaGe-box-right-num-unit">x</span>
                    <span class="packaGe-box-right-num-ber">{{ iten.buyNumber }}</span>
                  </div>
                </div>
              </div>
              <template #right>
                <van-button square text="删除" type="danger" class="delete-button" @click="delThisCart(iten)" />
              </template>
            </van-swipe-cell>
          </div>
        </div>
      </div>
    </div>
    <div class="shoppingCart-noCart" v-else>
      <img src="../../assets/images/bgNot.png">
      <div class="shoppingCart-noCart-text">还没有预选方案</div>
    </div>
    <div class="shoppingCart-bottom" v-if="cartList.length">
      <div class="shoppingCart-bottom-line">
        <div class="shoppingCart-bottom-line-left">
          <van-checkbox v-model="allChecked" checked-color="#00982D" @click="checkAll"></van-checkbox>
          <span class="qx-title">全选</span>
          <transition name="fade2">
            <div class="pr1ce" v-if="status">
              <span class="pr1ce-amo">合计:</span>
              <span class="pr1ce-unit">¥</span>
              <span class="pr1ce-total">{{total}}</span>
            </div>
          </transition>
        </div>
        <div class="shoppingCart-bottom-line-right">
          <div class="shoppingCart-bottom-line-right-btn payBtn" v-if="status" @click="toPay">结算</div>
          <div class="shoppingCart-bottom-line-right-btn delBtn" @click="delCart" v-else>删除</div>
        </div>
      </div>
    </div>
    <van-action-sheet v-model="addresShow" title="请选择地址" get-container="#app">
      <ul class="address-body">
        <van-swipe-cell v-for="item in addressList" :key="item.addressId">
          <li class="item">
            <div class="item-contain" @click="changeAddress(item)">
              <div class="circle" v-if="item.isDefault == 1">
                <img class="circle-img" src="@/assets/images/home.png" alt="" />
              </div>
              <div class="circleName" v-else>
                {{ item.contactsName | handName }}
              </div>
              <div class="info">
                <div class="info-suggest">
                  <span class="info-suggest__name">{{ item.contactsName }}</span><span class="info-suggest__phone">{{ item.phone }}</span>
                  <div class="info-suggest__acquiesce" v-if="item.isDefault == 1">
                    默认
                  </div>
                </div>
                <div class="info-address">
                  {{ item.district }}{{ item.addresslocal }}
                </div>
              </div>
            </div>
          </li>
        </van-swipe-cell>
      </ul>
    </van-action-sheet>
    <van-popup v-model="signShow" closeable round position="bottom" class="van-sign" get-container="#app">
      <div class="healthControl-sign">
        <div class="healthControl-sign__top">
          <img class="img" :src="displayPicUrl" />
          <div class="info">
            <div class="info-money">
              <span class="info-money__sign">¥</span><span>{{ price | unit }}</span>
            </div>
            <div class="info-text">{{ packageName }}</div>
          </div>
        </div>
        <div class="healthControl-scroll">
          <div class="healthControl-sign__norms">
            <p class="norms-title">选择规格</p>
            <div class="norms-list">
              <div class="item" :class="{ active: currentSpecifications == item.specId }" v-for="item in platPackageSpecInfoDtoList" :key="item.specId" @click="changeSpecifications(item)">
                {{ item.specName }}
              </div>
            </div>
          </div>
          <div class="healthControl-sign__rich" v-html="normsRich" @touchmove.stop="() => { }" @click="imageChgange($event)" v-if="normsRich"></div>
          <div class="healthControl-sign__visit">
            <div class="visit-info">
              <span class="visit-info__left">就诊人</span>
              <div class="visit-info__right">
                <span class="text">{{ patientInfo.text }}</span>
                <!-- <span>{{ patientInfo.value }}</span> -->
              </div>
            </div>
            <!-- <div class="visit-person">
              <div class="visit-person__list">
                <div class="item" v-for="item in patientList" :key="item.userId" :class="{
                                        active: item.userId == currentPatient.userId,
                                        tacitly: item.isDefault == 1,
                                    }" @click="switchPatient(item)">
                  {{ item.patientName | alterName }}
                </div>
              </div>
              <div class="visit-person__add" @click.stop="viewPatient">
                <img src="@/assets/images/add.png" alt="" />
              </div>
            </div> -->
          </div>
        </div>
        <div class="healthControl-sign__btnWrap" @click="addCart">
          <div class="btn">确定</div>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="showPicker" round position="bottom" get-container="#app">
      <van-picker title="切换就诊人" :columns="patientList" @cancel="onCancel" @confirm="onConfirm" show-toolbar :default-index="pickerBindIndex" ref="patientPicker"/>
    </van-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      needExpress1: false,
      needExpress: false,
      cartList: [],
      updateBuyNumSpecId: "",
      patientInfo: "",
      addressList: [],
      address: {
        district: "",
        addresslocal: "",
      },
      pickerBindIndex: 0,
      pickerBindIndexSave: 0,
      showPicker: false,
      addresShow: false,
      signShow: false,
      packageDiscription: "",
      platPackageSpecInfoDtoList: [],
      packageName: "",
      currentSpecifications: "",
      normsRich: "",
      price: "",
      displayPicUrl: "",
      introduceUrl: "",
      currentPatient: {},
      patientList: [],
      chartRecordId: "",
      status: true,
      allChecked: false,
      needAddress: false
    };
  },
  computed: {
    total() {
      let sum = 0;
      this.cartList.forEach((i) => {
        i.shoppingCartList.forEach((j) => {
          if (j.checked) {
            sum += j.specPrice * j.buyNumber;
          }
        });
      });
      return sum / 100;
    },
  },
  filters: {
    unit(val) {
      if (!val) {
        return "0.00";
      }
      return val / 100;
    },
    handName(val) {
      if (!val) {
        return "";
      }
      return val.substr(-2);
    },
    hiddenCardId(str, frontLen = 3, endLen = 4) {
      if (!str) {
        return str;
      }
      let len = str.length - frontLen - endLen;
      let start = "";
      for (let i = 0; i < len; i++) {
        start += "*";
      }
      return (
        str.substring(0, frontLen) + start + str.substring(str.length - endLen)
      );
    },
    alterName(val) {
      if (val.length > 2) {
        return val.slice(-2);
      }
      return val;
    },
  },
  created() {
    this.getMyCart();
    this.getPatientList();
  },
  methods: {
    getPatientList() {
      this.$apis.getPatientList().then((res) => {
        if (res && res.retData && res.retData.list && res.retData.list.length) {
          console.log(res.retData.list)
          this.patientList = res.retData.list.map(item => {
            return {
              text:
                item.patientName +
                "   " +
                item.idNo.substring(0, 4) +
                "***********" +
                item.idNo.substring(item.idNo.length - 4),
              value: item.userId,
              isDefault: item.isDefault
            };
          });
          let patientDefault = this.patientList.find(i => i.isDefault == 1)
          if(patientDefault) {
            this.patientInfo = patientDefault
            this.pickerBindIndex = this.patientList.findIndex(i => i.isDefault == 1)
            this.pickerBindIndexSave = this.patientList.findIndex(i => i.isDefault == 1)
          }else {
            this.patientInfo = this.patientList[0]
          }
        } else {
          this.patientInfo = "暂无就诊人";
        }
      });
    },
    manage() {
      this.status = !this.status;
      this.allChecked = false;
      this.setCheck2();
    },
    hideMiddleOfName(name) {
      if (name.length < 2) {
        return name;
      }
      const firstChar = name.charAt(0);
      const lastChar = name.charAt(name.length - 1);
      if (name.length > 2) {
        const middleStars = "*".repeat(name.length - 2);
        return firstChar + middleStars + lastChar;
      } else {
        return firstChar + "*";
      }
    },
    getMyCart() {
      this.$apis.shoppingCartList().then((res) => {
        this.needExpress1 = res.retData.needExpress;
        this.cartList = this.setCheck(res.retData.shoppingCartList, false);
        this.needExpress1 ? this.getMyAddress() : "";
        this.allChecked = false
      });
    },
    getMyAddress() {
      this.$apis.selectReceiptList().then((res) => {
          if(res.retData.length) {
            this.address = res.retData.find((i) => i.isDefault == 1) || res.retData[0];
            this.addressList = res.retData;
          }else {
            this.$toast("方案存在需要配置地址的方案,请配置收获地址");
          }
      });
    },
    //获取服务包详情
    async getPackageInfo(item) {
      let { retData } = await this.$apis.getPackageInfo({
        packageId: item.packageId,
        flag: false,
      });
      this.introduceUrl = item.specDisplayPicUrl;
      this.packageDiscription = retData.packageDiscription;
      this.platPackageSpecInfoDtoList =
        retData.platPackageSpecInfoDtoList.filter(
          (item) => item.showOnCloud == 1
        );
      this.chartRecordId = item.chartRecordId;
      this.packageName = retData.packageName;
      let spec = this.platPackageSpecInfoDtoList.find(
        (i) => i.specId == item.specId
      );
      if (spec) {
        this.currentSpecifications = spec.specId;
        this.normsRich = spec.specPackageDiscription;
        this.price = spec.price;
        this.displayPicUrl = spec.displayPicUrl;
        this.needExpress = spec.needExpress;
      } else {
        this.currentSpecifications = item.specId;
        this.normsRich =
          this.platPackageSpecInfoDtoList[0].specPackageDiscription;
        this.price = this.platPackageSpecInfoDtoList[0].price;
        this.displayPicUrl = this.platPackageSpecInfoDtoList[0].displayPicUrl;
        this.needExpress = this.platPackageSpecInfoDtoList[0].needExpress;
      }
      this.signShow = true;
    },
    setCheck(list, status = false) {
      if (list.length) {
        list.forEach((i) => {
          i.checked = status;
          if (i.shoppingCartList && i.shoppingCartList.length) {
            this.setCheck(i.shoppingCartList, status);
          }
        });
      } else {
        return [];
      }
      return list;
    },
    setCheck2(status = false) {
      if (this.cartList.length) {
        this.cartList.forEach((i) => {
          i.checked = status;
          if (i.shoppingCartList && i.shoppingCartList.length) {
            i.shoppingCartList.forEach((j) => {
              j.checked = status;
            });
          }
        });
      }
    },
    addCart() {
      let params = {
        chartRecordId: this.chartRecordId,
        specId: this.currentSpecifications,
      };
      this.$apis.shoppingCartUpdateSpec(params).then((res) => {
        if (res && res.retCode == 0) {
          this.$toast("预选方案编辑成功");
          this.signShow = false;
          this.getMyCart();
        } else {
          this.$toast(res.retInfo);
        }
      });
    },
    //选择规格
    changeSpecifications(val) {
      this.currentSpecifications = val.specId;
      this.normsRich = val.specPackageDiscription;
      this.price = val.price;
      this.displayPicUrl = val.displayPicUrl;
      this.needExpress = val.needExpress;
    },
    viewPatient() {
      this.$router.push({
        path: "userManagement",
      });
    },
    changePatient() {
      this.showPicker = true
      console.log(this.pickerBindIndex,this.pickerBindIndexSave)
    },
    changeAddress(item) {
      this.address = item;
      this.addresShow = false;
      this.$toast("修改地址成功");
    },
    checkDept(item) {
      this.cartList.forEach((i) => {
        if (i.packageClassId == item.packageClassId) {
          i.shoppingCartList.forEach((i) => {
            i.checked = item.checked;
          });
        }
      });
      this.calcAll();
    },
    checkPackage(item) {
      let noChecked = 0;
      item.shoppingCartList.forEach((i) => {
        if (!i.checked) noChecked++;
      });
      this.cartList.forEach((i) => {
        if (i.packageClassId == item.packageClassId) {
          i.checked = !noChecked;
        }
      });
      this.calcAll();
    },
    calcAll() {
      let checked = 0;
      let noChecked = 0;
      this.cartList.forEach((i) => {
        i.shoppingCartList.forEach((j) => {
          if (j.checked) {
            checked++;
          } else {
            noChecked++;
          }
        });
      });
      if (noChecked == 0) {
        this.allChecked = true;
      } else {
        this.allChecked = false;
      }
    },
    checkAll() {
      this.setCheck2(this.allChecked);
    },
    toSetAddress() {
      this.$router.push({
        path: "address",
      });
    },
    updateBuyNum(iten) {
      this.updateBuyNumSpecId = iten.specId;
      this.chartRecordId = iten.chartRecordId;
    },
    delCart() {
      let chartRecordIdList = [];
      this.cartList.forEach((i) => {
        i.shoppingCartList.forEach((i) => {
          if (i.checked) chartRecordIdList.push(i.chartRecordId);
        });
      });
      this.$apis.shoppingCartdelete({ chartRecordIdList }).then((res) => {
        if (res && res.retCode == 0) {
          this.getMyCart();
          this.$toast("预选方案删除成功");
          this.status = !this.status;
        }
      });
    },
    delThisCart(iten) {
      let chartRecordIdList = [iten.chartRecordId];
      this.$apis.shoppingCartdelete({ chartRecordIdList }).then((res) => {
        if (res && res.retCode == 0) {
          this.getMyCart();
          this.$toast("预选方案删除成功");
          // this.status = true;
        }
      });
    },
    toPay() {
      let chartRecordIdList = [];
      let need = false
      let payStatus = true
      this.cartList.forEach((i) => {
        i.shoppingCartList.forEach((i) => {
          if (i.checked) chartRecordIdList.push(i.chartRecordId);
          if (i.specNeedExpress) need = true
          if (this.needExpress1 && this.addressList.length == 0 && i.specNeedExpress) {
            this.$toast("请配置收获地址");
            payStatus = false
          }
        });
      });
      if (chartRecordIdList.length == 0) {
        this.$toast("请选择方案");
        return;
      }
      let params = {
        chartRecordIdList,
        needInvoice: 0,
        patientId: this.patientInfo.value,
        payType: 0,
        sourceType: 0,
      };
      if (need) params.addressId = this.address.addressId;
      if(payStatus) {
        this.$apis.createOrderBatch(params).then((res) => {
        if (res && res.retData && res.retData.payUrl) {
          window.location.href = res.retData.payUrl;
        } else {
          this.$toast("结算失败");
        }
      }).catch(error => {
          this.$toast(error);
      });
      }else {
        this.toSetAddress()
      }
    },
    pob() {
      if (this.updateBuyNumSpecId) {
        let updateNumber = 1;
        this.cartList.forEach((i) => {
          i.shoppingCartList.forEach((j) => {
            if (j.chartRecordId == this.chartRecordId) {
              updateNumber = j.buyNumber;
            }
          });
        });
        let params = {
          chartRecordId: this.chartRecordId,
          updateNumber,
        };
        this.$apis.shoppingCartUpdateBuyNumber(params).then((res) => {
          if (res && res.retCode == 0) {
            this.$toast("预选方案编辑成功");
            this.updateBuyNumSpecId = "";
            this.chartRecordId = "";
            this.getMyCart();
          } else {
            this.$toast(res.retInfo);
          }
        });
      }
    },
    onConfirm(patient,index) {
      this.patientInfo = patient
      this.pickerBindIndex = index
      this.pickerBindIndexSave = index
      this.showPicker = false
    },
    onCancel() {
      this.showPicker = false
      this.pickerBindIndex = this.pickerBindIndexSave
      this.$refs.patientPicker.setColumnIndex(0, this.pickerBindIndexSave);
    },
    onTouchStart() {
      this.pob();
    },
    onTouchEnd() {
      this.pob();
    },
    handleTouchMove(event) {
      event.stopPropagation();
    },
  },
};
</script>

<style lang="scss" scoped>
.shoppingCart {
  .fade2-enter-active,
  .fade2-leave-active {
    transition: opacity 0.5s;
  }

  .fade2-enter,
  .fade2-leave-to {
    opacity: 0;
    width: 0;
  }
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(
    180deg,
    #34b159 0%,
    #34b159 21%,
    #f6f6f6 40%,
    #f6f6f6 100%
  );
  overflow-y: scroll;
  padding-bottom: 128px;
  padding-top: 100px;

  &-title {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    background-color: #34b159;

    &-patient {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 44px;
      line-height: 44px;
      background: #ffffff;
      padding: 0 14px;

      &-left {
        font-size: 16px;
        font-weight: 500;
        letter-spacing: 0px;
        color: #111111;
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

    &-op {
      display: flex;
      padding: 0 14px;
      justify-content: space-between;
      align-items: center;
      height: 52px;
      font-size: 18px;
      font-weight: 500;
      line-height: 52px;
      letter-spacing: 0.25px;
      color: #ffffff;

      &-left {
        // width: 100px;
        // min-width: 100px;
        white-space: nowrap;
        margin-right: 10px;
      }

      &-right {
        // width: 50px;
        // min-width: 50px;
        white-space: nowrap;
        margin-left: 10px;
        .ouT {
          color: black;
        }
      }

      &-middle {
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        word-break: break-all;
        font-size: 12px;
        font-weight: normal;
        letter-spacing: 0.2px;
        color: #666666;
      }
    }
  }

  &-list {
    background: #ffffff;
    margin: 5px 12px;
    padding: 0 10px;
    border-radius: 10px;

    &-dept {
      display: flex;
      height: 49px;
      line-height: 49px;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 0.2px;
      color: #111111;

      &Name {
        line-height: 47px;
        height: 49px;
        margin-left: 10px;
      }
    }

    &-package {
      padding-bottom: 8px;

      .packaGe {
        display: flex;
        height: 80px;
        width: 100%;
        margin-bottom: 14px;

        &-box {
          display: flex;
          justify-content: space-between;

          &-left {
            display: flex;
            height: 80px;
            line-height: 80px;

            img {
              height: 80px;
              width: 80px;
              margin: 0px 10px 0px 12px;
            }

            &-content {
              height: 80px;
              display: flex;
              flex-direction: column;
              max-width: 38vw;

              .iTem {
                line-height: normal;

                .Un1t {
                  font-size: 14px;
                  font-weight: 500;
                  line-height: 22px;
                  letter-spacing: 0.2px;
                  color: #ff5500;
                }

                .pr1ce {
                  font-size: 18px;
                  font-weight: 500;
                  line-height: 22px;
                  letter-spacing: 0.2px;
                  color: #ff5500;
                }
              }

              .iTem1 {
                font-size: 15px;
                font-weight: 500;
                letter-spacing: 0.2px;
                color: #111111;
                margin-bottom: 7px;
                width: auto;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }

              .iTem2 {
                opacity: 1;

                font-size: 12px;
                font-weight: normal;
                letter-spacing: 0.2px;
                color: #00982d;
                height: 18px;
                line-height: 18px;
                display: flex;
                justify-content: space-between;
                padding: 0 5px;
                margin-bottom: 4px;
                max-width: 38vw;

                .afua {
                  border-radius: 2px;
                  border: 0.5px solid #6bc586;
                  max-width: 38vw;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }

                &-left {
                  display: inline-block;
                  height: 18px;
                  line-height: 18px;
                  width: 100%;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  position: relative;
                  padding-right: 15px;
                  padding-left: 5px;
                  bottom: 1px;
                  .arr0w {
                    min-width: 12px;
                    position: absolute;
                    right: 3px;
                  }
                }
              }
            }
          }

          &-right {
            display: flex;
            justify-content: center;
            align-items: center;

            &-num {
              width: 20px;
              height: 18px;
              border-radius: 2px;
              opacity: 1;
              border: 0.5px solid #999999;
              display: flex;
              justify-content: center;
              align-items: center;

              &-unit {
                font-size: 10px;
                font-weight: normal;
                line-height: 12px;
                letter-spacing: 0.2px;
                color: #666666;
              }

              &-ber {
                font-size: 12px;
                font-weight: normal;
                line-height: 12px;
                letter-spacing: 0.2px;
                color: #111111;
              }
            }
          }
        }
      }
    }
  }

  &-noCart {
    position: fixed;
    top: 62px;
    left: 10px;
    right: 10px;
    bottom: 79px;
    background: #fff;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &-text {
      font-size: 17px;
      font-weight: normal;
      text-align: center;
      letter-spacing: 0px;
      color: #6b8c75;
    }
  }

  &-bottom {
    position: fixed;
    bottom: 66px;
    right: 0;
    left: 0;
    height: 58px;
    line-height: 58px;
    background: #ffffff;
    padding: 0 22px;
    &-line {
      display: flex;
      align-items: center;
      justify-content: space-between;
      &-left {
        display: flex;
        align-items: center;
        .qx-title {
          font-size: 16px;
          font-weight: 500;
          letter-spacing: 0.2px;
          color: #999999;
          margin-left: 10px;
        }
        .pr1ce {
          height: 58px;
          line-height: 58px;
          margin-left: 10px;
          &-amo {
            font-size: 16px;
            font-weight: normal;
            letter-spacing: 0.2px;
            color: #333333;
          }
          &-unit {
            font-size: 14px;
            font-weight: 500;
            letter-spacing: 0.2px;
            color: #ff5500;
          }
          &-total {
            font-size: 18px;
            font-weight: 500;
            letter-spacing: 0.2px;
            color: #ff5500;
          }
        }
      }
      &-right {
        display: flex;
        align-items: center;
        &-btn {
          height: 34px;
          text-align: center;
          line-height: 34px;
          width: 121px;
          display: flex;
          align-items: center;
          border-radius: 100px;
          font-size: 16px;
          font-weight: 500;
          text-align: center;
          color: #ffffff;
          display: flex;
          justify-content: center;
        }
        .payBtn {
          background: linear-gradient(126deg, #ff9035 27%, #ff7b35 74%);
        }
        .delBtn {
          background: linear-gradient(126deg, #ff5035 27%, #ff3d07 74%);
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.address {
  &-body {
    max-height: calc(100vh - 78px);
    overflow-y: auto;
    background-color: #f3f7f5;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    .item {
      width: 100%;
      //   height: 97px;
      background-color: #fff;
      padding: 16px 12px;
      position: relative;
      overflow: hidden;

      &:active {
        background-color: #eee;
      }

      &::before {
        content: "";
        position: absolute;
        left: 18px;
        bottom: 0px;
        z-index: 1;
        width: 100%;
        height: 1px;
        background: rgba(255, 255, 255, 0.01);
        box-shadow: inset 0px 0.5px 0px 0px #e2e2e2;
      }

      &-contain {
        height: 100%;
        display: flex;
        align-items: center;

        .circle,
        .circleName {
          width: 38px;
          height: 38px;
          border-radius: 19px;
        }

        .circle {
          background: linear-gradient(311deg, #32ae57 20%, #69d37f 80%);
          display: flex;
          align-items: center;
          justify-content: center;

          &-img {
            width: 17px;
            height: 16px;
          }
        }

        .circleName {
          background: linear-gradient(304deg, #cff6d7 16%, #edfff1 88%);
          font-size: 14px;
          font-weight: 600;
          color: #1d903f;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .info {
          flex: 1;
          height: 100%;
          padding: 0 8px 0 12px;

          &-suggest {
            // margin-top: 16px;
            display: flex;
            align-items: center;

            &__name {
              font-size: 16px;
              font-weight: 600;
              line-height: 19px;
              color: #111111;
              max-width: 120px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            &__phone {
              font-size: 14px;
              font-weight: normal;
              line-height: 19px;
              color: #111111;
              margin-left: 14px;
            }

            &__acquiesce {
              width: 33px;
              height: 16px;
              border-radius: 2px;
              border: 1px solid #ff9900;
              font-size: 12px;
              font-weight: normal;
              color: #ff6a00;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-left: 8px;
            }
          }

          &-address {
            margin-top: 6px;
            font-size: 14px;
            font-weight: normal;
            line-height: 20px;
            color: #666666;
          }
        }

        .edit {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;

          &:active {
            opacity: 0.7;
          }

          img {
            width: 16px;
            height: 16px;
          }
        }
      }
    }

    &__removeBtn {
      width: 60px;
      height: 100%;
      background: #f64040;
      font-size: 14px;
      font-weight: normal;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .emty {
      margin-top: 158px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      &-img {
        width: 280px;
      }

      &-text {
        font-size: 17px;
        font-weight: normal;
        line-height: 20px;
        text-align: center;
        color: #6b8c75;
      }
    }
  }

  &-floor {
    height: 78px;
    padding: 8px 14px 0;
    background-color: #fff;

    &__btn {
      height: 42px;
      border-radius: 21px;
      background: #32ae57;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 500;
      line-height: 19px;
      color: #ffffff;

      &:active {
        opacity: 0.7;
      }

      .text {
        margin-left: 9px;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.healthControl {
  &-scroll {
    height: 370px;
    overflow-y: auto;
    padding: 0 15px;
  }

  &-Rich {
    width: 100%;
    overflow-y: auto;

    // padding-bottom:95px;
    &__img {
      width: 100%;
      object-fit: contain;
    }
  }

  &-floor {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 10;
    // height: 95px;
    width: 100%;
    background: #fff;

    &__protocol {
      margin-top: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-left: 30px;
      padding-right: 30px;

      .floor-protocol__text {
        color: #32ae57;
      }
    }

    .floor-operate {
      margin-top: 10px;
      margin-bottom: 20px;
      padding: 0 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &__btns {
        display: flex;
      }

      &__btn {
        width: 100px;
        height: 34px;
        font-weight: 600;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;

        span + span {
          margin-left: 6px;
        }

        &:active {
          opacity: 0.8;
        }
      }

      .btn-left {
        border-top-left-radius: 17px;
        border-bottom-left-radius: 17px;
        background: linear-gradient(116deg, #ff9035 30%, #ff7b35 72%);
      }

      .btn-right {
        border-top-right-radius: 17px;
        border-bottom-right-radius: 17px;
        background: linear-gradient(116deg, #ff9035 30%, #ff7b35 72%);
      }

      &__service {
        font-size: 14px;
        font-weight: 600;
        color: #00982d;
        display: flex;
        align-items: center;
        padding-left: 4px;

        .img {
          width: 20px;
          height: 20px;
          margin-right: 7.5px;
        }
      }
    }
  }

  &-popup {
    height: 100%;
    width: 100%;
    background: linear-gradient(0deg, #ffffff 64%, #e6ffee 100%);
    padding: 23px 0px 40px;
    overflow: hidden;

    &__title {
      font-size: 18px;
      font-weight: 600;
      line-height: 22px;
      color: #111111;
      text-align: center;
      margin-bottom: 16px;
    }

    &__info {
      height: 100%;
      width: 100%;
      padding: 0 20px;
      overflow: auto;
      font-size: 15px;
      font-weight: normal;
      line-height: 24px;
      color: #333333;
      padding-bottom: 40px;
      background-color: transparent;
      border: none;
      white-space: pre-wrap;
    }
  }

  &-sign {
    height: 100%;
    width: 100%;
    background: linear-gradient(0deg, #f9f9f9 64%, #e6ffee 100%);
    padding: 20px 0px 0;

    &__top {
      display: flex;
      align-items: center;
      margin-bottom: 17px;
      padding: 0 15px;

      .img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 4px;
        margin-right: 24px;
      }

      .info {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &-money {
          font-size: 28px;
          font-weight: 500;
          line-height: 32px;
          color: #ff5500;

          &__sign {
            font-size: 22px;
          }
        }

        &-text {
          font-size: 15px;
          font-weight: 600;
          line-height: 22px;
          color: #111111;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

    &__norms {
      padding: 14px 14px 15px;
      background-color: #fff;
      border-radius: 8px;

      .norms-title {
        font-size: 15px;
        line-height: 22px;
        font-weight: 600;
        color: #111111;
        margin-bottom: 15px;
      }

      .norms-list {
        display: flex;
        flex-wrap: wrap;

        .item {
          height: 24px;
          border-radius: 12px;
          padding: 0 12px;
          font-size: 14px;
          font-weight: normal;
          line-height: 24px;
          letter-spacing: 0.2px;
          color: #111111;
          background: #f6f6f6;
          margin: 0 10px 6px 0;
        }

        .active {
          // font-weight: 600;
          color: #ffffff;
          background: #00982d;
        }
      }
    }

    &__rich {
      margin-top: 8px;
      padding: 14px;
      background-color: #fff;
      border-radius: 8px;
      max-height: 140px;
      overflow-y: auto;
    }

    &__visit {
      padding: 14px;
      border-radius: 8px;
      background-color: #fff;
      margin: 8px 0px 6px;

      .visit-info {
        display: flex;
        align-items: center;
        justify-content: space-between;

        &__left {
          font-size: 15px;
          font-weight: 600;
          line-height: 22px;
          color: #111111;
        }

        &__right {
          flex: 1;
          font-size: 14px;
          font-weight: 600;
          color: #333333;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          margin-left: 10px;
          display: flex;
          align-items: center;
          justify-content: flex-end;

          .text {
            flex: 1;
            margin-right: 5px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            text-align: right;
          }
        }
      }

      .visit-person {
        margin-top: 16px;
        display: flex;
        align-items: center;

        &__list {
          &::-webkit-scrollbar {
            display: none;
          }

          flex: 1;
          display: flex;
          align-items: center;
          overflow: auto;

          .item {
            width: 46px;
            height: 46px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #edfdee;
            border-radius: 23px;
            font-size: 14px;
            font-weight: normal;
            color: #111111;
            flex-shrink: 0;
            border: 1px solid #edfdee;
          }

          .item + .item {
            margin-left: 16px;
          }

          .active {
            position: relative;
            box-sizing: border-box;
            border-color: #00982d;
            color: #00982d;
            font-weight: 600;
          }

          .tacitly {
            &::before {
              content: "";
              position: absolute;
              left: 21px;
              bottom: -1px;
              z-index: 1;
              width: 22px;
              height: 10px;
              background-image: url("../../assets/images/silent.png");
              background-size: cover;
            }

            position: relative;
          }
        }

        &__add {
          width: 46px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #9ebba6;
          background: #f3f7f4;
          border-radius: 23px;
          color: #79b88b;
          margin-left: 16px;

          img {
            width: 16px;
            height: 16px;
          }
        }
      }
    }

    &__btnWrap {
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 100;
      height: 65px;
      width: 100%;
      background-color: #fff;
      padding: 8px 14px 0;

      .btn {
        width: 100%;
        height: 34px;
        border-radius: 17px;
        background: linear-gradient(104deg, #ff9035 31%, #ff7b35 70%);
        font-size: 15px;
        font-weight: 600;
        line-height: 34px;
        text-align: center;
        letter-spacing: 0.2px;
        color: #ffffff;

        &:active {
          opacity: 0.8;
        }
      }
    }
  }

  .van-sign {
    height: 532px;
  }
}
</style>


<style lang="scss">
.shoppingCart {
  .delete-button {
    height: 100%;
    background: #ff5035;
    border: 1px solid #ff5035;
  }

  &-list-package {
    .van-swipe-cell {
      width: 100%;
    }
  }

  .van-swipe-cell__right {
    padding-left: 1px;
  }
}
</style>

<style lang="scss">
.healthControl {
  &-floor {
    &__protocol {
      padding-left: 10px;
      padding-right: 10px;

      .van-checkbox__icon .van-icon {
        border-color: #32ae57;
        border-radius: 3px;
      }

      .van-checkbox__label {
        font-size: 13px;
        font-weight: normal;
        line-height: 18px;
        color: #666666;
        margin-left: 9px;
      }
    }
  }

  .van-popup__close-icon--top-right {
    top: 15px;
    right: 18px;
    font-size: 16px;
    color: #32ae57;
  }
}
.shoppingCart {
  .van-stepper__plus::before {
    color: #00982D;
  }
  .van-stepper__plus::after {
    color: #00982D;
  }
}
</style>