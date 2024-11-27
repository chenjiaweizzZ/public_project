//自定义指令
//必填绑定在input需添加  @blur="双向绑定的值 = $event.target.value"

// 只能输入字母和数字
let alphanumeric = {
  inserted: function (el) {
    const input = el.querySelector('.el-input__inner');
    input.onkeyup = function (e) {
      input.value = input.value.replace(/[^A-Za-z0-9]/g, '')
    }
    input.onblur = function (e) {
      input.value = input.value.replace(/[^A-Za-z0-9]/g, '')
    }
    input.oninput = function (e) {
      input.value = input.value.replace(/[^A-Za-z0-9]/g, '')
    }
  }
};
//只能输入数字
let numberSign = {
  inserted: function (el) {
    const input = el.querySelector('.el-input__inner');
    input.onkeyup = function (e) {
      input.value = input.value.replace(/[^\d]/g, '')
    }
    input.onblur = function (e) {
      input.value = input.value.replace(/[^\d]/g, '')
    }
    input.oninput = function (e) {
      input.value = input.value.replace(/[^\d]/g, '')
    }
  }
};
//只能输入字母数字符号
let alphanumericSymbol = {
  inserted: function (el) {
    const input = el.querySelector('.el-input__inner');
    input.onkeyup = function (e) {
      input.value = input.value.replace(/[\u4e00-\u9fa5]/g, '')
    }
    input.onblur = function (e) {
      input.value = input.value.replace(/[\u4e00-\u9fa5]/g, '')
    }
    input.oninput = function (e) {
      input.value = input.value.replace(/[\u4e00-\u9fa5]/g, '')
    }
  }
};


// 拖拽指令
let drag = {
  bind: function (el, binding) {
    let odiv = el;   //获取当前元素
    odiv.onmousedown = (e) => {
      //算出鼠标相对元素的位置
      let disX = e.clientX - odiv.offsetLeft;
      let disY = e.clientY - odiv.offsetTop;
      let screenWidth = document.body.clientWidth;    // 屏幕宽
      let screeHeight = document.body.clientHeight    // 屏幕高
      let x, y
      document.onmousemove = (e) => {
        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = e.clientX - disX;
        let top = e.clientY - disY;
        x = left
        y = top
        //移动当前元素
        if (left > 20 && left + 230 < screenWidth) {
          odiv.style.left = left + 'px';
        }
        if (top > 0 && top + 50 < screeHeight) {
          odiv.style.top = top + 'px';
        }

      };
      document.onmouseup = (e) => {
        // if ((x || x == 0) && (y || y == 0)) {
        //   let coordinates = JSON.stringify({ x, y })
        //   sessionStorage.setItem(binding.value.setCoordinates, coordinates)
        // }
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }
};

//拖拽缩放
let dragZoom = {
  bind: (el, binding) => {
    //绑定默认样式
    el.style.zIndex = 9
    el.style.backgroundColor = 'rgba(255,255,255,1)'
    //如果为编辑状态
    if (binding.value || binding.value === undefined) {
      //定义该元素的 top left width height
      let x, y, w, h
      //鼠标的起始和结束坐标
      let cx_start, cy_start, cx_end, cy_end
      //判断鼠标样式
      el.onmousemove = (e) => {
        //获取鼠标当前位置
        let cx_now = e.clientX
        let cy_now = e.clientY
        //获取div右下角相对浏览器的位置
        let {
          top: el_top,
          left: el_left,
          width: el_width,
          height: el_height,
        } = el.getBoundingClientRect()
        let el_bottom_height = el_top + el_height
        let el_right_width = el_left + el_width
        //判断鼠标是否在div下边界
        let mouse_in_bottom =
          cy_now <= el_bottom_height + 5 && cy_now >= el_bottom_height - 5
        //判断鼠标是否在div右边界
        let mouse_in_right =
          cx_now <= el_right_width + 5 && cx_now >= el_right_width - 5
        if (mouse_in_bottom && mouse_in_right) {
          el.style.cursor = 'se-resize'
        } else if (mouse_in_right) {
          el.style.cursor = 'e-resize'
        } else if (mouse_in_bottom) {
          el.style.cursor = 's-resize'
        } else {
          el.style.cursor = 'move'
        }
      }
      el.onmousedown = (e) => {
        let mouse = el.style.cursor
        //更改默认样式
        el.style.backgroundColor = 'rgba(255,255,255,1)'
        el.style.zIndex = 99
        //对象解构赋值
        let {
          left: el_x,
          top: el_y,
          width: el_w,
          height: el_h,
        } = window.getComputedStyle(el)
        x = el_x
        y = el_y
        w = el_w
        h = el_h
        cx_start = e.clientX
        cy_start = e.clientY
        //绑定移动事件
        document.onmousemove = (e) => {
          cx_end = e.clientX
          cy_end = e.clientY
          //默认左下方向配置
          let x_move = cx_end - cx_start
          let y_move = cy_end - cy_start
          let direct = ['width', 'height']
          let pos = [w, h]
          let move = [x_move, y_move]
          let limit = 50
          //判断鼠标的类型进行对应的操作
          switch (mouse) {
            case 'e-resize':
              direct = ['width']
              pos = [w]
              move = [x_move]
              break
            case 's-resize':
              direct = ['height']
              pos = [h]
              move = [y_move]
              break
            case 'move':
              direct = ['left', 'top']
              pos = [x, y]
              limit = 0
              break
          }
          handle_div(direct, pos, move, limit)
        }
        //取消移动事件
        document.onmouseup = (e) => {
          //还原默认样式
          el.style.zIndex = 9
          el.style.backgroundColor = 'rgba(255,255,255,1)'
          document.onmousemove = null
        }
        /**
         * 操作DOM位置和大小方法
         * @param direct 方向
         * @param pos 尺寸/坐标
         * @param move 拖动距离
         * @param limit 限定范围
         */
        function handle_div(direct, pos, move, limit) {
          for (let i = 0; i < direct.length; i++) {
            let val = parseInt(pos[i]) + move[i]
            val = val <= limit ? limit : val
            el.style[direct[i]] = val + 'px'
          }
        }
      }
    } else {
      el.style.cursor = 'default'
      //移除点击事件
      el.onmousedown = null
      el.onmousemove = null
    }
  },
}

export { alphanumeric, numberSign, alphanumericSymbol, drag, dragZoom }