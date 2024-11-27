import {
  emojiMap,
  emojiUrl
} from "../../../../utils/emojiMap"
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    message: {
      type: String,
      value: "",
      observer(newVal) {
        this.setData({
          renderDom: this.parseText(newVal),
        });
      }
    },
    isMine: {
      type: Boolean,
      value: true,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    renderDom: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    parseText(text) {
      const renderDom = [];
      let temp = text;
      let left = -1;
      let right = -1;
      while (temp !== '') {
        left = temp.indexOf('[');
        right = temp.indexOf(']');
        switch (left) {
          case 0:
            if (right === -1) {
              renderDom.push({
                name: 'span',
                text: temp,
              });
              temp = '';
            } else {
              const _emoji = temp.slice(0, right + 1);
              if (emojiMap[_emoji]) {
                renderDom.push({
                  name: 'img',
                  src: emojiUrl + emojiMap[_emoji],
                });
                temp = temp.substring(right + 1);
              } else {
                renderDom.push({
                  name: 'span',
                  text: '[',
                });
                temp = temp.slice(1);
              }
            }
            break;
          case -1:
            renderDom.push({
              name: 'span',
              text: temp,
            });
            temp = '';
            break;
          default:
            renderDom.push({
              name: 'span',
              text: temp.slice(0, left),
            });
            temp = temp.substring(left);
            break;
        }
      }
      return renderDom;
    }
  }
})