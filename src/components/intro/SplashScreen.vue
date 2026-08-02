<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="splash-screen"
      role="dialog"
      aria-modal="true"
      aria-label="开屏"
    >
      <img
          class="icon-deco-1"
          src="@/assets/images/gif/1.svg"
          alt=""
      />
      <img
          class="icon-deco-2"
          src="@/assets/images/gif/2.svg"
          alt=""
      />
      <img
          class="icon-deco-3"
          src="@/assets/images/gif/3.svg"
          alt=""
      />

      <img
          class="icon-deco-4"
          src="@/assets/images/gif/3.svg"
          alt=""
      />
      <img
          class="icon-deco-5"
          src="@/assets/images/gif/2.svg"
          alt=""
      />
      <img
          class="icon-deco-6"
          src="@/assets/images/gif/1.svg"
          alt=""
      />

      <img src="@/assets/images/gif/4.svg" alt="" class="icon-logo">
      <img src="@/assets/images/gif/5.svg" alt="" class="icon-footer">
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const DURATION_MS = 300000

const visible = ref(true)
let closeTimer = null

onMounted(() => {
  closeTimer = window.setTimeout(() => {
    visible.value = false
    closeTimer = null
  }, DURATION_MS)
})

onBeforeUnmount(() => {
  if (closeTimer !== null) {
    window.clearTimeout(closeTimer)
  }
})
</script>

<style lang="scss" scoped>
.splash-screen {
  position: fixed;
  inset: 0;
  z-index: 10001;
  width: 100vw;
  height: 100vh;
  background: #7b00ff;
  .icon-deco-1 {
    position: absolute;
    left: 0;
    top: 20px;
    width: 680px;
  }
  .icon-deco-2 {
    position: absolute;
    left: 382px;
    top: 220px;
    width: 410px;
  }
  .icon-deco-3 {
    position: absolute;
    left: 646px;
    top: 310px;
    width: 290px;
  }
  .icon-deco-4 {
    position: absolute;
    right: 646px;
    top: 310px;
    width: 290px;
    transform: scaleX(-1);
  }
  .icon-deco-5 {
    position: absolute;
    right: 382px;
    top: 220px;
    width: 410px;
    transform: scaleX(-1);
  }
  .icon-deco-6 {
    position: absolute;
    right: 0;
    top: 20px;
    width: 680px;
    transform: scaleX(-1);
  }

  .icon-logo {
    position: absolute;
    top: 600px;
    left: 878px;
    width: 164px;
  }

  .icon-footer {
    position: absolute;
    top: 1014px;
    left: 887px;
    width: 152px;
  }
}
</style>
