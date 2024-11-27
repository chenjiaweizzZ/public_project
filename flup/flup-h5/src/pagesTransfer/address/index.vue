<template>
  <div class="address">
    <ul class="address-body" :style="{'background-color':list && list.length ? '#f3f7f5' : '#fff'}">
      <van-swipe-cell v-for="item in list" :key="item.addressId">
        <li class="item" @click="selectItem(item.addressId)">
          <div class="item-contain">
            <div class="circle" v-if="item.isDefault == 1">
              <img class="circle-img" src="@/assets/images/home.png" alt="" />
            </div>
            <div class="circleName" v-else>
              {{ item.contactsName | handName }}
            </div>
            <div class="info">
              <div class="info-suggest">
                <span class="info-suggest__name">{{ item.contactsName }}</span
                ><span class="info-suggest__phone">{{ item.phone }}</span>
                <div class="info-suggest__acquiesce" v-if="item.isDefault == 1">
                  默认
                </div>
              </div>
              <div class="info-address">
                {{ item.district }}{{ item.addresslocal }}
              </div>
            </div>
            <div class="edit" @click.stop="jumpAddAddress(item)">
              <img src="@/assets/images/edit2.png" alt="" />
            </div>
          </div>
        </li>
        <template #right>
          <div class="address-body__removeBtn" @click.stop="removeAddress(item.addressId)">删除</div>
        </template>
      </van-swipe-cell>
      <li class="emty" v-if="!list.length">
        <img class="emty-img" src="@/assets/images/emtyAddres.png" alt="">
        <span class="emty-text">暂无地址</span>
      </li>
    </ul>
    <div class="address-floor">
      <div class="address-floor__btn" @click="jumpAddAddress(null)">
        <van-icon name="plus" /><span class="text">添加收货地址</span>
      </div>
    </div>
  </div>
</template>
<script>
import { SwipeCell } from "vant";
export default {
  filters: {
    handName(val) {
      if (!val) {
        return "";
      }
      return val.substr(-2);
    },
  },
  components: {
    [SwipeCell.name]: SwipeCell,
  },
  data() {
    return {
      list: [],
      isSelect:false,
    };
  },
  mounted() {
    this.getList();
    this.isSelect = this.$route.query.isSelect;
  },
  methods: {
    //初始化列表
    async getList() {
      try {
        let { retData } = await this.$apis.selectReceiptList();
        this.list = retData;
      } catch (e) {
        this.$toast.fail(e);
      }
    },
    //删除地址
    removeAddress(addressId) {
      this.$dialog
        .confirm({
          message: "是否删除地址?",
        })
        .then(async() => {
          try {
            await this.$apis.deleteAddress({
              addressId
            });
            this.list = this.list.filter(item => item.addressId != addressId)
            this.$toast.success('删除成功');
          } catch (e) {
            this.$toast.fail(e);
          }
        })
        .catch(() => {
          // on cancel
        });
    },
    //添加修改地址
    jumpAddAddress(data) {
      if (data) {
        this.$router.push({
          path: "/addAddress",
          query: {
            data: JSON.stringify(data),
          },
        });
      } else {
        this.$router.push("/addAddress");
      }
    },
    //选中地址
    selectItem(addressId){
      if(!this.isSelect){
        return false;
      }
      sessionStorage.setItem('addressId',addressId);
      this.$router.go(-1);
    }
  },
};
</script>
<style lang="scss" scoped>
.address {
  &-body {
    height: calc(100vh - 78px);
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
      &:active{
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
    .emty{
      margin-top:158px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      &-img{
        width: 280px;
      }
      &-text{
        font-size: 17px;
        font-weight: normal;
        line-height: 20px;
        text-align: center;
        color: #6B8C75;
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