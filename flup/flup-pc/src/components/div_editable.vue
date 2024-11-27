<template>
  <div
    class="div-editable"
    contenteditable="true"
    @input="changeText"
    @focus="isLocked = true"
    @blur="blurFunc"
    @keydown.enter="onKeyEnter"
  ></div>
</template>

<script>
export default {
  name: 'DivEditable',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  data() {
    return {
      // innerText: this.value,
      isLocked: false
    }
  },
  watch: {
    value() {
      if (!this.isLocked) {
        // this.innerText = this.value
        this.$el.innerHTML = this.value
      }
    }
  },
  methods: {
    changeText() {
      console.log('1')
      this.$emit('input', this.$el.innerHTML)
    },
    blurFunc() {
      this.isLocked = false
      this.$emit('blurFunc')
    },
    onKeyEnter(e){
      e.preventDefault()
      console.log(e)
      this.$el.innerHTML += '\n'
    }
  }
}
</script>

<style lang="scss">
.div-editable {
  width: 100%;
  // height: 100%;
  overflow-y: auto;
  word-break: break-word;
  outline: none;
  user-select: text;
  white-space: pre-wrap;
  text-align: left;
  padding: 10px;
  &[contenteditable=true] {
    &:empty:before {
      content: attr(placeholder);
      display: block;
      color: #ccc;
    }
  }
}
</style>