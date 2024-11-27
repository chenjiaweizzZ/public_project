import store from '../store'
import { mapState, mapActions } from 'vuex';
import { getStorage, removeStorage, removeCookie, setStorage } from '../config/util'

function clearAll() {
    removeCookie("uid");
    removeCookie("sid");
    removeCookie("name");
    removeStorage('currentMenu');
}

export default function (router) {
    router.beforeEach((to, from, next) => {
        let vueInstance = router.app;
        let myAlert = (msg) => {
            if (vueInstance.$message) {
                vueInstance.$message({
                    showClose: true,
                    message: msg,
                    type: 'warning',
                });
            } else {
                alert(msg);
            }
        };
        let menu = 'currentMenu';
        let path = to.path.indexOf('/circlePlanDetail') > -1 ? '/circlePlan' : to.path;
        let flag = false;

        let toPath = to.path;
        store.dispatch('checkToken')
        store.commit('initSystemType', { num: 3 });
        // //刷新页面时，默认为住陪系统，识别到ug时，转换系统
        // if (toPath.indexOf('UG') > -1 && toPath.lastIndexOf('UG') === toPath.length - 2) {
        //     store.commit('initSystemType', {num: 1});
        // }else if(toPath.indexOf('/index')===-1){
        //     //除此之外且不是index页面的，就认为是住陪系统
        //     store.commit('initSystemType', {num: 0});
        // }
        let sys_msg = '您当前账号尚未分配系统功能操作，请联系管理员。';
        if (to.path.indexOf('login') > -1) {
            removeStorage('loginType');
            next();//两种login登陆页,切换识别只能在login页面，
        } else {
            console.log(to.path)
            next();
            //当无法在单元列表中找到路由时
            // store.dispatch('initMenuList').then(() => {
            //     store.state.menuList.forEach((item) => {
            //             if (item.url.indexOf(path) > -1) {
            //                 flag = true;
            //             } else if (item.cldlist.map(val => {
            //                     val.url.indexOf(path) > -1
            //                 })) {
            //                 flag = true;
            //             }
            //         }
            //     );
            //     //读取当前系统参数，确定是哪个系统的
            //     let sysType = store.state.systemType;//0住陪，1实习生
            //     let loginType = store.state.loginType;
            //     let txtContent = sysType === 0 ? '住陪医师管理系统' : '实习综合智能管理系统';
            //     // if (!flag && to.path !== '/index') {
            //     //     clearAll();
            //     //     myAlert('当前系统类别：' + txtContent);
            //     //     //重定向登录
            //     //     next({name: loginType});
            //     // } else
            //     if (
            //     //  原系统判别
            //     //    sysType === 0 && loginType === 'Login' && (to.path.indexOf('UG') === -1
            //     //    || to.path.indexOf('/index') === 0)
            //     //    || sysType === 1 && loginType === 'LoginUG' && (to.path.indexOf('UG') > -1
            //     //    || to.path.indexOf('/index') === 0)
            //     //修改后增加了小写的ug判别；但是点击的时侯会跳转到住院医登录页；此问题未解决实习生系统命名任需带大写UG
            //         sysType === 0 && loginType === 'Login' && (to.path.indexOf('UG') === -1
            //             || to.path.indexOf('ug') === -1 || to.path.indexOf('/index') === 0)
            //             || sysType === 1 && (loginType === 'LoginUG'
            //             || loginType === 'Loginug') && (to.path.indexOf('UG') > -1
            //             || to.path.indexOf('ug') > -1 ||to.path.indexOf('/index') === 0)
            // ) {
            //         if (to.path === '/index') {
            //             let menuList = store.state.menuList;
            //             let url = menuList.length > 0 ? menuList[0].url : null;
            //             let sys_type=menuList.length > 0 ? menuList[0].moduleid:null;
            //             let storage_type=getStorage('loginType');
            //             if(url){
            //                 //系统类别必须一一对应，否者就返回对应的系统去，以前端为准
            //                 // 'turn'住陪   'trainee'实习生
            //                 let type=storage_type?storage_type:loginType;
            //                 if((sys_type==='turn' && type==='Login') || (sys_type==='trainee' && type === 'LoginUG')){
            //                     let path=getStorage(menu)?getStorage(menu):url;
            //                     next({path: path});
            //                 }else{
            //                     clearAll();
            //                     next({name:type});
            //                 }
            //             }else{
            //                 //菜单第一项都没有数据！证明没有配置菜单
            //                 myAlert(sys_msg);
            //                 // next({name:loginType});
            //                 let type=getStorage('loginType');
            //                 if(type && from.path.indexOf('/login')===-1){
            //                     clearAll();
            //                     next({name:type});
            //                 }else if(!type){
            //                     setStorage('loginType',loginType);
            //                     next();
            //                 }else{
            //                     //来自login
            //                     //console.log('来自login:',type)
            //                 }
            //             }
            //         } else if (to.matched.length === 0) {   //如果未匹配到路由
            //             let message = '警告!页面跳转失败，页面不存在！';
            //             myAlert(message);
            //             localStorage.removeItem('currentMenu');
            //             //如果上级也未匹配到路由则跳转登录页面，如果上级能匹配到则转上级路由
            //             if (from.name) {
            //                 // //console.log(222);
            //                 next({name: from.name})
            //             } else {
            //                 // //console.log(3333);
            //                 clearAll();
            //                 myAlert('当前系统类别：' + txtContent);
            //                 //重定向登录
            //                 next({name: loginType});
            //             }
            //             // from.name ? next({ name:from.name }) : next('/');
            //         } else {
            //             next();
            //         }
            //     }
            //     else {
            //         // //console.log(444)
            //         clearAll();
            //         myAlert('当前系统类别：' + txtContent);
            //         //重定向登录
            //         next({name: loginType});
            //     }
            // });
        }
    })

}
