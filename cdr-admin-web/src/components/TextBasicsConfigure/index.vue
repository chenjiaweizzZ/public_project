<!--纯文本类型基础配置组件  -->
<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item v-if="true" name="1">
        <template slot="title">
          <div class="collapse-title">
            <div class="title-icon"></div>
            <div>基础设置</div>
          </div>
        </template>
        <div>
          <div class="data-cofig-item"  style="margin-bottom:10px">
            <div class="item-title">指标说明</div>
            <div class="item-config">
              <el-input v-model="realTargetRemark" placeholder="请输入指标说明" @input="changeTargetRemark" />
            </div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item v-if="true" name="2">
        <template slot="title">
          <div class="collapse-title">
            <div class="title-icon"></div>
            <div>文本设置</div>
          </div>
        </template>
        <div>
          <div class="data-cofig-item" >
            <div class="item-title">维度字体</div>
            <div v-if="mode=='target'">
              <div class="item-config-child">
                <el-select v-model="realObj.weiduFontSize" @change="changeStyleObj">
                  <el-option v-for="item in configOpt.fontSizeOption" :key="item.id" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-select v-model="realObj.weiduFontWeight" @change="changeStyleObj">
                  <el-option v-for="item in configOpt.fontWeightOption" :key="item.id" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-input v-model="realObj.weiduColor" @input="changeStyleObj" style="width: 300px">
                  <!-- <i slot="suffix" class="el-input__icon el-icon-date"></i> -->
                  <el-color-picker slot="prefix" v-model="realObj.weiduColor" show-alpha color-format="rgb" @change="changeStyleObj" size="mini"></el-color-picker>
                </el-input>
              </div>
            </div>
            <div v-else style="width: 100%;">
              <div class="item-config-child">
                <el-select v-model="realObj.weiduFontSize" @change="changeStyleObj">
                  <el-option v-for="item in configOpt.fontSizeOption" :key="item.id" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>
              <div class="item-config-child">
                <el-select v-model="realObj.weiduFontWeight" @change="changeStyleObj">
                  <el-option v-for="item in configOpt.fontWeightOption" :key="item.id" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>
              <div class="item-config-child">
                <el-input v-model="realObj.weiduColor" @input="changeStyleObj" style="width: 300px">
                  <!-- <i slot="suffix" class="el-input__icon el-icon-date"></i> -->
                  <el-color-picker slot="prefix" v-model="realObj.weiduColor" show-alpha color-format="rgb" @change="changeStyleObj" size="mini"></el-color-picker>
                </el-input>
              </div>
            </div>
          </div>
          <div class="data-cofig-item" style="margin-top:4px">
            <div class="item-title">度量字体</div>
            <div v-if="mode=='target'">
              <div class="item-config-child">
                <el-select v-model="realObj.duliangFontSize" @change="changeStyleObj">
                  <el-option v-for="item in configOpt.fontSizeOption" :key="item.id" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-select v-model="realObj.duliangFontWeight" @change="changeStyleObj">
                  <el-option v-for="item in configOpt.fontWeightOption" :key="item.id" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-input v-model="realObj.duliangColor" @input="changeStyleObj" style="width: 300px">
                  <!-- <i slot="suffix" class="el-input__icon el-icon-date"></i> -->
                  <el-color-picker slot="prefix" v-model="realObj.duliangColor" show-alpha color-format="rgb" @change="changeStyleObj" size="mini"></el-color-picker>
                </el-input>
              </div>
            </div>
            <div v-else style="width: 100%;">
              <div class="item-config-child">
                <el-select v-model="realObj.duliangFontSize" @change="changeStyleObj">
                  <el-option v-for="item in configOpt.fontSizeOption" :key="item.id" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>
              <div class="item-config-child">
                <el-select v-model="realObj.duliangFontWeight" @change="changeStyleObj">
                  <el-option v-for="item in configOpt.fontWeightOption" :key="item.id" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </div>
              <div class="item-config-child">
                <el-input v-model="realObj.duliangColor" @input="changeStyleObj" style="width: 300px">
                  <!-- <i slot="suffix" class="el-input__icon el-icon-date"></i> -->
                  <el-color-picker slot="prefix" v-model="realObj.duliangColor" show-alpha color-format="rgb" @change="changeStyleObj" size="mini"></el-color-picker>
                </el-input>
              </div>
            </div>
          </div>
          <div class="data-cofig-item" style="margin-top:4px">
            <div class="item-title">度量单位</div>
            <div class="item-config-child">
              <el-input v-model="realObj.duliangDanwei" style="width: 202px" @input="changeStyleObj">
                <!-- <i slot="suffix" class="el-input__icon el-icon-date"></i> -->
              </el-input>
            </div>
          </div>
          <div class="data-cofig-item" style="margin-top:4px">
            <div class="item-title">是否显示冒号</div>
            <div class="item-config-child">
              <el-switch v-model="realObj.isShowMaohao" @change="changeStyleObj"></el-switch>
            </div>
          </div>
          <div class="data-cofig-item" style="margin-bottom:10px;margin-top:4px">
            <div class="item-title">对齐方式</div>
            <div class="item-config-child">
              <el-radio-group v-model="realObj.alignment" @change="changeStyleObj" size="small">
                <el-radio label="2">水平对齐</el-radio>
                <el-radio label="1">垂直对齐</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template slot="title">
          <div class="collapse-title">
            <div class="title-icon"></div>
            <div>间距设置</div>
          </div>
        </template>
        <div>
          <div class="data-cofig-item" >
            <div class="item-title">左间距</div>
            <div class="item-config">
              <div class="item-config-child">
                <el-radio-group v-model="realObj.leftSpace" size="mini" @change="changeStyleObj">
                  <el-radio-button label="0%"></el-radio-button>
                  <el-radio-button label="5%"></el-radio-button>
                  <el-radio-button label="10%"></el-radio-button>
                  <el-radio-button label="15%"></el-radio-button>
                  <el-radio-button label="20%"></el-radio-button>
                </el-radio-group>
              </div>
              <div class="item-config-child">
                <el-input v-model="realObj.leftSpace" placeholder="支持输入百分比" @input="changeStyleObj" style="width: 180px" />
              </div>
            </div>
          </div>
          <div class="data-cofig-item"  style="margin-top:4px">
            <div class="item-title">右间距</div>
            <div class="item-config">
              <div class="item-config-child">
                <el-radio-group v-model="realObj.rightSpace" size="mini" @change="changeStyleObj">
                  <el-radio-button label="0%"></el-radio-button>
                  <el-radio-button label="5%"></el-radio-button>
                  <el-radio-button label="10%"></el-radio-button>
                  <el-radio-button label="15%"></el-radio-button>
                  <el-radio-button label="20%"></el-radio-button>
                </el-radio-group>
              </div>
              <div class="item-config-child">
                <el-input v-model="realObj.rightSpace" @change="changeStyleObj" placeholder="支持输入百分比" style="width: 180px" />
              </div>
            </div>
          </div>
          <div class="data-cofig-item" style="margin-top:4px">
            <div class="item-title">上间距</div>
            <div class="item-config">
              <div class="item-config-child">
                <el-radio-group v-model="realObj.topSpace" size="mini" @change="changeStyleObj">
                  <el-radio-button label="0%"></el-radio-button>
                  <el-radio-button label="5%"></el-radio-button>
                  <el-radio-button label="10%"></el-radio-button>
                  <el-radio-button label="15%"></el-radio-button>
                  <el-radio-button label="20%"></el-radio-button>
                </el-radio-group>
              </div>
              <div class="item-config-child">
                <el-input v-model="realObj.topSpace" placeholder="支持输入百分比" style="width: 180px" @input="changeStyleObj" />
              </div>
            </div>
          </div>
          <div class="data-cofig-item" style="padding-bottom: 10px;margin-top:4px">
            <div class="item-title">下间距</div>
            <div class="item-config">
              <div class="item-config-child">
                <el-radio-group v-model="realObj.bottomSpace" size="mini" @change="changeStyleObj">
                  <el-radio-button label="0%"></el-radio-button>
                  <el-radio-button label="5%"></el-radio-button>
                  <el-radio-button label="10%"></el-radio-button>
                  <el-radio-button label="15%"></el-radio-button>
                  <el-radio-button label="20%"></el-radio-button>
                </el-radio-group>
              </div>
              <div class="item-config-child">
                <el-input v-model="realObj.bottomSpace" placeholder="支持输入百分比" @input="changeStyleObj" style="width: 180px" />
              </div>
            </div>
          </div>
        </div>
      </el-collapse-item>
      <!-- 大屏编辑专属插槽 -->
      <el-collapse-item v-if="mode === 'screen'" name="8">
        <template slot="title">
          <div class="collapse-title">
            <div class="title-icon"></div>
            <div>尺寸及位置设置</div>
          </div>
        </template>
        <slot name="locationSetting"></slot>
      </el-collapse-item>
      <el-collapse-item v-if="true" name="4">
        <template slot="title">
          <div class="collapse-title">
            <div class="title-icon"></div>
            <div>背景设置</div>
          </div>
        </template>
        <div>
          <div class="data-cofig-item">
            <div class="item-title">背景色</div>
            <div class="item-config-child">
              <el-input v-model="realObj.backgroundColor" style="width: 190px" @input="changeStyleObj">
                <el-color-picker v-model="realObj.backgroundColor" show-alpha slot="prefix" size="mini" @change="changeStyleObj"></el-color-picker>
              </el-input>
            </div>
          </div>
          <div class="data-cofig-item" style="margin-bottom:10px;margin-top:4px">
            <div class="item-title">圆角半径</div>
            <div class="item-config-child">
              <el-input v-model="realObj.backgroundRadius" @input="changeStyleObj" style="width: 190px">
                <!-- <i slot="suffix" class="el-input__icon el-icon-date"></i> -->
              </el-input>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import configOpt from '@/utils/BIUIConfiguration';
