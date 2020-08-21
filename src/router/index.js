import Vue from 'vue'
import Router from 'vue-router'
import Index from "../views/index"
// import {  } from "./modules/supplier";


Vue.use(Router)

const router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/release',
      component: Index,
      children: [
        {
          path: '/release',
          name: 'Release',
          // meta: { keepAlive: true },
          component: () => import('@/views/Release.vue'),
        },
        {
          path: '/reach',
          name: 'Reach',
          component: () => import('@/views/Reach.vue'),
        },
        {
          path: '/find',
          name: 'Find',
          component: () => import('@/views/Find.vue'),
        },
        {
          path: '/me',
          name: 'Me',
          component: () => import('@/views/Me.vue')
        },
      ]
    },
    {
      path: '/need',
      name: 'Need',
      component: () => import('@/views/My/purchaser/need.vue')
    },
    {
      path: '/biddingListPurchaser',
      name: 'biddingListPurchaser',
      component: () => import('@/views/My/purchaser/baojia/biddingList.vue')
    },
    {
      path: '/biddingListSupplier',
      name: 'biddingListSupplier',
      component: () => import('@/views/My/supplier/baojia/biddingList.vue')
    },
    {
      path: '/orderPaid',
      name: 'OrderPaid',
      component: () => import('@/views/My/purchaser/orderPaid.vue')
    },
    {
      path: '/orderReached',
      name: 'OrderReached',
      component: () => import('@/views/My/purchaser/orderReached.vue')
    },
    {
      path: '/purchaserFinishedOrder',
      name: 'PurchaserFinishedOrder',
      component: () => import('@/views/My/purchaser/PurchaserFinishedOrder.vue')
    },
    {
      path: '/supplyList',
      name: 'SupplyList',
      component: () => import('@/views/My/supplier/supplyList.vue')
    },
    {
      path: '/orderDelivered',
      name: 'OrderDelivered',
      component: () => import('@/views/My/supplier/orderDelivered.vue')
    },

    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login/Login.vue')
    },
    {
      path: '/changePwd',
      name: 'changePwd',
      component: () => import('@/views/Login/changePwd.vue')
    },
    {
      path: '/purchaserHeader',
      name: 'PurchaserHeader',
      component: () => import('@/views/Register/Purchaser/loginHeader.vue')
    },
    {
      path: '/purchaser',
      name: 'Purchaser',
      component: () => import('@/views/Register/Purchaser/Purchaser.vue')
    },
    {
      path: '/supplierHeader',
      name: 'SupplierHeader',
      component: () => import('@/views/Register/Supplier/loginHeader.vue')
    },
    {
      path: '/supplier',
      name: 'Supplier',
      component: () => import('@/views/Register/Supplier/Supplier.vue')
    },
    {
      path: '/addRelease',
      name: 'addRelease',
      component: () => import('@/views/Release/addRelease.vue')
    },
    {
      path: '/viewRelese',
      name: 'viewRelese',
      component: () => import('@/views/Release/viewRelease.vue')
    },

    {
      path: '/robViewRelease',
      name: 'robViewRelease',
      component: () => import('@/views/Release/robViewRelease.vue')
    },
    {
      path: '/supViewRelease',
      name: 'supViewRelease',
      component: () => import('@/views/Release/supViewRelease.vue')
    },
    {
      path: '/addReach',
      name: 'AddReach',
      component: () => import('@/views/Reach/addReach.vue')
    },
    // 供应商待支付
    {
      path: '/quetionPaid',
      name: 'QuetionPaid',
      component: () => import('@/views/My/supplier/QuetionPaid.vue')
    },
    {
      path: '/orderReached',
      name: 'orderReached',
      component: () => import('@/views/My/purchaser/orderReached.vue')
    },
    {
      path: '/orderReceived',
      name: 'orderReceived',
      component: () => import('@/views/My/purchaser/orderReceived.vue')
    },

    {
      path: '/noOfferPurchaser',
      name: 'noOfferPurchaser',
      component: () => import('@/views/My/purchaser/baojia/noOffer.vue')
    },
    {
      path: '/quotedPricePurchaser',
      name: 'quotedPricePurchaser',
      component: () => import('@/views/My/purchaser/baojia/quotedPrice.vue')
    },

    {
      path: '/addSupplierBidding',
      name: 'addSupplierBidding',
      component: () => import('@/views/My/supplier/baojia/addBidding.vue')
    },

    {
      path: '/viewPurchaser',
      name: 'ViewPurchaser',
      component: () => import('@/views/Register/Purchaser/viewPurchaser.vue')
    },
    {
      path: '/updatePurchaser',
      name: 'updatePurchaser',
      component: () => import('@/views/Register/Purchaser/updatePurchaser.vue')
    },

    {
      path: '/viewSupplier',
      name: 'ViewSupplier',
      component: () => import('@/views/Register/Supplier/viewSupplier.vue')
    },
    {
      path: '/updateSupplier',
      name: 'updateSupplier',
      component: () => import('@/views/Register/Supplier/updateSupplier.vue')
    },
    {
      path: '/showSupplier',
      name: 'showSupplier',
      component: () => import('@/views/My/purchaser/baojia/showSupplier.vue')
    },
    {
      path: '/supplierJournal',
      name: 'supplierJournal',
      component: () => import('@/views/My/supplier/supplierJournal.vue')
    },
    {
      path: '/purchaserJournal',
      name: 'purchaserJournal',
      component: () => import('@/views/My/purchaser/purchaserJournal.vue')
    },
    {
      path: '/orderViewReach',
      name: 'orderViewReach',
      component: () => import('@/views/Reach/orderViewReach.vue')
    },
    {
      path: '/viewReach',
      name: 'viewReach',
      component: () => import('@/views/Reach/viewReach.vue')
    },
    
    {
      path: '/recordReach',
      name: 'recordReach',
      component: () => import('@/views/Reach/recordReach.vue')
    },
    {
      path: '/noReach',
      name: 'noReach',
      component: () => import('@/views/My/supplier/noReach.vue')
    },
    {
      path: '/noConfirmed',
      name: 'noConfirmed',
      component: () => import('@/views/My/supplier/noConfirmed.vue')
    },
    {
      path: '/reachPurpose',
      name: 'reachPurpose',
      component: () => import('@/views/My/supplier/reachPurpose.vue')
    },



    {
      path: '/myOrder',
      name: 'myOrder',
      component: () => import('@/views/My/purchaser/myOrder.vue')
    },
    {
      path: '/noSubmit',
      name: 'noSubmit',
      component: () => import('@/views/My/purchaser/noSubmit.vue')
    },
    
    {
      path: '/intentionReached',
      name: 'intentionReached',
      component: () => import('@/views/My/purchaser/intentionReached.vue')
    },
    {
      path: '/showPurchaser',
      name: 'showPurchaser',
      component: () => import('@/views/Reach/showPurchaser.vue')
    },
    {
      path: '/showsSupplier',
      name: 'showsSupplier',
      component: () => import('@/views/Reach/showsSupplier.vue')
    },

    

  ],
  // scrollBehavior(to, from, savedPosition) {
  //   if (savedPosition) {
  //     return savedPosition
  //   } else {
  //     if (from.meta.keepAlive) {
  //       let scrollTop = localStorage.getItem("scrollTop")
  //       from.meta.savedPosition = parseInt(scrollTop) + 200;
  //     }
  //     return { x: 0, y: to.meta.savedPosition || 0 }
  //   }
  // }


})



