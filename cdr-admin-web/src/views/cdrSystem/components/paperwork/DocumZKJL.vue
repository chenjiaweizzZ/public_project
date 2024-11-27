<!-- 出院记录 -->
<template>
  <div>
    <div class="case-history-hcj case-history-card">
      <h3 class="title">转科记录</h3>
      <div class="divider"></div>
      <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">姓名</div>
            <div class="value">{{ listData[0].xm }}</div>
          </el-row>
          <el-row type="flex" justify="start" class="unit">
            <div class="label">科室</div>
            <div class="value">{{ listData[0].ks }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">性别</div>
            <div class="value">{{ listData[0].xb }}</div>
          </el-row>
          <el-row type="flex" justify="start" class="unit">
            <div class="label">病区</div>
            <div class="value">{{ listData[0].bq }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">年龄</div>
            <div class="value">{{ listData[0].nl }}</div>
          </el-row>
          <el-row type="flex" justify="start" class="unit">
            <div class="label">病床号</div>
            <div class="value">{{ listData[0].bch }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">住院号</div>
            <div class="value">{{ listData[0].zyh }}</div>
          </el-row>
          <el-row type="flex" justify="start" class="unit">
            <div class="label">病房号</div>
            <div class="value">{{ listData[0].bfh }}</div>
          </el-row>
        </el-col>
      </el-row>
      <div class="divider"></div>
      <div>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">入院时间</div>
          <div class="value">{{ listData[0].rysj }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">主诉</div>
          <div class="value">{{ listData[0].zs }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">入院情况</div>
          <div class="value">{{ listData[0].ryqk }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">入院诊断</div>
          <div class="value">{{ listData[0].ryzd }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">诊疗过程</div>
          <div class="value">{{ listData[0].zlgc }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">目前情况</div>
          <div class="value">{{ listData[0].mqqk }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">目前诊断</div>
          <div class="value">{{ listData[0].mqzd }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">转科目的</div>
          <div class="value">{{ listData[0].zkmd }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">转入诊疗计划</div>
          <div class="value">{{ listData[0].zrzljh }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">注意事项</div>
          <div class="value">{{ listData[0].zysx }}</div>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">转科记录类型</div>
              <div class="value">{{ listData[0].zkjllx }}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">转出时间</div>
              <div class="value">{{ listData[0].zcsj }}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">转出科室</div>
              <div class="value">{{ listData[0].zcks }}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">转入时间</div>
              <div class="value">{{ listData[0].zrsj }}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">转入科室</div>
              <div class="value">{{ listData[0].zrks }}</div>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <div class="footer">
        <div class="divider"></div>
        <div class="clearfix">
         
          <div class="floatright footer-text">
            <span class="footer-lable">转入医师签名</span>
            <span class="footer-value">{{ listData[0].zrysqm }}</span>
          </div> 
          <div class="floatright footer-text">
            <span class="footer-lable">转出医师签名</span>
            <span class="footer-value">{{ listData[0].zcysqm }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { selectDataList } from "@/service/patientView"
export default {
  name: "",
  components: {},
  props: {
    formData: {
      type: Object,
      default: () => ({
        hzxm: "欧阳张三",
        xb: "男",
        ks: "门诊内科",
        nl: "39岁",
        bch: "3-102",
        bfh: "3-101",
        zyh: "3781603785",
        bq: "内科",
        ysqm: "胡诗音",
        qmsj: "2022-01-30",
      }),
    },
  },
  data() {
    return {
      listData: [],
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    getListData() {
      let params = {
        apiCode: "JK5015",
        apiVersion: "1.0",
        pageNo: "0",
        pageSize: "0",
        parameters: { id: "1" },
      }
      selectDataList(params).then((res) => {
        this.listData = res.data
        this.loading = false
        console.log(this.listData, "this.listData")
      })
    },
  },
}
</script>
<style lang="scss" scoped></style>
