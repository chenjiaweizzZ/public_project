<template>
    <div class="addcontent" v-show="config.show">
        <i class="shade" @click="close"></i>
        <ul v-show="config.show" class="select" style="animation-duration: .1s" :style="{top:config.fixedtop,right:config.fixedright}"
            enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutUp">
            <li v-for='(value,index) in list' @click='select(value)' v-if="value.isused == 1">
                {{ value.name }}
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "addselect",
        props: {
            showAdd: {
                type: Boolean,
                default: false
            },
            config: {
                default: function () {
                    return {
                        show: false,
                        label: '',//需要显示的label
                        fixedright: 0,//right值
                        fixedtop: 0,//top值
                    }
                }
            },
            dataList: {
                type: Array,
                default: function () {
                    return []
                }
            }
        },
        data() {
            return {
                addButton: false,

            }
        },
        mounted: function () {
            this.addButton = this.showAdd
        },
        methods: {
            close() {
                this.config.show = false;
            },
            select(value) {
                this.$emit('confirm', value);//传给父组件
            }
        },
        watch: {
            showAdd(newVal, oldVal) {
                this.addButton = newVal
            },
        },
        computed: {
            list() {
                let label = this.config.label || '';
                if (this.dataList.length > 0) {
                    this.stopclick = false;
                    this.dataList.map(value => {
                        value.name = value[label]
                        value.isused = value.router == 'fdAction_add' ? this.addButton : value.isused
                    });
                    return this.dataList
                } else {
                    this.stopclick = true;
                    return [
                        {
                            'name': '当前暂无数据'
                        }
                    ]
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    .shade {
        height: 100%;
        width: 100%;
        min-width: 100%;
        min-height: 100%;
        background-color: rgba(0, 0, 0, 0.1);
        position: absolute;
        top: 0;
        left: 0;
        z-index: 99;
    }

    .stopclick {
        pointer-events: none;
    }

    .select {
        background: #fff;
        display: inline-block;
        padding: .15rem;
        position: fixed;
        z-index: 999;
    }

    ul {
        font-family: "Microsoft YaHei";
        border-radius: 10px;
        text-align: center;
        min-width: 2rem;
        min-height: 1rem;
        li {
            color: #666;
            min-width: 2rem;
            line-height: .5rem;
            padding: 0.1rem 0.35rem;
            border-bottom: 1px solid #eee;
        }
        li:last-child {
            border: none;
        }
    }

    ul:before {
        display: inline-block;
        content: '';
        width: 0;
        height: 0;
        border-left: 0.2rem solid transparent;
        border-right: 0.2rem solid transparent;
        border-bottom: 0.2rem solid #fff;
        position: absolute;
        top: -0.19rem;
        right: 0.2rem;
    }
</style>