// router.beforeEach((to, from, next) => {
//   const isLogin = localStorage.token ? true : false;
//   if (to.path == '/login') {
//     next()
//   } else {
//     isLogin ? next() : next('/login')
//   }
//   if (to.name == 'NoPayment' && from.name == 'WorkBench') {
//     to.meta.keepAlive = false
//   }
//   if (to.name == 'NoPayment' && from.name == 'NoProcess') {
//     to.meta.keepAlive = true
//   }
//   if (to.name == 'NoPayment' && from.name == 'NoPay') {
//     to.meta.keepAlive = true
//   }
//   if (to.name == 'NoPayment' && from.name == 'NoExamine') {
//     to.meta.keepAlive = false
//   }

//   if (to.name == 'DoPayment' && from.name == 'WorkBench') {
//     to.meta.keepAlive = false
//   }
//   if (to.name == 'DoPayment' && from.name == 'DoProcess') {
//     to.meta.keepAlive = true
//   }
//   if (to.name == 'DoPayment' && from.name == 'DoPay') {
//     to.meta.keepAlive = true
//   }
//   if (to.name == 'Customer' && from.name == 'WorkBench') {
//     to.meta.keepAlive = false
//   }
//   if (to.name == 'Customer' && from.name == 'Visit') {
//     to.meta.keepAlive = true
//   }
//   if (to.name == 'Customer' && from.name == 'ContactInformation') {
//     to.meta.keepAlive = true
//   }
//   if (to.name == 'Customer' && from.name == 'ContactRecord') {
//     to.meta.keepAlive = true
//   }
//   if (to.name == 'OrderInquiry' && from.name == 'WorkBench') {
//     to.meta.keepAlive = false
//   }
//   if (to.name == 'OrderInquiry' && from.name == 'OrderDetail') {
//     to.meta.keepAlive = true
//   }

// })




export default router;