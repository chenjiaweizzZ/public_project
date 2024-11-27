<template>
    <div class="chart-container" id="chartCon" style="position:absolute;z-index:50;top:0;left:0;width:100%;padding-bottom:20px;">
        <div style="float:left;">
            <div class="show-chart" id="chartsBar" :style="{width:width+'px'}"></div>
        </div>
        <div style="float:left">
            <div class="show-chart" id="chartsPie" :style="{width:width+'px'}"></div>
        </div>
    </div>

</template>

<script>
    import echarts from 'echarts/lib/echarts';
    import 'echarts/lib/component/tooltip';
    import 'echarts/lib/component/legend';
    import 'echarts/lib/component/title';
    import 'echarts/lib/chart/pie'
    import 'echarts/lib/chart/bar'
    import 'echarts/lib/chart/line'

    export default {
        name: "echart-evaluation",
        props: {

            'AllData': {
                type: Array,
                required: true,
            },
        },
        data() {
            return {
                bar: {},
                pie: {},
                width: 968,
            }
        },
        created() {

        },
        mounted() {

            let chastBar = document.getElementById("chartCon")
            this.width = chastBar.offsetWidth;
            this.width = this.width >= 1300 ? this.width / 2 - 10 : this.width;
            setTimeout(() => {
                this.bar = echarts.init(document.getElementById('chartsBar'));
                this.pie = echarts.init(document.getElementById('chartsPie'));
                //线图
                let lineData = {
                    title: {
                        text: '近6个月签到率趋势',
                        subtext: '',
                        x: 'center',
                        top: 10,
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'cross',        // 默认为直线，可选为：'line' | 'shadow'
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    grid: {
                        left: 80,
                        bottom: 80,
                    },
                    xAxis: {
                        data: [],
                        type: 'category',
                        axisLabel: { rotate: 30, interval: 0 }
                    },
                    yAxis: {
                        max: 100,
                        min: 0,
                        type: 'value',
                        axisLabel: {
                            formatter: function (val) {
                                return val + '%';
                            }
                        },
                    },
                    series: [
                        {
                            name: '平均分数',
                            type: 'line',
                            data: [],
                            label: {
                                normal: {
                                    show: true,
                                    position: 'top'
                                }
                            },
                            barWidth: '50%',
                            //   animation: true,
                            //                            itemStyle: {
                            //                                normal: {
                            //                                    color: new echarts.graphic.LinearGradient(
                            //                                        0, 0, 0, 1,
                            //                                        [
                            //                                            {offset: 0, color: '#83bff6'},
                            //                                            {offset: 0.5, color: '#188df0'},
                            //                                            {offset: 1, color: '#188df0'}
                            //                                        ]
                            //                                    )
                            //                                },
                            //                                emphasis: {
                            //                                    color: new echarts.graphic.LinearGradient(
                            //                                        0, 0, 0, 1,
                            //                                        [
                            //                                            {offset: 0, color: '#2378f7'},
                            //                                            {offset: 0.7, color: '#2378f7'},
                            //                                            {offset: 1, color: '#83bff6'}
                            //                                        ]
                            //                                    )
                            //                                }
                            //                            },
                        }]
                };
                //饼图
                let pieData = {
                    title: {
                        text: '得分比例分析',
                        subtext: '仅统计本页数据',
                        x: 'center',
                        top: 20,
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        x: 'center',
                        y: 'bottom',
                        data: ['100分', '90-100分', '80-90分', '70-80分', '60-70分', '60分以下']
                    },
                    series: [
                        {
                            name: '得分比例',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                            // roseType : 'radius',
                            stillShowZeroSum: true,
                            label: {
                                normal: {
                                    formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                                    backgroundColor: '#eee',
                                    borderColor: '#aaa',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    rich: {
                                        a: {
                                            color: '#999',
                                            lineHeight: 22,
                                            align: 'center'
                                        },
                                        // abg: {
                                        //     backgroundColor: '#333',
                                        //     width: '100%',
                                        //     align: 'right',
                                        //     height: 22,
                                        //     borderRadius: [4, 4, 0, 0]
                                        // },
                                        hr: {
                                            borderColor: '#aaa',
                                            width: '100%',
                                            borderWidth: 0.5,
                                            height: 0
                                        },
                                        b: {
                                            fontSize: 16,
                                            lineHeight: 33
                                        },
                                        per: {
                                            color: '#eee',
                                            backgroundColor: '#334455',
                                            padding: [2, 4],
                                            borderRadius: 2
                                        }
                                    }
                                },

                            },
                            data: [],

                        }
                    ]
                };
                this.drawBar(lineData);
                this.drawPie(pieData);
            }, 0);
            // window.onresize=()=>{
            //     this.width=this.$refs.chartCon.offsetWidth;
            //     //console.log(this.width);
            // }
            // this.width=this.width?this.width:800;
        },
        beforeUpdate() {

        },
        watch: {
            AllData: {
                handler(newVal, oldVal) {
                    //console.log(newVal,oldVal)
                    let obj;
                    if (!newVal || newVal.length === 0) {
                        obj = {
                            xData: [],
                            yData: [],
                            pieData: [],
                        }
                    } else {
                        obj = this.processinglineData(newVal);
                    }
                    if (typeof this.bar.setOption !== 'function') {
                        // setT()
                    } else {

                    }
                    this.drawBar({
                        xAxis: {
                            data: obj.xData,
                            axisLabel: { rotate: 30, interval: 0 }
                        },
                        series: [
                            {
                                type: 'line',
                                name: '平均分数',
                                data: obj.yData,
                            }
                        ]
                    });
                    this.drawPie({
                        series: [
                            {
                                name: '得分比例',
                                data: obj.pieData,
                            }
                        ]
                    });
                },
                deep: true,
            },
        },
        methods: {
            processinglineData(data) {
                if (data.length === 0) {
                    return [];
                }
                let len = data.length;
                let con = new Map();
                let xData = [];       //  x轴的数据
                let yData = [];   // y轴的数据
                let pieData = [
                    { value: 0, name: '100分' },
                    { value: 0, name: '90-100分' },
                    { value: 0, name: '80-90分' },
                    { value: 0, name: '70-80分' },
                    { value: 0, name: '60-70分' },
                    { value: 0, name: '60分以下' },
                ];//饼图
                let conPie = new Map();
                let testScore = txt => {
                    if (conPie.has(txt)) {
                        conPie.set(txt, conPie.get(txt) + 1)
                    } else {
                        conPie.set(txt, 1);
                    }
                };
                let switchScore = hund => {
                    let txt = '60分以下';
                    switch (true) {
                        case hund === 100:
                            txt = '100分';
                            testScore(txt);
                            break;
                        case hund >= 90:
                            txt = '90-100分';
                            testScore(txt);
                            break;
                        case hund >= 80:
                            txt = '80-90分';
                            testScore(txt);
                            break;
                        case hund >= 70:
                            txt = '70-80分';
                            testScore(txt);
                            break;
                        case hund >= 60:
                            txt = '60-70分';
                            testScore(txt);
                            break;
                        default:
                            testScore(txt);
                    }
                };


                for (let value of data) {
                    let hund = parseFloat(value.hundredmarksystem);
                    switchScore(hund);//处理饼图数据来源
                    for (let val of value.finishpointtable) {
                        if (val.score || val.score == 0) {
                            let num = parseFloat(val.score) * 1000;
                            if (con.has(val.title)) {
                                con.set(val.title, con.get(val.title) + num)
                            } else {
                                con.set(val.title, num)
                            }
                        }
                    }
                }
                for (let val of pieData) {
                    // if(val.name===)
                    for (let [key, value] of conPie.entries()) {
                        if (val.name === key) {
                            val.value = value;
                        }
                    }
                }
                let allData = Array.from(con);
                let some = allData.sort((x, y) => {
                    let val1 = x[1];
                    let val2 = y[1];
                    //降序
                    if (val1 < val2) {
                        return 1;
                    } else if (val1 > val2) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
                some.forEach(val => {
                    let num = Math.round(val[1] / len).toString() / 1000;
                    yData.push(num.toFixed(3));
                    xData.push(val[0]);
                });
                // //console.log(xData,yData,pieData);
                return { xData, yData, pieData }
            },
            drawBar(lineData) {
                this.bar.setOption(lineData);
            },
            drawPie(pieData) {
                this.pie.setOption(pieData);
            }
        }
    }
</script>

<style scoped>
    .chart-container:after {
        content: '';
        display: table;
        clear: both;
    }

    .show-chart {
        width: 100%;
        height: 500px;
    }
</style>