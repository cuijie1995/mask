<template>
  <div class="big_image">
    <!-- 过渡动画 -->
    <transition name="fade">
      <div class="img-view">
        <div>
          <i class="el-icon-close" @click="bigImg"></i>
        </div>
        <!-- 遮罩层 -->
        <div class="img-layer"></div>
        <div class="img">
          <!-- <img :src="imgSrc" /> -->
          这是关注的内容
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  props: ["imgSrc"], //接受图片地址
  methods: {
    // bigImg() {
    //   // 发送事件
    //   this.$emit("clickit");
    // }
  }
};
</script>


<style scoped>
/* .big_image{
    width: 100%;
    height: 100%;
} */
/* 　　动画 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s linear;
  transform: translate(0, 0, 0);
}
.fade-enter,
.fade-leave-active {
  transform: translate3D(100%, 0, 0);
}
/* 　　bigimg/ */
.img-view {
  position: inherit;
  width: 100%;
  height: 100%;
}
/* 　　遮罩层样式 */
.img-view .img-layer {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.img {
  height: 100%;
  /* position: relative;
    overflow: hidden; */
}
/* 　　不限制图片大小，实现居中 */
.img-view .img img {
  max-width: 100%;
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  top: 60px;
  margin: auto;
  z-index: 1000;
}
i {
  color: #ffffff;
  font-size: 30px;
  position: absolute;
  right: 10px;
  top: 10px;
  /* right: 0; */
  z-index: 1000;
}
</style>