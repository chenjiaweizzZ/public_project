<!-- 剖宫产记录 -->
<template>
  <div>
    <div class="case-history-hcj case-history-card">
      <h3 class="title">剖宫产手术记录</h3>
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
      <div>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">待产时间</div>
          <div class="value">{{ formData.dcsj }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">术前诊断</div>
          <div class="value">{{ formData.sqzd }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">手术指征</div>
          <div class="value">{{ formData.sszz }}</div>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">手术及操作</div>
              <div class="value">{{ formData.ssjcz }}</div>
            </el-row>
            <el-row type="flex" justify="start" class="unit">
              <div class="label">麻醉方法</div>
              <div class="value">{{ formData.mzff }}</div>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">手术开始时间</div>
              <div class="value">{{ formData.sskssj }}</div>
            </el-row>
            <el-row type="flex" justify="start" class="unit">
              <div class="label">麻醉体位</div>
              <div class="value">{{ formData.mztw }}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">麻醉效果</div>
          <div class="value">{{ formData.mzxg }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">剖宫产手术过程</div>
          <div class="value">{{ formData.pgcssgc }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">子宫情况</div>
          <div class="value">{{ formData.zgqk }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">胎儿娩出方式</div>
          <div class="value">{{ formData.temcfs }}</div>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">羊水性状</div>
              <div class="value">{{ formData.ysxz }}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">羊水量</div>
              <div class="value">{{ formData.ysl }}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">胎盘娩出时间</div>
          <div class="value">{{ formData.tpmcsj }}</div>
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
              <div class="value">{{ formData.qdcd }}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">脐带异常情况描述</div>
          <div class="value">{{ formData.qdycqkms }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">存脐带血情况</div>
          <div class="value">{{ formData.cqdxqk }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">子宫壁缝合情况</div>
          <div class="value">{{ formData.zgbfhqk }}</div>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">宫缩剂名称</div>
              <div class="value">{{ formData.gsjmc }}</div>
            </el-row>
          </el-col>
          <el-col :span="18">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">宫缩剂使用方法</div>
              <div class="value">{{ formData.gsjsyff }}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">手术用药</div>
              <div class="value">{{ formData.ssyy }}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">手术用药量</div>
              <div class="value">{{ formData.ssyyl }}</div>
            </el-row>
          </el-col>
        </el-row>

        <el-row type="flex" justify="start" class="unit">
          <div class="label">腹腔探查子宫</div>
          <div class="value">{{ formData.fqtczg }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">腹腔探查附件</div>
          <div class="value">{{ formData.fqtcfj }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">宫腔探查异常情况描述</div>
          <div class="value">{{ formData.gqtcycqkms }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">宫腔探查处理情况</div>
          <div class="value">{{ formData.gqtcclqk }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">手术时产妇情况</div>
          <div class="value">{{ formData.ssscfqk }}</div>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">出血</div>
              <div class="value">{{ formData.cx }}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">输血成分</div>
              <div class="value">{{ formData.sxcf }}</div>
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
              <div class="label">输液量</div>
              <div class="value">{{ formData.syl }}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">供氧时间</div>
          <div class="value">{{ formData.gysj }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">其他用药</div>
          <div class="value">{{ formData.qtyy }}</div>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">其他用药情况</div>
          <div class="value">{{ formData.qtyyqk }}</div>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">手术结束时间</div>
              <div class="value">{{ formData.ssjssj }}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">手术全程时间</div>
              <div class="value">{{ formData.ssqcsj }}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">术后诊断</div>
          <div class="value">{{ formData.shzd }}</div>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">产后观察时间</div>
              <div class="value">{{ formData.chgcsj }}</div>
            </el-row>
            <el-row type="flex" justify="start" class="unit">
              <div class="label">产后心率</div>
              <div class="value">{{ formData.chxl }}</div>
            </el-row>
            <el-row type="flex" justify="start" class="unit">
              <div class="label">新生儿性别</div>
              <div class="value">{{ formData.xsexb }}</div>
            </el-row>
            <el-row type="flex" justify="start" class="unit">
              <div class="label">产瘤部位</div>
              <div class="value">{{ formData.clbw }}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">产后收缩压</div>
              <div class="value">{{ formData.chssy }}</div>
            </el-row>
            <el-row type="flex" justify="start" class="unit">
              <div class="label">产后出血量</div>
              <div class="value">{{ formData.chcxl }}</div>
            </el-row>
            <el-row type="flex" justify="start" class="unit">
              <div class="label">新生儿出生体重</div>
              <div class="value">{{ formData.xsecstz }}</div>
            </el-row>
            <el-row type="flex" justify="start" class="unit">
              <div class="label">Apgar评分间隔时间</div>
              <div class="value">{{ formData.apgarpfjgsj }}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">产后舒张压</div>
              <div class="value">{{ formData.chszy }}</div>
            </el-row>
            <el-row type="flex" justify="start" class="unit">
              <div class="label">产后宫缩</div>
              <div class="value">{{ formData.chgs }}</div>
            </el-row>
            <el-row type="flex" justify="start" class="unit">
              <div class="label">新生儿出生身高</div>
              <div class="value">{{ formData.xsecssg }}</div>
            </el-row>
            <el-row type="flex" justify="start" class="unit">
              <div class="label">Apgar评分值</div>
              <div class="value">{{ formData.apgarpfz }}</div>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row type="flex" justify="start" class="unit">
              <div class="label">产后脉搏</div>
              <div class="value">{{ formData.chmb }}</div>
            </el-row>
            <el-row type="flex" justify="start" class="unit">
              <div class="label">产后宫底高度</div>
              <div class="value">{{ formData.chgdgd }}</div>
            </el-row>
            <el-row type="flex" justify="start" class="unit">
              <div class="label">产瘤大小</div>
              <div class="value">{{ formData.cldx }}</div>
            </el-row>
            <el-row type="flex" justify="start" class="unit">
              <div class="label">分娩结局</div>
              <div class="value">{{ formData.fmjj }}</div>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" class="unit">
          <div class="label">新生儿异常情况</div>
          <div class="value">{{ formData.xseycqk }}</div>
        </el-row>
      </div>
      <div class="footer">
        <div class="divider"></div>
        <div class="clearfix">
          <div class="floatright footer-text">
            <span class="footer-lable">手术助手签名</span>
            <span class="footer-value">{{ formData.sszsqm }}</span>
          </div>
          <div class="floatright footer-text">
            <span class="footer-lable">器械护士签名</span>
            <span class="footer-value">{{ formData.qxhsqm }}</span>
          </div>
          <div class="floatright footer-text">
            <span class="footer-lable">麻醉医生签名</span>
            <span class="footer-value">{{ formData.mzysqm }}</span>
          </div>
          <div class="floatright footer-text">
            <span class="footer-lable">手术医生签名</span>
            <span class="footer-value">{{ formData.ssysqm }}</span>
          </div>
        </div>
        <div class="clearfix" style="margin-top:8px">
          <div class="floatright footer-text">
            <span class="footer-lable">记录人员签名</span>
            <span class="footer-value">{{ formData.jlryqm }}</span>
          </div>
          <div class="floatright footer-text">
            <span class="footer-lable">儿科医生签名</span>
            <span class="footer-value">{{ formData.ekysqm }}</span>
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
