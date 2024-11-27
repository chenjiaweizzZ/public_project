<template>
    <div class="chatScript">
        <van-button plain type="primary" @click="show = !show">自动喊话{{ times }}</van-button>
        <van-dialog v-model="show" title="自动喊话1.0" show-cancel-button @confirm="confirm" @cancel="cancel" confirm-button-color="#07c160"
            cancelButtonColor="#f44" confirmButtonText="喊话" cancelButtonText="取消">
            <van-field v-model="consultId" type="text" label="consultId" placeholder="consultId" />
            <van-field v-model="roomId" type="text" label="roomId" placeholder="roomId" />
            <van-field v-model="sendUserId" type="text" label="sendUserId" placeholder="sendUserId" />
            <van-field v-model="sendUserName" type="text" label="sendUserName" placeholder="sendUserName" />
            <van-field v-model="times" type="text" label="喊话次数" placeholder="输入喊话次数" required />
            <van-field v-model="rate" type="text" label="频率(毫秒)" placeholder="输入喊话频率" required />
        </van-dialog>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
export default {
    name: "chatScript",
    data() {
        return {
            show: false,
            times: 0,
            rate: 1000,
            consultId: '',
            roomId: '',
            sendUserId: '',
            sendUserName: '',
            messageList: [
                "你好！",
                "医生，我感觉头晕目眩，是怎么回事？",
                "大概有两三天了。",
                "好的，谢谢医生。",
                "医生，我孩子最近总是咳嗽，怎么办？",
                "请问孩子咳嗽有痰吗？是否有发烧症状？",
                "有点痰，但没有发烧。",
                "明白了，谢谢。",
                "医生，我手臂上突然出现了一个红斑，是什么原因？",
                "好像没有，就是突然出现的。",
                "好的，我会注意的。",
                "是的，工作压力比较大。",
                "好的，我会试试的。",
                "好的，谢谢医生。",
                "医生，我眼睛最近很痒，总是想揉。",
                "我有过敏性鼻炎，但最近没有接触什么特别的物质。",
                "好的，我会去买眼药水的。",
                "医生，我最近胃口不好，吃不下东西。",
                "没有恶心、呕吐，但有时候会有点腹痛。",
                "医生，我最近总是感到疲劳，是什么原因？",
                "睡眠还好，但总是感觉累。",
                "好的，我会去检查的。",
                "明白了，谢谢。",
                "医生，我最近总是感觉胸闷，是不是有什么问题？",
                "您好，我孩子突然发烧了，我该怎么办？",
                "医生，我眼睛红肿，还很痒，是不是过敏了？",
                "我最近胃口特别差，什么都不想吃，是怎么回事？",
                "医生，我喉咙痛了好几天了，吃了药也不见好。",
                "我最近总是头晕，是不是贫血了？",
                "您好，我胳膊上长了一个奇怪的疙瘩，您能帮我看看吗？",
                "医生，我耳朵后面长了个包，一碰就疼。",
                "我最近晚上总是失眠，白天就没精神。",
                "您好，我小腿上突然出现了淤青，我没记得有磕到。",
                "医生，我咳嗽了好久了，痰也很多，需要做什么检查吗？",
                "我最近皮肤变得很干燥，还起皮，怎么办？",
                "您好，我背上长了很多痘痘，是怎么回事？",
                "医生，我鼻子不通气，还流鼻涕，是不是鼻炎犯了？",
                "我最近总是感觉心慌，心跳得很快。",
                "您好，我耳朵嗡嗡响，听力也下降了。",
                "医生，我腿上有个伤口一直好不了，还流脓了。",
                "我最近记忆力变差，经常忘事，是不是老年痴呆了？",
                "您好，我脸上长了很多斑，有什么办法可以去除吗？",
                "医生，我牙齿疼得厉害，可能是智齿发炎了。",
                "我最近总是感觉口渴，喝很多水也没用。",
                "您好，我膝盖疼，走路都不方便了。",
                "医生，我腰特别疼，是不是腰椎间盘突出了？",
                "我最近经常拉肚子，是不是吃坏肚子了？",
                "您好，我皮肤很痒，起了很多小红点。",
                "医生，我眼睛模糊，看不清东西，是不是近视加深了？",
                "我最近总是打喷嚏，流鼻涕，是不是感冒了？",
                "您好，我手指关节疼，有点肿胀。",
                "医生，我喉咙里有异物感，吞咽不舒服。",
                "我最近感觉情绪低落，对什么都不感兴趣。",
                "您好，我皮肤上长了一块块的白斑，是怎么回事？",
                "医生，我脖子上长了个包，摸起来会动。",
                "我最近总是感到疲惫，全身无力。",
                "您好，我头皮屑很多，还掉发严重。",
                "医生，我脚上长了个鸡眼，走路时很疼。",
                "我最近容易出汗，稍微一动就一身汗。",
                "您好，我脸上长了很多痘痘，该怎么办？",
                "医生，我手上突然出现了很多小红点，是不是过敏了？",
                "我最近胃不舒服，总是感觉胀胀的。",
                "您好，我背上有个地方一直疼，不知道是不是肌肉拉伤。",
                "医生，我脚踝扭伤了，肿得很厉害。",
                "我最近总是打喷嚏，但没有感冒的其他症状。",
                "您好，我脸上突然长了个大脓包，该怎么办？",
                "医生，我手指被划破了，需要打破伤风针吗？",
                "我最近总是感觉腿抽筋，是缺钙了吗？",
                "您好，我鼻子上长了个大痘痘，一碰就疼。",
                "医生，我耳朵里面疼，是不是中耳炎？",
                "我最近总是感觉气短，喘不过气来。",
                "您好，我脖子上突然长了个黑痣，是不是皮肤癌？"
            ]
        }
    },
    methods: {
        ...mapMutations('chat', ['UpdateMessageList', 'putMessage', 'restInfo', 'setNextReqMessageID', 'setIsCompleted', 'setIsLogin', 'setIsDisabled', 'setReferralStatus']),
        getRandomItem() {
            const randomIndex = Math.floor(Math.random() * this.messageList.length);
            return this.messageList[randomIndex];
        },
        confirm() {
            // this.handleSendMessage()
            setTimeout(() => {
                if (this.times > 0) {
                    this.times--
                    // this.handleSendMessage(this.getRandomItem())
                    this.handleSendMessage("陈家伟测试" + this.times)
                    this.confirm()
                }
            }, this.rate);
        },
        cancel() {
            this.times = 0
        },
        handleSendMessage(text) {
            console.log(text)
            let that = this;
            let message = this.$chat.createTextMessage({
                to: this.$route.query.roomId,
                conversationType: that.$TencentCloudChat.TYPES.CONV_GROUP,
                payload: {
                    text
                },
                needReadReceipt: true,
            });
            that.putMessage(message);
            // 2. 发送消息
            let promise = this.$chat.sendMessage(message);
            promise
                .then(async function () {
                    console.log('发送成功');
                    // that.$emit("sendMessage");
                    if (that.$route.query.preSales == 1) {
                        await that.$apis.personalSendMessageCallback({
                            consultId: that.$route.query.consultId,
                            message: text,
                            sendUserId: that.$route.query.patientId,
                            sendUserName: that.$route.query.patientName,
                        })
                    } else {
                        await that.$apis.sendMessageCallback({
                            consultId: that.$route.query.consultId,
                            message: text,
                            sendUserId: that.$route.query.patientId,
                            sendUserName: that.$route.query.patientName,
                        })
                    }
                })
                .catch(function (imError) {
                    console.warn("sendMessage error:", imError);
                });
        },
    }
}
</script>

<style scoped>
.chatScript {
    position: fixed;
    right: 0px;
    bottom: 250px;
    z-index: 999;
}
</style>