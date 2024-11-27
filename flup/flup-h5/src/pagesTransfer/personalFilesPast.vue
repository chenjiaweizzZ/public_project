<template>
  <div class="personalFilesPast">
    <!-- <div class="topMenu">
      <u @click="$router.go(-1)"></u>
      个人档案
    </div>-->
    <div class="checkboxModules" v-for="(item, index) in fileList" :key="index">
      <p>{{ item.content }}</p>
      <div v-if="item.content != '其他'">
        <div class="checkboxBlock">
          <span
            v-for="(jitem, jindex) in item.list"
            :key="jindex"
            class="checkbox"
            :class="{ selected: itemIds.indexOf(jitem.code) >= 0 }"
            @click="checkedOne(jitem, item)"
          >{{ jitem.content }}</span>
        </div>
      </div>
      <div v-else>
        <van-field
          type="textarea"
          v-model="extraItem.extra"
          label
          placeholder="补充其他病史…"
          rows="2"
          autosize
          show-word-limit
          @input="input"
        />
      </div>
    </div>
    <van-submit-bar>
      <van-button type="primary" block @click="save">保 存</van-button>
    </van-submit-bar>
  </div>
</template>

<script>
import { Field, SubmitBar } from 'vant-green'
export default {
  name: 'patientFilesPast',
  components: {
    VanField: Field,
    VanSubmitBar: SubmitBar,
  },
  data() {
    return {
      code: '',
      fileList: [],
      itemList: [],
      extraItem: {},
      showOther: false,
      itemIds: [],
      selectArr: [],
    }
  },
  created() {
    let healthInfo = this.$store.state.user.healthArchives
    this.code = this.$route.query.code
    document.title = this.$route.query.title
    this.getBaseRecord().then((res) => {
      if (this.$route.query.pvPatientVisitId) {
        this.getHealthRecord()
      } else if (healthInfo.length) {
        healthInfo.forEach((item) => {
          if (item.code == this.code) {
            item.list.length &&
              item.list.forEach((i) => {
                if (Object.keys(i).indexOf('extra') > -1) {
                  this.extraItem = i
                } else {
                  i.list.forEach((c) => {
                    this.itemIds.push(c.code)
                    this.selectArr.push(c)
                  })
                }
              })
          }
        })
      }
    })
  },
  methods: {
    // 获取健康档案信息
    getHealthRecord() {
      this.axios
        .get(
          this.$apis.queryPatientHealthRecord +
            '?pvPatientVisitId=' +
            this.$route.query.pvPatientVisitId
        )
        .then((res) => {
          let arr = res.rsp.list.filter((item) => item.code == this.code)
          if (arr.length) {
            JSON.parse(arr[0].content).forEach((item) => {
              if (Object.keys(item).indexOf('extra') > -1) {
                this.extraItem = item
              } else {
                item.list.forEach((i) => {
                  this.itemIds.push(i.code)
                  this.selectArr.push(i)
                })
              }
            })
          }
        })
    },
    // 获取健康档案配置
    async getBaseRecord() {
      await this.axios
        .get(this.$apis.baseHealthRecordConfig + '?code=' + this.code)
        .then((res) => {
          this.fileList = res.rsp.list || []
          this.fileList.forEach((item) => {
            if (item.hcType == 'INPUT') {
              this.showOther = true
              this.extraItem = {
                extra: '',
                code: item.code,
                level: 2,
                list: [],
              }
            }
            item.list.forEach((i) => {
              this.itemList.push(i)
            })
          })
        })
    },
    checkedOne(item, i) {
      let idIndex = this.itemIds.indexOf(item.code)
      if (idIndex > -1) {
        // 如果已经包含了该id, 则去除(单选按钮由选中变为非选中状态)
        this.itemIds.splice(idIndex, 1)
        this.selectArr.splice(idIndex, 1)
      } else {
        //婚育史单选
        if (i.parentCode == '20000') {
          if (this.selectArr.length) {
            this.selectArr.forEach((m, index) => {
              let len = 0
              if (m.parentCode == item.parentCode) {
                this.itemIds.splice(this.itemIds.indexOf(m.code), 1)
                this.selectArr.splice(index, 1)
                this.itemIds.push(item.code)
                this.selectArr.push(item)
              } else {
                len++
                if (len == this.selectArr.length) {
                  this.itemIds.push(item.code)
                  this.selectArr.push(item)
                }
              }
            })
          } else {
            this.itemIds.push(item.code)
            this.selectArr.push(item)
          }
        } else {
          //如果未包含该id,选中该checkbox
          this.itemIds.push(item.code)
          this.selectArr.push(item)
        }
      }
    },
    input(value) {
      this.extraItem.extra = value
    },
    save() {
      var map = {},
        arr = []
      for (var i = 0; i < this.selectArr.length; i++) {
        var ai = this.selectArr[i]
        if (!map[ai.parentCode]) {
          arr.push({
            code: ai.parentCode,
            level: 2,
            list: [ai],
          })
          map[ai.parentCode] = ai
        } else {
          for (var j = 0; j < arr.length; j++) {
            var dj = arr[j]
            if (dj.code == ai.parentCode) {
              dj.list.push(ai)
              break
            }
          }
        }
      }
      if (this.showOther && this.extraItem.extra) {
        arr.push(this.extraItem)
      }
      if (this.$route.query.pvPatientVisitId) {
        this.$toast.loading({
          message: '保存中...',
          forbidClick: true,
        })
        this.axios
          .post(this.$apis.updateHealthRecord, {
            patientId: this.$route.query.pvPatientVisitId,
            code: this.code,
            content: JSON.stringify(arr),
          })
          .then((res) => {
            if (res.retCode == 200) {
              setTimeout(() => {
                this.$router.back()
              }, 500)
            }
          })
      } else {
        let str = ''
        arr.forEach((item) => {
          if (item.list.length) {
            item.list.forEach((i) => {
              str = str ? str + '/' : ''
              str = str + i.content
            })
          } else {
            str = str ? str + '/' + this.extraItem.extra : this.extraItem.extra
          }
        })
        this.$store.commit('user/setHealthArchives', {
          code: this.code,
          list: arr,
          detail: str,
        })
        this.$router.back()
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.personalFilesPast {
  position: relative;
  &::before {
    content: '';
    display: table;
  }
  .topMenu {
    z-index: 99;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 44px;
    line-height: 44px;
    font-size: 18px;
    color: #111111;
    letter-spacing: 0.2px;
    text-align: center;
    background: #fff;
    border-bottom: 1px solid #e2e2e2;
    u {
      position: absolute;
      left: 3.75%;
      top: 50%;
      transform: translate(0, -50%);
      display: block;
      width: 22px;
      height: 22px;
      background: #fff url('../assets/images/back.png') no-repeat;
      background-size: contain;
    }
  }
  .checkboxModules {
    position: relative;
    margin-top: 44px;
  }
  .checkboxModules {
    padding: 16px 0 8px 3.7%;
    background: #fff;
    border-bottom: 1px solid #e2e2e2;
    p {
      margin-right: 3.7%;
      margin-bottom: 12px;
      font-size: 16px;
      color: #666666;
      letter-spacing: 0.2px;
    }
    .checkboxBlock {
      margin-right: 3.7%;
      overflow: hidden;
      .checkbox {
        display: inline-block;
        margin-right: 8px;
        margin-bottom: 12px;
        padding: 6px 12px;
        font-size: 14px;
        color: #111111;
        letter-spacing: 0;
        border: 1px solid #e2e2e2;
        border-radius: 100px;
        background: #f6f6f6;
      }
      .selected {
        color: #fff;
        border: 1px solid #1c97fc;
        background: #1c97fc;
      }
    }
  }
}
</style>
