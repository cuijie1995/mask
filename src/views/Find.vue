<template>
  <div class="find">
    <div class="top">
      <van-nav-bar title="发现" />
    </div>
  </div>
</template>
<script>
export default {
  name: "Find",
  data() {
    return {
      tip: 1
    };
  },
  mounted() {
    localStorage.setItem("isTip", this.tip);
  },
  methods: {}
};
</script>

<style scoped >
</style>