import { createRouter, createWebHashHistory } from "vue-router";
import { watch } from "vue";
import _msg from "@/utils/msg";
import { getUserInfo, getPaths, pushOperateLogs } from "@/services/userInfo";
import { userInfoStore } from "@/stores/userInfo";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/404",
      name: "404",
      component: () => import("../views/error/404.vue"),
    },
    {
      path: "/outpatientServiceLeave",
      name: "outpatientServiceLeave",
      component: () => import("../views/outpatientServiceLeave/index.vue"), //门诊转出列表
    },
    {
      path: "/outpatientServiceTo",
      name: "outpatientServiceTo",
      component: () => import("../views/outpatientServiceTo/index.vue"), //门诊转入列表
    },
    {
      path: "/beinHospitalTo",
      name: "beinHospitalTo",
      component: () => import("../views/beinHospitalTo/index.vue"), //住院转入列表
    },
    {
      path: "/beinHospitalLeave",
      name: "beinHospitalLeave",
      component: () => import("../views/beinHospitalLeave/index.vue"), //住院转出列表
    },
    {
      path: "/patientTransferStatistics",
      name: "patientTransferStatistics",
      component: () => import("../views/patientTransferStatistics/index.vue"), //转诊转入转出统计
    },
    {
      path: "/listDetail",
      name: "listDetail",
      meta: {
        noCheck: true
      },
      component: () => import("../views/listDetail/index.vue"),
    },
    {
      path: "/beInHospital",
      name: "beInHospital",
      meta: {
        noCheck: true
      },
      component: () => import("../views/listDetail/beInHospital.vue"),
    },
    {
      path: "/upLoadH5",
      name: "upLoadH5",
      meta: {
        title: "扫码上传",
      },
      component: () => import("../views/upLoadH5/index.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/404",
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const store = userInfoStore();
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  
  let oldToken = store.token;
  let token = to.query.token;
  if (to.path == "/404") next();
  if (!token && !oldToken && to.path != "/404") {
    next("/404");
  }
  store.setToken(token || store.token);
  if (to.meta.noCheck) {
    await getUserInfo().then((res) => {
      store.setUserInfo(res);
    });
    next()
  }
  if ((token != oldToken || (store.token && store.paths.length == 0)) && to.path != "/404") {
    await getUserInfo().then((res) => {
      store.setUserInfo(res);
    });
    await getPaths({
      modelIds: "678",
    }).then(async (res) => {
      let paths = res.retData.map((item) => {
        let index = item.lastIndexOf("/");
        let index2 = item.lastIndexOf("?");
        if (index > -1 && index2 > -1) {
          return item.slice(index, index2);
        } else {
          return item.slice(index);
        }
      });
      const newPaths = [...paths, "/upLoadH5", "/beInHospital","/listDetail"];
      store.setPaths(newPaths);
      let path = to.path;
      const isBol = newPaths.some((item) => item == path);
      if (!isBol && to.path != "/404" && !to.meta.noCheck) {
        await pushOperateLogs({
          contents: `非法访问：${to.path}`,
          modelId: 680,
          operateName: "权限提升",
          operatorToken: store.token,
        });
        next("/404");
      } else {
        next();
      }
    });
  } else if (to.path != "/404") {
    const paths = store.paths;
    let path = to.path;
    const isBol = paths.some((item) => item == path);
    if (!isBol && to.path != "/404") {
      await pushOperateLogs({
        contents: `非法访问：${to.path}`,
        modelId: 680,
        operateName: "权限提升",
        operatorToken: store.token,
      });
      next("/404");
    } else {
      next();
    }
  }
});
// router.beforeEach((to, from) => {
//   const store = userInfoStore();
//   watch(
//     () => store.token,
//     (newValue, oldValue) => {
//       getUserInfo().then((res) => {
//         store.setUserInfo(res);
//       });
//     }
//   );
//   if(to.meta.title){
//     document.title = to.meta.title
//   }
//   let token = to.query.token || store.token;
//   if (!token) {
//     _msg.toast("token不存在！", "error");
//     return false;
//   }
//   store.setToken(token);

//   return true;
// });


export default router;
