<template>
  <div class="side">
    <div class="search">
      筛选
      <div class="footer">
        <el-button size="mini" @click="setValue"> 重置</el-button>
        <el-button type="primary" size="mini">确认</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import bus from "../bus";
export default {
  data() {
    return {
      isShow:false
    };
  },
  methods: {
    setValue() {
      this.isShow = false;
      this.$emit("returnValue", this.isShow);
    }
  }
};
</script>

<style scoped>
.side {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10;
}
.search {
  width: 80%;
  background: #ffffff;
  height: 100%;
}
.footer{
  position: absolute;
  bottom: 50px;
  left:70px;
}
</style>
