<template>
  <div id="custom-select">
    <div ref="reference" :tabindex="0" style="outline:0" @focus="onFocus" @blur="onBlur" class="custom-select" @click.stop="onClick">
      <span class="custom-select-text">
        <van-tag class="tag" v-for="item in selected" :key="item" size="medium" round type="primary">{{getText(item)}}</van-tag>
      </span>
      <i class="custom-select-icon"></i>
    </div>
    <div ref="popup" class="custom-select-popup" v-show="show">
      <van-checkbox-group v-model="selected" @change="onChange">
        <van-cell-group>
          <van-cell
            v-for="(item, index) in options"
            clickable
            :key="item.value"
            :title="item.text"
            @click="toggle(index)"
          >
            <van-checkbox slot="right-icon" :name="item.value" ref="checkboxes" />
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    options: {
      type: Array,
    },
    checked: {
      type: Array,
      default: () =>{
        return []
      }
    }
  },
  data () {
    return {
      show: false,
      softFocus: false,
      selected: []
    }
  },
  created() {
    this.selected = this.checked
    this.$on('blur',(val)=>{
      if(!val) {
        this.show = false
      }
    })
  },
  methods: {
    onBlur (e) {
      this.softFocus = false
      setTimeout(()=>{
        this.$emit('blur', this.softFocus)
      },50)
    },
    onFocus(e){
      this.softFocus = true
    },
    onClick () {
      this.show = !this.show
      if (this.show) {
        this.$refs.reference.focus()
      }
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
    onChange () {
      this.$refs.reference.focus()
      this.$emit('change', this.selected)
    },
    getText (val) {
      return this.options.find(item=>{
        return item.value === val
      }).text
    }
  }
}
</script>

<style lang="scss">
.custom-select {
  position: relative;
  box-sizing: border-box;
  display: flex;
  min-height: 36px;
  padding: 5px 20px 5px 10px;
  margin: 10px;
  border-radius: 10px;
  font-size: 14px;
  color: #666;
  background-color: #fff;
  position: relative;
  &-text {
    display: inline-block;
    .tag {
      display:inline-block;
      margin:2px;
    }
  }
  &-icon {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    border-style: solid;
    border-color: #999 transparent transparent;
    border-width: 4px 4px 0;
    transition: transform .3s ease-in-out;
  }
  &-popup {
    position: absolute;
    // background-color: #666;
    // width: 100%;
    border: 1px solid rgb(215,215,215);
    // margin: 10px;
    left: 10px;
    right: 10px;
    z-index:99;
  }
}
.custom-select-popup {
  .van-cell {
    padding: 8px 15px !important;
  }
}
.custom-select:after {
    content: "";
    pointer-events: none;
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
}
.custom-content {
  margin-top: 200px;
  opacity: 1;
  top: 50px;
  background-color: #666;
}
</style>