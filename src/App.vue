<template>
  <div id="app">
    <!-- <div v-if="show" style="width:100%;height:100%">
      <img src="./assets/首页.jpg" style="width:100%;height:100%" />
    </div>-->

    <!-- <div v-else style="width:100%;height:100%"> -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlivee"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      isRouterAlive: true
    };
  },
  mounted() {},
  methods: {}
};
</script>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
  background: #f1f1f1;
}

body {
  margin: 0;
}

/* a {
  color: #000000;
} */

#app {
  /* font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif; */
  /* font-family: "Avenir", Helvetica, Arial, sans-serif; */
  /* -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; */
  color: #2c3e50;
}

input::-webkit-input-placeholder {
  color: #c0c4cc;
}

input::-moz-input-placeholder {
  color: #c0c4cc;
}

input::-ms-input-placeholder {
  color: #c0c4cc;
}
.el-message {
  top: 200px !important;
}
.van-popup--top {
  top: 200px !important;
}
</style>