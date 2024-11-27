<template>
    <div id="plan">
        <ul id="main-content">
            <li v-for="(val,index) in dataList" :key ='val.id'>
                <i class="icon" :style = "{'border-color':computeColor(val)}"></i>
                <p>{{val.starttimestr | substr(0,4)}}年{{val.starttimestr | substr(5,2)}}月{{val.starttimestr | substr(8,2)}}日</p>
                <p>{{val.starttimestr | substr(11,5)}}</p>
                <div class="tap-content" @click.stop="todetail(val.id)">
                    <i>{{val.typename}}</i>
                    <p>
                        <span>活动主题</span>{{val.theme}}
                    </p>
                    <p>
                        <span>科室</span>{{val.showofficename}}
                    </p>
                    <p>
                        <span>主讲人</span><s v-for="(val,index) in val.speakerlist">{{val.uname}}&emsp;</s>
                    </p>
                    <p>
                        <span>活动地点</span>{{val.place}}
                    </p>
                    <s class="icon-delete" @click.stop="updatestatus(val.id)" v-if="val.delflag == 1 && val.status == 0" ></s>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
    import methods from '../../methods';
    import { mapState, mapActions } from 'vuex'
    export default {
        name: "actionplan",
        data () {
            return {

            }
        },
        props:{
            dataList:{
                type:Array,
                default: function () {
                    return []
                }
            },
            ishistory:{
                type:Boolean,
                default:false
            }
        },
        watch:{

        },
        filters: {

        },
        computed:{

        },
        mounted () {

        },
        methods:{
            ...methods,
            ...mapActions([
                'showConfirm',
                'toast'
            ]),

            computeColor(val){
                if(val.status==0){
                    return '#f99e1c';
                }else if(val.status==1){
                    return '#20db9a';
                }else if(val.status==2){
                    return '#d3dce6';
                }
            },
            todetail(id){
                let self = this;
                this.$router.push({
                    name: 'fdAction_detail',
                    query: {
                        id:id,
                        ishistory:self.ishistory
                    }
                })
            },
            updatestatus(param){
                let self = this;
                this.showConfirm({
                    title: '温馨提示',
                    msg: '您是否要删除当前教学活动计划？',
                    theme: 'modal-confirm modal-white',
                    cancel: function () {},
                    ok: function () {
                        self.post('/actionplan/delactionplanbyid',{
                            command: 'actionplan/delactionplanbyid',
                            sessionid:$.cookie('sid'),
                            loginid:$.cookie('uid'),
                            id:param,
                        }).done((data)=>{
                            if(data&&data.errcode ==0){
                                self.toast('删除成功~');
                                self.$emit('confirm','');//传给父组件
                            }
                        });
                    },
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .place-p {
        white-space: pre-wrap;  
        word-wrap: break-word;    
    }
    #plan {
        padding: .1rem .3rem;
        ul {
            padding-left:0.3rem;
            border-left:1px solid #aaa;
            li {
                color: #666;
                padding-bottom:0.3rem;
                position: relative;
            }
            i.icon {
                display: inline-block;
                content:'';
                width:0.35rem;
                height:0.35rem;
                border:0.07rem solid;
                position:absolute;
                border-radius: 50%;
                left: -0.475rem;
                background:#fff;
            }
        }
    }

    i {
        font-style: normal;
    }

    s {
        text-decoration: none;
    }

    s.icon-delete {
        display: inline-block;
        width: 0.5rem;
        height: 0.5rem;
        background: url('../../assets/images/icon-delete.png') 0 0 no-repeat;
        background-size: 100% 100%;
        position: absolute;
        bottom: 0.3rem;
        right: 0.2rem;
    }

    .tap-content {
        background: #fff;
        border-radius: 5px;
        box-shadow: -0.003rem 0.003rem 0.01rem #777;
        padding: 0.3rem 0.2rem;
        color: #666;
        font-size: 0.25rem;
        font-family: 'Microsoft YaHei';
        position: relative;
        i {
            display:inline-block;
            background:url('../../assets/images/pag.png') 0 0 no-repeat;
            background-size:100% 100%;
            padding:0.05rem 0.1rem;
            font-style: normal;
            color:#fff;
            font-size:0.25rem;
            position:absolute;
            top:-0.1rem;
            right:0.15rem;
        }
        span {
            width:1rem;
            text-align:justify;
            text-align-last:justify;
            margin-right:0.2rem;
        }
        span:after {
            content:':';
            width:0;
            height:0;
            margin-left: 0.1rem;
            position:absolute;
        }
        p {
            padding:0.06rem 0;
            margin: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
</style>
