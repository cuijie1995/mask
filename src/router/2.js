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
      path: '/testOrderPaid',
      name: 'testOrderPaid',
      component: () => import('@/views/My/purchaser/testOrderPaid.vue')
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
      path: '/myOrder',
      name: 'MyOrder',
      component: () => import('@/views/My/supplier/myOrder.vue')
    },
    {
      path: '/orderDelivered',
      name: 'OrderDelivered',
      component: () => import('@/views/My/supplier/orderDelivered.vue')
    },
    {
      path: '/orderNoConfirmed',
      name: 'orderNoConfirmed',
      component: () => import('@/views/My/supplier/orderNoConfirmed.vue')
    },
    {
      path: '/supplierFinishedOrder',
      name: 'supplierFinishedOrder',
      component: () => import('@/views/My/supplier/supplierFinishedOrder.vue')
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



  ],
  
})

export default router;