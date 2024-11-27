<template>
    <c-modal :config="confirm">
        <template v-if="!confirm.title">
            <template slot="header"></template>
        </template>
        {{confirm.msg}}
        <template slot="buttons">
            <button type="button"
                    class="btn"
                    :class="confirm.cancelTheme"
                    @click.stop="cancel()"> {{confirm.cancelLabel}} </button>
            <button type="button"
                    class="btn blue"
                    :class="confirm.okTheme"
                    @click.stop="ok()"> {{confirm.okLabel}} </button>
        </template>
    </c-modal>
</template>
<style></style>
<script>

  import { mapState, mapActions } from 'vuex';
  import cModal from './modal.vue';

  export default {

      data(){
         return {
          zIndex: 0
         };
      },
      components: {
          cModal
      },
    computed: mapState([
      'confirm',
      'maxZIndex'
    ]),
    methods: {
      ...mapActions([
        'hideConfirm',
        'increaseZIndex'
      ]),
      ok: function(){
        this.confirm && this.confirm.ok && this.confirm.ok();
        this._cancel();
      },
      _cancel: function() {
        this.confirm.show = false;
        this.hideConfirm();
      },
      cancel: function() {
          this.confirm && this.confirm.cancel && this.confirm.cancel();
          this._cancel();
      },
    },
    watch: {
      'confirm.show': function(val, oldVal){
        if(val === true) {
          this.zIndex = this.maxZIndex;
          this.increaseZIndex();
        }
      }
    }
  }
</script>