import _ from '@/utils';
export default {
  props: {
    styleObj: {
      type: Object,
    },
    targetRemark: {
      type: String,
      default: '',
    },
    mode: {
      type: String,
      default: 'target',
    },
  },
  data() {
    return {
      activeNames: ['1', '2', '3', '8', '4'],
      configOpt,
      // styleObj: {
      //   weiduFontSize: '24px',
      //   weiduFontWeight: '',
      //   weiduColor: '',
      //   duliangColor: '',
      //   isShowMaohao: true,
      //   duliangDanwei: '',
      //   leftSpace: '',
      //   rightSpace: '',
      //   topSpace: '',
      //   bottomSpace: '',
      //   alignment: '2',
      //   backgroundColor: ''
      // }
      realObj: {},
      realTargetRemark: '',
    };
  },
  watch: {
    styleObj: {
      handler: function (val) {
        this.realObj = _.deepCopy(val, {});
        console.log(this.realObj, val, '初始化realObj');
      },
      deep: true,
      immediate: true,
    },
    targetRemark: {
      handler: function (val) {
        this.realTargetRemark = val;
      },
      deep: true,
      immediate: true,
    },
  },
  components: {},

  computed: {},

  methods: {
    changeStyleObj() {
      console.log(this.realObj, '85623');
      this.$emit('changeTextStyleObj', this.realObj);
    },
    changeTargetRemark() {
      this.$emit('changeTargetRemark', this.realTargetRemark);
    },
  },
};
</script>
<style lang="scss" scoped>
.collapse-title {
  width: 100%;
  display: flex;
  align-items: center;
  .title-icon {
    box-sizing: border-box;
    width: 4px;
    height: 17px;
    background: #0075ff;
    margin-top: 2px;
    margin-right: 10px;
  }
}
.data-cofig-item {
  display: flex;
  align-items: flex-start;
  padding: 0 10px;
  padding-top: 10px;
  .item-title {
    color: #3b5370;
    min-width: 100px;
    width: 100px;
    display: flex;
    justify-content: flex-end;
    margin-right: 14px;
  }
  .item-config {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    .item-config-child {
      padding-right: 10px;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      .themeColor {
        width: 240px;
        .block {
          margin-right: 4px;
          width: 16px;
          height: 16px;
          display: inline-block;
          border-radius: 2px;
          vertical-align: sub;
        }
      }
    }
  }
}

::v-deep .el-select {
  margin-right: 14px;
}
::v-deep .el-color-picker__trigger {
  border: none;
}
::v-deep .el-input--prefix .el-input__inner {
  // margin-left: 5px;
}
</style>
