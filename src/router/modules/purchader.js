const purchaderRouter =
    [
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
    ]



export default purchaderRouter;
