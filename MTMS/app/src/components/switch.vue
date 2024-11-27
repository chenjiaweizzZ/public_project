<template>
    <div class="dataPicker">
        <ul>
            <li><img src="../assets/images/zuo-jiantou.png"></li>
            <li>
                <slot name="content"></slot>
            </li>
            <li><img src="../assets/images/bnt_xiangyou.png"></li>
        </ul>
    </div>
</template>

<script>
  export default {
    name: 'cswitch'
  }
</script>

<style scoped lang="scss">
    @import '../scss/mixin.scss';
    .dataPicker {
        ul {
            height: 0.6rem;
            border-bottom: 1px solid $borderColor;
            @include sexy-flex;
            background: #fff;

            li {
                @include flex1(1);
                text-align: left;
                line-height: 0.6rem;
                padding-left: 0.1rem;
                img {
                    width: $arrowWidth;
                    height: $arrowHeight;
                    margin-top: 0.12rem;
                }
            }
            li:nth-child(2) {
                text-align: center;
                @include flex1(2);
            }
            li:nth-child(3) {
                text-align: right;
                padding-right: 0.1rem;
            }
        }

    }
</style>
