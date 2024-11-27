<!--麻醉记录-->
<template>
  <div class="case-history-hcj case-history-card">
    <h3 class="title">麻醉记录</h3>
    <div class="divider"></div>
    <el-row>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">姓名</div>
          <div class="value">{{ formData.xm }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit" v-if="mode=='1'">
          <div class="label">科室</div>
          <div class="value">{{ formData.ks }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit" v-else>
          <div class="label">门诊号</div>
          <div class="value">{{ formData.mjzh }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">性别</div>
          <div class="value">{{ formData.xb }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit" v-if="mode=='1'">
          <div class="label">病区</div>
          <div class="value">{{ formData.bq }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit" v-else>
          <div class="label">科室</div>
          <div class="value">{{ formData.ks }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit">
          <div class="label">年龄</div>
          <div class="value">{{ formData.nl }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit" v-if="mode=='1'">
          <div class="label">病床号</div>
          <div class="value">{{ formData.bch }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit" v-else>
           <div class="label">就诊日期</div>
          <div class="value">{{ formData.jzrq }}</div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="start" class="unit" v-if="mode=='1'">
          <div class="label">住院号</div>
          <div class="value">{{ formData.zyh }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit" v-if="mode=='1'">
          <div class="label">病房号</div>
          <div class="value">{{ formData.bfh }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit" v-if="mode!='1'">
          <div class="label">出生日期</div>
          <div class="value">{{ formData.csrq }}</div>
        </el-row>
        <!-- <el-row type="flex" justify="start" class="unit" v-if="mode!='1'">
          <div class="label">就诊日期</div>
          <div class="value">{{ formData.jzrq }}</div>
        </el-row> -->
      </el-col>
    </el-row>
    <div class="divider"></div>
    <!-- content -->
    <div>
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
            <div class="label">手术及操作</div>
            <div class="value">{{ formData.ssjcz }}</div>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">手术体位</div>
            <div class="value">{{ formData.sstw }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">麻醉方法</div>
            <div class="value">{{ formData.mzff }}</div>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">气管插管分类</div>
            <div class="value">{{ formData.qgcgfl }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">麻醉药物名称</div>
            <div class="value">{{ formData.mzywmc }}</div>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">麻醉体位</div>
            <div class="value">{{ formData.mztw }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">呼吸类型</div>
            <div class="value">{{ formData.hxlx }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">麻醉描述</div>
            <div class="value">{{ formData.mzms }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">常规检测项目名称</div>
            <div class="value">{{ formData.cgjcxmmc }}</div>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">常规检测项目结果</div>
            <div class="value">{{ formData.cgjcxmjg }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">特殊检测项目名称</div>
            <div class="value">{{ formData.tsjcxmmc }}</div>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">特殊检测项目结果</div>
            <div class="value">{{ formData.tsjcxmjg }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">麻醉合并症标志</div>
            <div class="value">{{ formData.mzhbzbz }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">诊疗过程描述</div>
            <div class="value">{{ formData.zlgcms }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">穿刺过程</div>
            <div class="value">{{ formData.ccgc }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">血压</div>
            <div class="value">{{ formData.xy }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">体温</div>
            <div class="value">{{ formData.tw }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">心率</div>
            <div class="value">{{ formData.xl }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">脉搏</div>
            <div class="value">{{ formData.mb }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">呼吸频率</div>
            <div class="value">{{ formData.hxpl }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">麻醉效果</div>
            <div class="value">{{ formData.mzxg }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">麻醉前用药</div>
            <div class="value">{{ formData.mzqyy }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">手术开始时间</div>
            <div class="value">{{ formData.sskssj }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">麻醉开始时间</div>
            <div class="value">{{ formData.mzkssj }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">手术结束时间</div>
            <div class="value">{{ formData.ssjssj }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">出手术室时间</div>
            <div class="value">{{ formData.cssssj }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">手术者</div>
            <div class="value">{{ formData.ssz }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">药物名称</div>
            <div class="value">{{ formData.ywmc }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">药物使用频次</div>
            <div class="value">{{ formData.ywsypc }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">药物使用次剂量</div>
            <div class="value">{{ formData.ywsycjl }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">药物使用总剂量</div>
            <div class="value">{{ formData.ywsyzjl }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">用药途径</div>
            <div class="value">{{ formData.yytj }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">输血时间</div>
            <div class="value">{{ formData.sxsj }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">输血品种</div>
            <div class="value">{{ formData.sxpz }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">输血量</div>
            <div class="value">{{ formData.sxl }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">输血反应</div>
            <div class="value">{{ formData.sxfy }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">术中输液项目</div>
            <div class="value">{{ formData.szsyxm }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">出血量</div>
            <div class="value">{{ formData.cxl }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">患者去向</div>
            <div class="value">{{ formData.hzqx }}</div>
          </el-row>
        </el-col>
        <el-col :span="6"></el-col>
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
          <span class="footer-lable">麻醉医师签名</span>
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
      default: () => ({}),
    },
    mode: {
      default: '1',
    },
  },
};
</script>
<style lang="scss" scoped></style>
