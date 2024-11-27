<template>
    <div class="bottomTabbar">
        <div class="bottomTabbar-item" v-for="item in tabList" :key="item.path" @click="tabChange(item.path)">
            <img class="bottomTabbar-item__img" :src="currentPath == item.path ? item.activeUrl : item.imgUrl" alt="">
            <div class="bottomTabbar-item__text" :class="{ 'active': currentPath == item.path }">{{ item.label }}</div>
            <div class="bottomTabbar-item__unread" :class="{ 'more' : unreadMessage > 10 }" v-if="unreadMessage && item.path == '/consult'">{{ unreadMessage > 10 ? '10+' : unreadMessage }}</div>
        </div>
    </div>
</template>
<script>
import {  mapState } from 'vuex';
import home from "@/assets/images/tabbar/home.png";
import knowledge from "@/assets/images/tabbar/knowledge.png";
import core from "@/assets/images/tabbar/core.png";
import home2 from "@/assets/images/tabbar/home2.png";
import knowledge2 from "@/assets/images/tabbar/knowledge2.png";
import core2 from "@/assets/images/tabbar/core2.png";
import consult from "@/assets/images/tabbar/consult.png";
import consult2 from "@/assets/images/tabbar/consult2.png";
import cart from "@/assets/images/tabbar/cart.png";
import cart2 from "@/assets/images/tabbar/cart2.png";
export default {
    name: 'bottomTabbar',
    props: {
        path: {
            type: String,
            default: '',
        }
    },
    data() {
        return {
            tabList: [
                {
                    path: '/home',
                    label: '首页',
                    imgUrl: home,
                    activeUrl: home2
                },
                // {
                //     path:'/knowledge',
                //     label:'健康知识',
                //     imgUrl:knowledge,
                //     activeUrl:knowledge2
                // },
                {
                    path: '/consult',
                    label: '咨询',
                    imgUrl: consult,
                    activeUrl: consult2,
                    toDoNuma: this.unreadMessage
                },
                {
                    path: '/shoppingCart',
                    label: '预选方案',
                    imgUrl: cart,
                    activeUrl: cart2,
                },
                {
                    path: '/core',
                    label: '个人中心',
                    imgUrl: core,
                    activeUrl: core2
                },
            ]
        }
    },
    computed: {
        ...mapState('chat', ['unreadMessage']),
        currentPath: {
            get() {
                return this.path;
            },
            set(val) {
                this.$emit('update:path', val);
            }
        },
    },
    methods: {
        tabChange(val) {
            if (val == '/consult') {
                this.$router.push({
                    name: 'consult'
                })
                return
            }
            if (this.currentPath != val) {
                this.currentPath = val;
                this.$router.replace(val);
            }
        },
    }
}
</script>
<style lang="scss" scoped>
.bottomTabbar {
    &::after {
        content: '';
        width: 100%;
        height: 1px;
        position: absolute;
        box-shadow: inset 0px 0.5px 0px 0px #E2E2E2;
        background-color: rgba(255, 255, 255, 0.01);
    }

    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 100;
    height: 69px;
    width: 100%;
    background-color: #FDFDFD;

    display: flex;
    justify-content: space-around;

    &-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;

        &__img {
            width: 26px;
            height: 26px;
            margin: 4px 0;
        }

        &__text {
            color: #394A3E;
            font-size: 10px;
            line-height: 12px;
        }

        &__unread {
            position: absolute;
            right: -5px;
            top: 3px;
            min-width: 16px;
            min-height: 16px;
            background-color: #FF5500;
            border-radius: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #FFF;
            font-size: 12px;
            font-weight: 500;
            // padding: 1px;
        }

        .more {
            right: -15px;
        }


        &:nth-child(2) {
            left: 5px;
        }
    }

    .active {
        font-weight: 600;
        color: #00982D;
    }
}</style>