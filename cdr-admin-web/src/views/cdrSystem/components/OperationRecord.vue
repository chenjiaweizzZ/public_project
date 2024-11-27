<!--手术记录-->
<template>
  <div class="case-history-hcj case-history-card">
    <h3 class="title">手术记录</h3>
    <div class="divider"></div>
    <el-row>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">姓名</div>
          <div class="value">{{ formData.hzxm }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">{{ mode === '0' ? '门诊号' : '科室' }}</div>
          <div class="value">{{ mode === '0' ? formData.mjzh : formData.ks }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">性别</div>
          <div class="value">{{ formData.xb }}</div>
        </el-row>
        <el-row  type="flex" justify="start" class="unit">
          <div class="label">{{ mode === '0' ? '科室' : '病区' }}</div>
          <div class="value">{{ mode === '0' ? formData.ks : formData.bq }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">年龄</div>
          <div class="value">{{ formData.nl }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">{{ mode === '0' ? '就诊日期' : '病床号' }}</div>
          <div class="value">{{ mode === '0' ? formData.jzrq : formData.bch }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">{{ mode === '0' ? '出生日期' : '住院号' }}</div>
          <div class="value">{{ mode === '0' ? formData.csrq : formData.zyh }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">{{ mode === '0' ? '' : '病房号' }}</div>
          <div class="value">{{ mode === '0' ? '': formData.bfh }}</div>
        </el-row>
      </el-col>
    </el-row>
    <div class="divider"></div>
    <!-- content -->
    <div>
      <el-row>
        <el-col :span="12">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">电子申请单编号</div>
            <div class="value">{{ formData.dzsqdbh }}</div>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">手术间编号</div>
            <div class="value">{{ formData.ssjbh }}</div>
          </el-row>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">开始时间</div>
            <div class="value">{{ formData.kssj }}</div>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">结束时间</div>
            <div class="value">{{ formData.jssj }}</div>
          </el-row>
        </el-col>
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
            <div class="label">术后诊断</div>
            <div class="value">{{ formData.shzd }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">手术名称</div>
            <div class="value">{{ formData.ssmc }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">手术级别</div>
            <div class="value">{{ formData.ssjb }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">麻醉方式</div>
            <div class="value">{{ formData.mzfs }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">手术者</div>
            <div class="value">{{ formData.ssz }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">第一助手</div>
            <div class="value">{{ formData.dyzs }}</div>
          </el-row>
        </el-col>

        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">第二助手</div>
            <div class="value">{{ formData.dezs }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">器材护士</div>
            <div class="value">{{ formData.qxhs }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">巡台护士</div>
            <div class="value">{{ formData.xths }}</div>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">麻醉医师</div>
            <div class="value">{{ formData.mzys }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">手术过程</div>
            <div class="value">{{ formData.ssgc }}</div>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <div class="footer" style="margin-top:">
      <div class="divider"></div>
      <div class="clearfix">
        <div class="floatright footer-text">
          <span class="footer-lable">签名时间</span>
          <span class="footer-value">{{ formData.qmrq }}</span>
        </div>
        <div class="floatright footer-text">
          <span class="footer-lable">手术者签名</span>
          <span class="footer-value">{{ formData.sszqm }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    //  '0'代表门诊 '1'代表住院
    mode: {
      type: String,
    },
  },
};
</script>
