import Vue from 'vue';
import { on, off, getStyle } from 'element-ui/src/utils/dom';

/**
 * show-overflow-tooltip for text
 * 当text没有被折叠时，不显示tooltip
 */
Vue.directive('zj-plus-show-overflow-tooltip', {
  inserted: function (el, binding, vnode) {
    if (!el.getAttribute('aria-describedby')) {
      return;
    }

    // TODO: 在有此自定义指令的地方，点击触发弹窗，会出现tooltip显示情况，暂时需要使用 tooltip disabled 属性来避免此问题。后续再处理此问题

    let value = binding.value;

    // 若有值，则高度超出时显示tool-tip(多行高度省略)
    if (value) {
      el.addEventListener('mouseenter', function (e) {
        let defalutSilent = !!Vue.config.silent;
        Vue.config.silent = true;
        vnode.componentInstance.disabled = true;
        const range = document.createRange();
        range.setStart(el, 0);
        range.setEnd(el, el.childNodes.length);
        const rangeHeight = range.getBoundingClientRect().height;
        const padding = (parseInt(getStyle(el, 'paddingTop'), 10) || 0) + (parseInt(getStyle(el, 'paddingBottom'), 10) || 0);
        if (rangeHeight + padding > el.offsetHeight || el.scrollHeight > el.offsetHeight) {
          vnode.componentInstance.disabled = false;
        }
        Vue.config.silent = defalutSilent;
      });
    } else {
      // 单行宽度省略
      el.addEventListener('mouseenter', function (e) {
        let defalutSilent = !!Vue.config.silent;
        Vue.config.silent = true;
        vnode.componentInstance.disabled = true;
        const range = document.createRange();
        range.setStart(el, 0);
        range.setEnd(el, el.childNodes.length);
        // const rangeWidth = range.getBoundingClientRect().width; 
        // offsetWidth 会取整，会存在bug
        const rangeWidth = Math.floor(range.getBoundingClientRect().width);
        const padding = (parseInt(getStyle(el, 'paddingLeft'), 10) || 0) + (parseInt(getStyle(el, 'paddingRight'), 10) || 0);
        if (rangeWidth + padding > el.offsetWidth || el.scrollWidth > el.offsetWidth) {
          vnode.componentInstance.disabled = false;
        }
        Vue.config.silent = defalutSilent;
      });
    }

    // 鼠标离开，关闭tooltip
    el.addEventListener('mouseleave', function (e) {
      let defalutSilent = !!Vue.config.silent;
      Vue.config.silent = true;
      vnode.componentInstance.disabled = true;
      Vue.config.silent = defalutSilent;
    })
  }
});
