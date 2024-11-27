<!-- 阴道分娩记录 -->
<template>
  <div>
    <div class="case-history-hcj case-history-card">
      <h3 class="title">阴道分娩记录</h3>
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
      <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">孕次</div>
            <div class="value">{{ formData.yc }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">产次</div>
            <div class="value">{{ formData.cc }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">末次月经日期</div>
            <div class="value">{{ formData.mcyjrq }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">预产期</div>
            <div class="value">{{ formData.ycq }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">临产时间</div>
            <div class="value">{{ formData.lcsj }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">胎膜破裂时间</div>
            <div class="value">{{ formData.tmplsj }}</div>
          </el-row>
        </el-col>
        <el-col :span="6"> </el-col>
        <el-col :span="6"> </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">入院诊断</div>
            <div class="value">{{ formData.ryzd }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">前羊水性状</div>
            <div class="value">{{ formData.qysxz }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">第1产程时长</div>
            <div class="value">{{ formData.d1ccsz }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">宫口全开时间</div>
            <div class="value">{{ formData.gkkqsj  }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">第2产程时长</div>
            <div class="value">{{ formData.d2ccsz }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">胎儿娩出时间</div>
            <div class="value">{{ formData.temcsj  }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">第3产程时长</div>
            <div class="value">{{ formData.dscssz }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">总产程时长</div>
            <div class="value">{{ formData.zccsz }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">胎方位</div>
            <div class="value">{{ formData.tfw }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">阴道助产标志</div>
            <div class="value">{{ formData.ydzcbz }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">羊水性状</div>
            <div class="value">{{ formData.ysxz }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">胎盘娩出时间</div>
            <div class="value">{{ formData.tpmcsj }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">胎膜完整情况</div>
            <div class="value">{{ formData.tmwzqk }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">绕颈身</div>
            <div class="value">{{ formData.rjs }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">脐带长度</div>
            <div class="value">{{ formData.qdzd  }}</div>
          </el-row>
        </el-col>
        <el-col :span="6"> </el-col>
      </el-row>


      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">脐带异常情况描述</div>
            <div class="value">{{ formData.qdycqkms }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">产时用药</div>
            <div class="value">{{ formData.csyy }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">预防措施</div>
            <div class="value">{{ formData.yfcs }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">产妇会阴切开标志</div>
            <div class="value">{{ formData.cfhyqkbz }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">会阴切开位置</div>
            <div class="value">{{ formData.hyqkwz  }}</div>
          </el-row>
        </el-col>
        <el-col :span="6"> </el-col>
        <el-col :span="6"> </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">产妇会阴缝合针数</div>
            <div class="value">{{ formData.cfhyfhzs }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">会阴裂伤情况</div>
            <div class="value">{{ formData.hylsqk }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">会阴血肿标志</div>
            <div class="value">{{ formData.hyxzbz  }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">麻醉方法</div>
            <div class="value">{{ formData.mzff  }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">麻醉药物</div>
            <div class="value">{{ formData.mzyw }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">阴道裂伤标志</div>
            <div class="value">{{ formData.ydlsbz }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">阴道血肿标志</div>
            <div class="value">{{ formData.ydxzbz  }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">阴道血肿大小</div>
            <div class="value">{{ formData.ydxzdx  }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">阴道血肿处理</div>
            <div class="value">{{ formData.ydxzcl   }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">宫颈裂伤标志</div>
            <div class="value">{{ formData.gjlsbz }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">宫颈缝合情况</div>
            <div class="value">{{ formData.gjfhqk }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">肛查</div>
            <div class="value">{{ formData.gc }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">产后用药</div>
            <div class="value">{{ formData.chyy }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">分娩过程特殊情况描述</div>
            <div class="value">{{ formData.fmgctsqkms }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">宫缩情况</div>
            <div class="value">{{ formData.gsqk }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">子宫情况</div>
            <div class="value">{{ formData.zgqk }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">恶露情况</div>
            <div class="value">{{ formData.elqk }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">修补手术过程</div>
            <div class="value">{{ formData.xbssgc }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>

        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">存脐带血情况标志</div>
            <div class="value">{{ formData.cqdxqkbz }}</div>
          </el-row>
        </el-col>
        <el-col :span="12">
           <el-row type="flex" justify="start" class="unit">
            <div class="label">产后诊断</div>
            <div class="value">{{ formData.chzd  }}</div>
          </el-row>
           </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">产后观察时间</div>
            <div class="value">{{ formData.chgcsj  }}</div>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">产后检查时间</div>
            <div class="value">{{ formData.chjcsj  }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">产后收缩压</div>
            <div class="value">{{ formData.chssy }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">产后舒张压</div>
            <div class="value">{{ formData.chszy }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">产后脉搏</div>
            <div class="value">{{ formData.chmb }}</div>
          </el-row>
        </el-col>
      </el-row>
         <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">产后心率</div>
            <div class="value">{{ formData.chxl }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">产后出血量</div>
            <div class="value">{{ formData.chcxl }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">产后宫缩</div>
            <div class="value">{{ formData.chgs  }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">产后宫底高度</div>
            <div class="value">{{ formData.chgdgd  }}</div>
          </el-row>
        </el-col>
      </el-row>
               <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">产后膀胱充盈标志</div>
            <div class="value">{{ formData.chbgcybz }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">新生儿性别</div>
            <div class="value">{{ formData.xsexb  }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">新生儿出生体重</div>
            <div class="value">{{ formData.xsecstz  }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">新生儿出生身高</div>
            <div class="value">{{ formData.xsecssg  }}</div>
          </el-row>
        </el-col>
      </el-row>
                    <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">产瘤大小</div>
            <div class="value">{{ formData.cldx }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">产瘤部位</div>
            <div class="value">{{ formData.clbw  }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">Apgar评分间隔时间</div>
            <div class="value">{{ formData.apgarpfjgsj }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">Apgar评分值</div>
            <div class="value">{{ formData.apgarpfz  }}</div>
          </el-row>
        </el-col>
      </el-row>
                    <el-row>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">分娩结局</div>
            <div class="value">{{ formData.fmjj  }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row type="flex" justify="start" class="unit">
            <div class="label">新生儿异常情况</div>
            <div class="value">{{ formData.xseycqk  }}</div>
          </el-row>
        </el-col>
        <el-col :span="6">
        </el-col>
        <el-col :span="6">
        </el-col>
      </el-row>
      <div class="footer">
        <div class="divider"></div>
        <div class="clearfix">
          <div class="floatright footer-text">
            <span class="footer-lable">记录人员签名</span>
            <span class="footer-value">{{ formData.jlryqm }}</span>
          </div>
          <div class="floatright footer-text">
            <span class="footer-lable">儿科医生签名</span>
            <span class="footer-value">{{ formData.ekysqm }}</span>
          </div>

          <div class="floatright footer-text">
            <span class="footer-lable">手术医生签名</span>
            <span class="footer-value">{{ formData.ssysqm }}</span>
          </div>
          <div class="floatright footer-text">
            <span class="footer-lable">接生人员签名</span>
            <span class="footer-value">{{ formData.jsryqm }}</span>
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
        qmsj: '2022-01-30'
      })
    }
  },
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>
<style lang="scss" scoped></style>
