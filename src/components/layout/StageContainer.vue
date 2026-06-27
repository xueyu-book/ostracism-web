<template>
  <div class="stage-container">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.stage-container {
  --pillar-width: #{$pillar-width};
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: $color-bg;
}
</style>
