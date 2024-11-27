<template>
    <div class="qrcodejs" :ref="'qrcodejs' + randomNumber"></div>
</template>
<script>

import QRCode from 'qrcodejs2'
export default{
    props:{
        text:{
            type:String,
            default:''
        }
    },
    data(){
        return {
            randomNumber:'',
        }
    },
    created(){
        this.randomNumber = Math.floor(Math.random() * 100000);
    },
    mounted(){
        this.creatQrCode();
    },
    methods:{
        creatQrCode() {
            console.log("texxxxx",this.text)
            let val = 'qrcodejs' + this.randomNumber;
            let width = this.$refs[val].offsetWidth;
            let height = this.$refs[val].offsetHeight;
            new QRCode(this.$refs[val], {
                text: this.text,
                width: width,
                height: height,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.qrcodejs{
    width: 100%;
    height: 100%;
}
</style>