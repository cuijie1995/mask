<template>
  <div class="tabbar">
    <router-link
      class="tab-item"
      v-for="(item,index) in data"
      :key="index"
      :to="item.path"
      active-class="is-selected"
    >
      <div class="tab-item-icon">
        <i :class="'iconfont '+item.icon"></i>
      </div>

      <div class="tab-item-label">{{item.title}}</div>
    </router-link>
  </div>
</template>
<script>
export default {
  name: "tabbar",
  props: {
    data: Array
  }
};
</script>
<style scoped>
.tabbar {
  height: 65px;
  box-sizing: border-box;
  width: 100%;
  position: fixed;
  bottom: 0;
  background-color: #ffffff;
  display: flex;
  text-align: center;
}

.tab-item {
  display: block;
  padding: 7px 0;
  flex: 1;
}

.tab-item-icon {
  width: 24px;
  height: 24px;
  margin: 0 auto 5px;
}

.tab-item-icon i {
  font-size: 1.4rem;
}

.tab-item-label {
  color: inherit;
  font-size: 14px;
  line-height: 1;
}

a {
  text-decoration: none;
  color: #888;
}

.is-selected {
  color: #07c160;
}
</style>