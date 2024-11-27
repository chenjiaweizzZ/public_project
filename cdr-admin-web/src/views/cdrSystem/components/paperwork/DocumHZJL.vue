<!-- 会诊记录 -->
<template>
  <div>
    <div class="case-history-hcj case-history-card">
      <h3 class="title">会诊记录</h3>
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
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">会诊申请科室</div>
              <div class="value">{{ formData.hzsqks }}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">会诊科室</div>
              <div class="value">{{ formData.hzks }}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">会诊类型</div>
              <div class="value">{{ formData.hzlx }}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">会诊原因</div>
              <div class="value">{{ formData.hzyy }}</div>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">会诊目的</div>
              <div class="value">{{ formData.hzmd }}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">病历摘要</div>
          <div class="value">{{ formData.blzy }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">辅助检查结果</div>
          <div class="value">{{ formData.fzjcjg }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">诊断</div>
          <div class="value">{{ formData.zd }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">诊疗过程</div>
          <div class="value">{{ formData.zlgc }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">会诊意见</div>
          <div class="value">{{ formData.hzyj }}</div>
        </el-row>
      </div>
      <div class="footer">
        <div class="divider"></div>
        <div class="clearfix">
          <div class="floatright footer-text">
            <span class="footer-lable">会诊时间</span>
            <span class="footer-value">{{ formData.hzsj }}</span>
          </div>
          <div class="floatright footer-text">
            <span class="footer-lable">会诊医师签名</span>
            <span class="footer-value">{{ formData.hzysqm }}</span>
          </div>
          <div class="floatright footer-text">
            <span class="footer-lable">会诊申请医师签名</span>
            <span class="footer-value">{{ formData.hzsqysqm }}</span>
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
