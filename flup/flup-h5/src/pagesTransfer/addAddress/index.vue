<template>
    <div class="addAddress">
        <van-form @submit="onSubmit" error-message-align="right" ref="vantForm">
            <div @click.stop.prevent="inputPaentClick('name')">
                <van-field
                    v-model.trim="name"
                    name="name"
                    label="收货人"
                    placeholder="请输入"
                    input-align="right"
                    :rules="[{ required: true, message: '请输入收货人', trigger:'onChange'}]"
                    class="field"
                    ref="name"
                />
            </div>
            <div @click.stop.prevent="inputPaentClick('phone')">
                <van-field
                    v-model.trim="phone"
                    name="phone"
                    label="手机号码"
                    placeholder="请输入"
                    input-align="right"
                    :rules="[{ required: true, message: '请输入手机号码', trigger:'onChange'},{ validator:validatorPhone, message: '手机号信息有误',trigger:'onChange' }]"
                    class="field"
                    ref="phone"
                >
                <template #button>
                    <div class="addAddress-dropdown" @click.stop="handRreNum">
                        <span class="addAddress-dropdown__num">{{ preNum }}</span>
                        <img class="img" src="@/assets/images/icon/arrow2.png" alt="">
                    </div>
                </template>
                </van-field>
            </div>
            <div class="area" >
                <van-field
                    v-model.trim="area"
                    name="area"
                    label="所在地区"
                    placeholder="请选择"
                    input-align="right"
                    readonly
                    :rules="[{ required: true, message: '请选择所在地区', trigger:'onChange'}]"
                    class="field"
                    @click.native="jumpMap"
                >
                <template #button>
                    <div class="area-icon">
                        <img src="@/assets/images/icon/fixed.png" alt="">
                    </div>
                </template>
                </van-field>
            </div>
            <div @click.stop.prevent="inputPaentClick('address')">
                <van-field
                    v-model.trim="address"
                    name="address"
                    type="textarea"
                    rows="1"
                    autosize
                    label="详细地址"
                    placeholder="请输入"
                    input-align="right"
                    :rules="[{ required: true, message: '请输入详细地址', trigger:'onChange'}]"
                    class="field"
                    ref="address"
                />
            </div>
            <van-field class="field switch" name="switch" label="设为默认收货地址" label-width="200px" input-align="right" >
                <template #input>
                    <van-switch v-model="switchChecked" size="30px" active-color="#32AE57" :inactive-value="0" :active-value="1"/>
                </template>
            </van-field>
        </van-form>
        <!-- 选择手机号前置 -->
        <van-popup v-model="showPicker" position="bottom">
            <van-picker
                show-toolbar
                :columns="columns"
                @confirm="onConfirm"
                @cancel="showPicker = false"
                ref="preNum"
            />
        </van-popup>
        <div class="addAddress-floor">
            <div class="addAddress-floor__btn" @click="handPut">保存</div>
        </div>
    </div>
</template>
<script>
import { Form  } from 'vant';
export default {
    name:'addAddress',
    components:{
        [Form.name]: Form,
    },
    data(){
        return{
            name:'',//收货人
            phone:'',//手机号码
            area:'',//地区
            address:'',//详细地址
            switchChecked:'0',
            preNum:'+86',//手机号码前置
            showPicker:false,
            columns: ['+86'],
            addressInfo:{},//地图返回详细地址

            addressId:'',//id
        }
    },
    mounted(){
        let data = this.$route.query.data;
        if(data){
            data = JSON.parse(data);
            this.name = data.contactsName;
            this.phone = data.phone;
            this.area = data.district;
            this.switchChecked = data.isDefault;
            this.address = data.addresslocal;
            this.addressId = data.addressId;
            this.addressInfo.location = data.location;
            this.addressInfo.adcode = data.adcode;
        }
    },
    activated(){
        let addressInfo = localStorage.getItem('addressInfo');
        if(addressInfo){
            this.addressInfo = JSON.parse(addressInfo);
            this.area = this.addressInfo.district;
            this.address = this.addressInfo.address + this.addressInfo.name
            localStorage.removeItem('addressInfo');
        }
    },
    methods:{
        //获取输入框焦点
        inputPaentClick(refName) {
            this.$nextTick(() => {
                this.$refs[refName] && this.$refs[refName].focus();
            });
        },
        //手机号校验
        validatorPhone(val){
            let info = this.$utils.checkPhone(val);
            if(!info){
                return false
            }
            return true;
        },
        //选择手机前置
        onConfirm(value) {
            this.preNum = value;
            this.showPicker = false;
        },
        handRreNum(){
            this.showPicker = true
            this.$nextTick(() => {
                this.$refs.preNum.setColumnValue(0, this.preNum)
            })
        },
        //保存
        handPut(){
            this.$refs.vantForm.validate().then(async () =>{
                let params = {
                        phone:this.phone,
                        isDefault:this.switchChecked,
                        contactsName:this.name,
                        addresslocal:this.address,
                        district:this.area,
                        location:this.addressInfo.location,
                        adcode:this.addressInfo.adcode,
                    };
                    if(this.addressId){
                        params.addressId = this.addressId;
                    }
                try{
                    await this.$apis.saveOrEditReceivingInfo(params)
                    this.$router.go(-1);
                }catch(e){
                    this.$toast.fail(e);
                }
            })
        },
        //成功
        onSubmit(){
            console.log('成功')
        },
        //跳转地图
        jumpMap(){
            this.$router.push('/map');
        },
    }
}

</script>
<style lang="scss">
.addAddress{
    .field{
        font-size: 16px;
        padding:15px;
        .van-cell__title{
            color: #333333;
        }
        .van-field__control::placeholder{
            font-weight: normal;
            color: #B2B2B2;
        }
        .van-field__label{
            line-height: 19px;
        }
        .van-field__control{
            color: #111;
            line-height: 19px;
            font-size: 16px;
            font-weight: normal;
        }
        .van-field__button>div{
            display: flex;
            align-items: center;
        }
        .code-btn{
            height: 26px;
            color: #00982D;
            border: 1px solid #32AE57;
        }
        .van-field__error-message{
            position: absolute;
            right: 0px;
            bottom: -18px;
            z-index: 10;
        }
    }
    .switch{
        .van-field__label{
            display: flex;
            align-items: center;
        }
    }
    .van-cell:not(:last-child)::after{
        border-bottom: 0px solid #fff;
    }
    .area{
        .van-field__control:disabled{
            font-size: 16px;
            font-weight: normal;
            color: #111111;
            -webkit-text-fill-color:#111111;
        }
    }
}
</style>
<style lang="scss" scoped>
.addAddress{
        &-dropdown{
            display: flex;
            align-items: center;
            justify-content: flex-end;
            font-size: 16px;
            font-weight: normal;
            letter-spacing: 0.2px;
            color: #111111;
            .img{
                width: 6.3px;
                height:11px;
                margin-left:11px;
            }
            &__num{
                color:#111111;
                font-size: 16px;
                font-weight: normal;
                line-height: 19px;
            }
        }
    .area{
        &-icon{
            display: flex;
            justify-content: center;
            align-items: center;
            img{
                width:13.33px;
                height: 16px;
            }
        }
    }
    &-floor{
        width: 100%;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 100;
        height: 78px;
        padding:8px 14px 0px;
        background: #FFFFFF;
        &__btn{
            width: 100%;
            height: 42px;
            border-radius: 21px;
            background: #32AE57;
            font-size: 16px;
            font-weight: 500;
            line-height: 42px;
            text-align: center;
            color: #FFFFFF;
            &:active{
                opacity: .7;
            }
        }
    }
}
</style>