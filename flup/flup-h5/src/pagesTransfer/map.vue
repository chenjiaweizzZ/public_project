<template>
    <amapChoose :color="color" :keyMap="keyMap" :show="show" :securityJsCode="securityJsCode" :initLocation="initLocation" @placeChoose="placeChoose" @changeShow="changeShow"></amapChoose>
</template>
<script>
import amapChoose from "@/components/amapChoose.vue";
export default{
    components:{
        amapChoose
    },
    data(){
        return{
            color:'#E8F6EC',//主题颜色
            keyMap:'a129d3e88175009e30fa3de70a10cac6',//高德地图webjs的key
            securityJsCode:'cf64e1211e97399d955b53039d8007e2',//高德地图密钥
            show:true,//是否显示组件
            initLocation:'',//地址
        }
    },
    methods:{
        //获取地图信息
        placeChoose(data){
            console.log('地图信息',data)
            localStorage.setItem('addressInfo',JSON.stringify(data));
            this.$router.go(-1)
        },

        //是否显示组件
        changeShow(val){
            this.show = val;
        }
    }
}
</script>
<style lang="scss" scoped></style>