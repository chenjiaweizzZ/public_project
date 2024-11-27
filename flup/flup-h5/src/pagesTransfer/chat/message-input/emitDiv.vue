<template>
  <div
    class="emitDiv"
    id="emitDiv"
    ref="emitDiv"
    @paste="handlePaste"
    contenteditable="true"
    spellcheck="false"
    placeholder="请输入"
    v-html="inputText"
    v-on="$listeners"
  ></div>
</template>
<script>
export default {
    props:{
        inputText:{
            type:String,
            default:''
        }
    },
  data() {
    return {};
  },
  methods: {
    handlePaste(e) {
      e.preventDefault();
      let text;
      let clp = (e.originalEvent || e).clipboardData;
      if (clp === undefined || clp === null) {
        text = window.clipboardData.getData("text") || "";
        if (text !== "") {
          if (window.getSelection) {
            var newNode = document.createElement("span");
            newNode.innerHTML = text;
            window.getSelection().getRangeAt(0).insertNode(newNode);
          } else {
            document.selection.createRange().pasteHTML(text);
          }
        }
      } else {
        text = clp.getData("text/plain") || "";
        if (text !== "") {
          document.execCommand("insertText", false, text);
        }
      }
    },
    isFocus(){
        let div1 = document.getElementById("emitDiv").id;
        let currentFocus = document.activeElement.id;
        return div1 === currentFocus;
    },
    setFocus() {
        if(this.isFocus()){
            return false;
        }
        let el = this.$refs.emitDiv;
        el.focus();
        let range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        let sel = window.getSelection();
        //判断光标位置，如不需要可删除
        // if(sel.anchorOffset!=0){
        //     return;
        // };
        sel.removeAllRanges();
        sel.addRange(range);
    },
  },
};
</script>
<style lang="scss">
.emitDiv-image{
  width: 14px;
  height: 14px;
}
</style>
<style lang="scss" scoped>
.emitDiv {
  width: 100%;
  height: 100%;
  outline: none;
  padding: 8px 10px;
  overflow-y: auto;
  max-height: 200px;
  font-size: 14px;
  font-weight: normal;
  line-height: 17px;
  letter-spacing: 0.2px;
  color: #b2b2b2;
  &:focus::before {
    content: none;
  }
  &:empty:before {
    content: attr(placeholder);
  }
}
</style>
