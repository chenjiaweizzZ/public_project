// import $ from 'jquery';

const alertDefault = {
    show: false,
    title: '提示',
    theme: 'modal-alert',
    position: 'center',
    hideOnClickOut: false,
    duration: '.2s'
};

const confirmDefault = {
    show: false,
    title: '请确认',
    theme: 'modal-confirm',
    position: 'center',
    hideOnClickOut: false,
    duration: '.2s',
    okLabel: '确定',
    okTheme: '',
    cancelLabel: '取消',
    cancelTheme: ''
};

const loadingDefault = {
    show: false,
    title: null,
    theme: 'modal-loading',
    position: 'center',
    hideOnClickOut: false,
    duration: '.2s'
};

export default {
    CHANGE_MAIN_MENU(state, mainMenu) {
        state.mainMenu = mainMenu;
    },
    CHANGE_MENU_HIDE(state, menuHide) {
        state.menuHide = menuHide;
    },
    INCREASE_MAX_ZINDEX(state){
        return ++state.maxZIndex;
    },
    // SHOW_ALERT(state, param) {
    //     state.alert = $.extend(true, {}, alertDefault, {
    //         show: true,
    //         msg: param.msg,
    //         title: param.title === false ? null :  param.title,
    //         ok: param.ok
    //     });
    // },
    // HIDE_ALERT(state) {
    //     state.alert = $.extend(true, {}, alertDefault);
    // },
    // SHOW_CONFIRM(state, param) {
    //     state.confirm = $.extend(true, {}, confirmDefault, param, {
    //         show: true
    //     });
    // },
    // HIDE_CONFIRM(state) {
    //     state.confirm = $.extend(true, {}, confirmDefault);
    // },
    // SHOW_LOADING(state, param) {

    //     if(typeof param === 'string') {
    //         param = {
    //             msg: param
    //         };
    //     }
    //     state.loading = $.extend(true, loadingDefault, {
    //         show: true,
    //         msg: param.msg,
    //         html: param.html
    //     });
    // },
    HIDE_LOADING(state) {
        state.loading.show = false;
    },
    SHOW_TOAST(state, param) {
        state.toast = {
            show: true,
            msg: param.msg,
            timeout: param.timeout || 1500,
            mask: param.mask,
            duration: param.duration
        }
    },
    HIDE_TOAST(state) {
        state.toast.show = false;
    },
    CHANGE_ACTIONFILTERS(state,{key,value}){
        state.actionfilters[key] = value;
    },
    CHANGE_TURNINFO(state,{key,value}){
        state.turninfo[key] = value;
    },
    CHANGE_SYSTYPE(state,param){
        state.systype = param;
    },
    CHANGE_SINGINDEPT(state,param){
        state.singindept = param;
    },
    CHANGE_TATISTICAL(state,{key,value}){
        state.tatistcal[key] = value;
    },
    CHANGE_TURNSTATUS(state,value){
       state.turnstatus = value;
    },
    CHANGE_MENUTYPE(state,value){
      state.menutype = value;
    },

    // 轮转手册
    CHANGE_TURNMANUAL(state, {key,value}) {
        state.turnManual[key] = value;
    }
}
