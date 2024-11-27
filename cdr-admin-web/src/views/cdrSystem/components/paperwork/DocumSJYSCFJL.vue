<!-- 出院记录 -->
<template>
  <div>
    <div class="case-history-hcj case-history-card">
      <h3 class="title">上级医师查房记录</h3>
      <div class="divider"></div>
      <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">姓名</div>
            <div class="value">{{ listData.xm }}</div>
          </el-row>
          <el-row type="flex" justify="start" class="unit">
            <div class="label">科室</div>
            <div class="value">{{ listData.ks }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">性别</div>
            <div class="value">{{ listData.xb }}</div>
          </el-row>
          <el-row type="flex" justify="start" class="unit">
            <div class="label">病区</div>
            <div class="value">{{ listData.bq }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">年龄</div>
            <div class="value">{{ listData.nl }}</div>
          </el-row>
          <el-row type="flex" justify="start" class="unit">
            <div class="label">病床号</div>
            <div class="value">{{ listData.bch }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">住院号</div>
            <div class="value">{{ listData.zyh }}</div>
          </el-row>
          <el-row type="flex" justify="start" class="unit">
            <div class="label">病房号</div>
            <div class="value">{{ listData.bfh }}</div>
          </el-row>
        </el-col>
      </el-row>
      <div class="divider"></div>
      <div>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">查房时间</div>
          <div class="value">{{ listData.cfsj }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">记录内容</div>
          <div class="value">{{ listData.jlnr }}</div>
        </el-row>
      </div>
      <div class="footer">
        <div class="divider"></div>
        <div class="clearfix">
          
          
          <div class="floatright footer-text">
            <span class="footer-lable">签名时间</span>
            <span class="footer-value">{{ listData.qmsj }}</span>
          </div>
          <div class="floatright footer-text">
            <span class="footer-lable">主任医师签名</span>
            <span class="footer-value">{{ listData.zrysqm }}</span>
          </div>
          <div class="floatright footer-text">
            <span class="footer-lable">主治医师签名</span>
            <span class="footer-value">{{ listData.zzysqm }}</span>
          </div>
          <div class="floatright footer-text">
            <span class="footer-lable">记录人签名</span>
            <span class="footer-value">{{ listData.jlrqm }}</span>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "",
  components: {},
  props: {
    listData: {
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
    }
  },
  created() {
  },
  methods: {
  },
}
</script>
<style lang="scss" scoped></style>
