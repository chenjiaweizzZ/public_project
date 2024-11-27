<template>
    <div class="invoicing-questions">
        <span class="invoicing-questions-title">
            <span>常见疑问</span>
        </span>
        <div class="invoicing-questions-title2">1.如何获取发票?</div>
        <div class="invoicing-questions-content">我们仅提供电子发票。电子发票与纸质发票具有同等效力,我们会将开具好的发票发送至您的邮箱。</div>
        <div class="invoicing-questions-title2">2.开票时间?</div>
        <div class="invoicing-questions-content">我们将在15个工作日内向您的邮箱发送电子发票。</div>
        <div class="invoicing-questions-title2">3.开票信息如填写错误，请联系您的个案管理师修改。</div>
    </div>
</template>

<style lang="scss" scoped>
.invoicing-questions {
    padding: 10px 12px;
    margin: 10px 11px;
    background-color: #FFF;

    &-title {
        font-size: 17px;
        font-weight: 600;
        line-height: 22px;
        height: 22px;
        letter-spacing: 0.2px;
        font-variation-settings: "opsz" auto;
        color: #111111;
        position: relative;
        display: inline-block;
        margin-bottom: 15px;
        span {
            position: relative;
            z-index: 2;
        }

        &::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 6px;
            background: linear-gradient(270deg, #FCD539 0%, #FFE1BA 100%);
            z-index: 0;
        }
    }

    &-title2 {
        font-size: 14px;
        font-weight: 500;
        line-height: 19px;
        // height: 19px;
        letter-spacing: 0px;
        font-variation-settings: "opsz" auto;
        color: #111111;
        // margin-bottom: 6px;
    }

    &-content {
        font-size: 14px;
        font-weight: normal;
        line-height: 19px;
        letter-spacing: 0px;
        color: #666666;
        margin-bottom: 16px;
    }
}</style>