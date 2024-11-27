<!-- 术前小结 -->
<template>
  <div>
    <div class="case-history-hcj case-history-card">
      <h3 class="title">术前小结</h3>
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
        <el-row type="flex" justify="start" class="unit">
          <div class="label">小结时间</div>
          <div class="value">{{ formData.xjsj }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">病历摘要</div>
          <div class="value">{{ formData.blzy }}</div>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">术前诊断</div>
              <div class="value">{{ formData.sqzd }}</div>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">诊断依据</div>
              <div class="value">{{ formData.zdyj }}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">过敏史</div>
          <div class="value">{{ formData.gms }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">辅助检查</div>
          <div class="value">{{ formData.fzjc }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">手术适应症</div>
          <div class="value">{{ formData.sssyz }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">手术禁忌症</div>
          <div class="value">{{ formData.ssjjz }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">手术指征</div>
          <div class="value">{{ formData.sszz }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">会诊意见</div>
          <div class="value">{{ formData.hzyj }}</div>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">拟实施手术及操作</div>
              <div class="value">{{ formData.nssssjcz }}</div>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">拟实施手术及操作时间</div>
              <div class="value">{{ formData.nssssjczsj }}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">拟实施麻醉方法</div>
          <div class="value">{{ formData.nssmzff }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">注意事项</div>
          <div class="value">{{ formData.zysx }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">手术要点</div>
          <div class="value">{{ formData.ssyd }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">术前准备</div>
          <div class="value">{{ formData.sqzb }}</div>
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
