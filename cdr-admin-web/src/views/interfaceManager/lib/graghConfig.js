import { Graph, Shape } from '@antv/x6'

const LINE_HEIGHT = 24
const NODE_WIDTH = 300

/* 自定义Node */
Graph.registerPortLayout(
  'erPortPosition',
  portsPositionArgs => {
    return portsPositionArgs.map((_, index) => {
      return {
        position: {
          x: 0,
          y: (index + 1) * LINE_HEIGHT
        },
        angle: 0
      }
    })
  },
  true
)
Graph.registerNode(
  'er-rect',
  {
    inherit: 'rect',
    markup: [
      {
        tagName: 'rect',
        selector: 'body'
      },
      {
        tagName: 'text',
        selector: 'label'
      }
    ],
    attrs: {
      rect: {
        strokeWidth: 1,
        stroke: '#5F95FF',
        fill: '#5F95FF'
      },
      label: {
        fontWeight: 'bold',
        fill: '#ffffff',
        fontSize: 12
      }
    },
    ports: {
      groups: {
        list: {
          markup: [
            {
              tagName: 'rect',
              selector: 'portBody'
            },
            {
              tagName: 'image',
              selector: 'checkbox'
            },
            {
              tagName: 'text',
              selector: 'portNameLabel'
            },
            {
              tagName: 'text',
              selector: 'portTypeLabel'
            }
          ],
          attrs: {
            portBody: {
              width: NODE_WIDTH,
              height: LINE_HEIGHT,
              strokeWidth: 1,
              stroke: '#5F95FF',
              fill: '#EFF4FF',
              magnet: true // 当 magnet 属性为 true 时，表示该元素可以被链接，即在连线过程中可以被当做连线的起点或终点，与链接桩类似。
            },
            checkbox: {
              event: 'node:statusChange',
              width: 12,
              height: 12,
              ref: 'portBody',
              refX: 6,
              refY: 6
            },
            portNameLabel: {
              ref: 'portBody',
              refX: 26,
              refY: 6,
              fontSize: 10
            },
            portTypeLabel: {
              ref: 'portBody',
              refX: 125,
              refY: 6,
              fontSize: 10
            }
          },
          position: 'erPortPosition'
        }
      }
    }
  },
  true
)

/* 画布配置 */
const graph = e => {
  return new Graph({
    container: e,
    autoResize: true,
    panning: {
      enabled: true,
    },
    grid: {
      size: 10, // 网格大小 10px
      visible: false // 绘制网格，默认绘制 dot 类型网格
    },
    connecting: {
      allowBlank: false,
      allowNode: false,
      allowEdge: false,
      allowLoop: false,
      router: {
        name: 'er',
        args: {
          offset: 25,
          direction: 'H'
        }
      },
      createEdge() {
        return new Shape.Edge({
          attrs: {
            line: {
              stroke: '#A2B1C3',
              strokeWidth: 2
            }
          }
        })
      }
    }
  })
}

export default graph
