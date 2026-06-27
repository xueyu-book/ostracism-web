<template>
  <div
    ref="leftRef"
    class="pillar pillar--left"
  >
    <div class="pillar__body">
      <div class="pillar__capital" />
      <div class="pillar__shaft" />
      <div class="pillar__base" />
    </div>
    <div v-if="$slots.default" class="pillar__slot">
      <slot />
    </div>
  </div>
  <div ref="rightRef" class="pillar pillar--right">
    <div class="pillar__body">
      <div class="pillar__capital" />
      <div class="pillar__shaft" />
      <div class="pillar__base" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const leftRef = ref(null)
const rightRef = ref(null)

defineExpose({ leftRef, rightRef })
</script>

<style lang="scss" scoped>
.pillar {
  position: absolute;
  top: 0;
  z-index: 25;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: var(--pillar-width, #{$pillar-width});
  height: 100%;
  padding: 12px 8px;
  will-change: transform;
  transform-origin: 50% 50%;

  &--left {
    left: 0;
  }

  &--right {
    right: 0;
  }

  &__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    transform-origin: 50% 50%;
    will-change: transform;
  }

  &__capital {
    width: 85%;
    height: 28px;
    background: $color-greek-blue-light;
    border-radius: 4px 4px 0 0;
    flex-shrink: 0;
  }

  &__shaft {
    flex: 1;
    width: 65%;
    min-height: 0;
    background: repeating-linear-gradient(
      90deg,
      $color-greek-blue 0,
      $color-greek-blue 8px,
      $color-greek-blue-light 8px,
      $color-greek-blue-light 16px
    );
    border-left: 2px solid rgba(255, 255, 255, 0.15);
    border-right: 2px solid rgba(0, 0, 0, 0.15);
  }

  &__base {
    width: 95%;
    height: 20px;
    background: $color-greek-blue;
    border-radius: 0 0 4px 4px;
    flex-shrink: 0;
  }

  &__slot {
    position: absolute;
    bottom: 48px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
  }
}
</style>
