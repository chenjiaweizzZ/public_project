<!-- 术前讨论 -->
<template>
  <div>
    <div class="case-history-hcj case-history-card">
      <h3 class="title">术前讨论</h3>
      <div class="divider"></div>
      <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">姓名</div>
            <div class="value">{{ formData.hzxm }}</div>
          </el-row>
          <el-row type="flex" justify="start" class="unit">
            <div class="label">科室</div>
            <div class="value">{{ formData.ks }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">性别</div>
            <div class="value">{{ formData.xb }}</div>
          </el-row>
          <el-row type="flex" justify="start" class="unit">
            <div class="label">病区</div>
            <div class="value">{{ formData.bq }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">年龄</div>
            <div class="value">{{ formData.nl }}</div>
          </el-row>
          <el-row type="flex" justify="start" class="unit">
            <div class="label">病床号</div>
            <div class="value">{{ formData.bch }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">住院号</div>
            <div class="value">{{ formData.zyh }}</div>
          </el-row>
          <el-row type="flex" justify="start" class="unit">
            <div class="label">病房号</div>
            <div class="value">{{ formData.bfh }}</div>
          </el-row>
        </el-col>
      </el-row>
      <div class="divider"></div>
      <div>
        <el-row>
          <el-col :span="12">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">讨论日期</div>
              <div class="value">{{ formData.tlrq }}</div>
            </el-row>
            <el-row type="flex" justify="start" class="unit">
              <div class="label">主持人</div>
              <div class="value">{{ formData.zcr }}</div>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">讨论地点</div>
              <div class="value">{{ formData.tldd }}</div>
            </el-row>
            <el-row type="flex" justify="start" class="unit">
              <div class="label">参加人员</div>
              <div class="value">{{ formData.cjry }}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">讨论意见</div>
          <div class="value">{{ formData.tlyj }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">讨论结论</div>
          <div class="value">{{ formData.tljl }}</div>
        </el-row>
      </div>
      <div class="footer">
        <div class="divider"></div>
        <div class="clearfix">
          <div class="floatright footer-text">
            <span class="footer-lable">签名时间</span>
            <span class="footer-value">{{ formData.qmsj }}</span>
          </div>
          <div class="floatright footer-text">
            <span class="footer-lable">医师签名</span>
            <span class="footer-value">{{ formData.ysqm }}</span>
          </div>
          <div class="floatright footer-text">
            <span class="footer-lable">麻醉医师签名</span>
            <span class="footer-value">{{ formData.mzysqm }}</span>
          </div>
          <div class="floatright footer-text">
            <span class="footer-lable">手术者签名</span>
            <span class="footer-value">{{ formData.sszqm }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  components: {},
  props: {
    formData: {
      type: Object,
      default: () => ({
        hzxm: '欧阳张三',
        xb: '男',
        ks: '门诊内科',
        nl: '39岁',
        bch: '3-102',
        bfh: '3-101',
        zyh: '3781603785',
        bq: '内科',
        ysqm: '胡诗音',
        qmsj: '2022-01-30',
      }),
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>
<style lang="scss" scoped></style>
