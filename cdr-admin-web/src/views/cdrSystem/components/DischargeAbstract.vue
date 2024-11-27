<template>
  <!--出院小结  -->
  <div class="case-history-hcj">
    <h3 class="title">出院小结</h3>
    <div class="divider"></div>
    <el-row>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">姓名</div>
          <div class="value">{{formData.xm}}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">科室</div>
          <div class="value">{{formData.ks}}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">性别</div>
          <div class="value">{{formData.xb}}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">病区</div>
          <div class="value">{{formData.bq}}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">年龄</div>
          <div class="value">{{formData.nl}}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">病床号</div>
          <div class="value">{{formData.bch}}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">住院号</div>
          <div class="value">{{formData.zyh}}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">病房号</div>
          <div class="value">{{formData.bfh}}</div>
        </el-row>
      </el-col>
    </el-row>
    <div class="divider"></div>
    <!-- content -->
    <div>
      <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">入院时间</div>
            <div class="value">{{formData.rysj}}</div>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">出院时间</div>
            <div class="value">{{formData.cysj}}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">住院天数</div>
            <div class="value">{{formData.zyts}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">入院诊断</div>
            <div class="value">{{formData.ryzd}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">出院诊断</div>
            <div class="value">{{formData.cyzd}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">入院情况</div>
            <div class="value">{{formData.ryqk}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">诊疗过程</div>
            <div class="value">{{formData.zlgc}}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">出院情况</div>
            <div class="value">{{formData.cyqk}}</div>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="footer" style="margin-top:">
      <div class="divider"></div>
      <div class="clearfix">
        <div class="floatright footer-text">
          <span class="footer-lable">签名时间</span>
          <span class="footer-value">{{formData.qmrq}}</span>
        </div>
        <div class="floatright footer-text">
          <span class="footer-lable">上级医师签名</span>
          <span class="footer-value">{{formData.sjysqm}}</span>
        </div>
        <div class="floatright footer-text">
          <span class="footer-lable">住院医师签名</span>
          <span class="footer-value">{{formData.zyysqm}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "TransfusionRecord",
  props: {
    formData: { type: Object, default: () => ({}) },
  },
};
</script>
<style lang="scss" scoped></style>
