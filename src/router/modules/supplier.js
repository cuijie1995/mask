
export default function (router) {
    router.push({
        path: '/biddingListSupplier',
        name: 'biddingListSupplier',
        component: () => import('@/views/My/supplier/baojia/biddingList.vue')
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
            path: '/supplierFinishedOrder',
            name: 'supplierFinishedOrder',
            component: () => import('@/views/My/supplier/supplierFinishedOrder.vue')
        })
}



// const supplierRouter =
//     [
//         {
//             path: '/biddingListSupplier',
//             name: 'biddingListSupplier',
//             component: () => import('@/views/My/supplier/baojia/biddingList.vue')
//         },
//         {
//             path: '/supplyList',
//             name: 'SupplyList',
//             component: () => import('@/views/My/supplier/supplyList.vue')
//         },
//         {
//             path: '/myOrder',
//             name: 'MyOrder',
//             component: () => import('@/views/My/supplier/myOrder.vue')
//         },
//         {
//             path: '/orderDelivered',
//             name: 'OrderDelivered',
//             component: () => import('@/views/My/supplier/orderDelivered.vue')
//         },
//         {
//             path: '/supplierFinishedOrder',
//             name: 'supplierFinishedOrder',
//             component: () => import('@/views/My/supplier/supplierFinishedOrder.vue')
//         },
//     ]



// export default supplierRouter;
