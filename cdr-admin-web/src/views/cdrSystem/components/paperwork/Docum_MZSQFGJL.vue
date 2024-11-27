<!--麻醉术前访视记录-->
<template>
  <div class="case-history-hcj case-history-card">
    <h3 class="title">麻醉术前访视记录</h3>
    <div class="divider"></div>
    <el-row>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">姓名</div>
          <div class="value">{{ formData.xm }}</div>
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
    <!-- content -->
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">注意事项</div>
          <div class="value">{{ formData.zysx }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">简要病史</div>
          <div class="value">{{ formData.jybs }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">过敏史</div>
          <div class="value">{{ formData.gms }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">心电图检查结果</div>
          <div class="value">{{ formData.xdtjcjg }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">胸部X线检查结果</div>
          <div class="value">{{ formData.xbxxjcjg }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">CT检查结果</div>
          <div class="value">{{ formData.ctjcjg }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">B超检查结果</div>
          <div class="value">{{ formData.bcjcjg }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">MRI超检查结果</div>
          <div class="value">{{ formData.mricjcjg }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">肺功能检查结果</div>
          <div class="value">{{ formData.fgnjcjg }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">血常规检查结果</div>
          <div class="value">{{ formData.xcgjcjg }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">尿常规检查结果</div>
          <div class="value">{{ formData.ncgjcjg }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">凝血功能检查结果</div>
          <div class="value">{{ formData.nxgnjcjg }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">肝功能检查结果</div>
          <div class="value">{{ formData.ggnjcjg }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">血气分析检查结果</div>
          <div class="value">{{ formData.xqfxjcjg }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">一般状况检查结果</div>
          <div class="value">{{ formData.ybzkjcjg }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">精神状态正常标志</div>
          <div class="value">{{ formData.jsztzcbz }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">心脏听诊结果</div>
          <div class="value">{{ formData.xztzjg }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">肺部听诊结果</div>
          <div class="value">{{ formData.fbtzjg }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">四肢检查结果</div>
          <div class="value">{{ formData.szjcjg }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">脊柱检查结果</div>
          <div class="value">{{ formData.jzjcjg }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">腹部检查结果</div>
          <div class="value">{{ formData.fbjcjg }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">气管检查结果</div>
          <div class="value">{{ formData.qgjcjg }}</div>
        </el-row>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">牙齿检查结果</div>
          <div class="value">{{ formData.ycjcjg }}</div>
        </el-row>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">术前麻醉医嘱</div>
          <div class="value">{{ formData.sqmzyz }}</div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">麻醉适应症</div>
          <div class="value">{{ formData.mzsyz }}</div>
        </el-row>
      </el-col>
    </el-row>
    <div class="footer">
      <div class="divider"></div>
      <div class="clearfix">
        <div class="floatright footer-text">
          <span class="footer-lable">签名时间</span>
          <span class="footer-value">{{ formData.qmsj }}</span>
        </div>
        <div class="floatright footer-text">
          <span class="footer-lable">医师签名</span>
          <span class="footer-value">{{ formData.mzysqm }}</span>
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
      default: () => ({})
    }
  }
}
</script>
