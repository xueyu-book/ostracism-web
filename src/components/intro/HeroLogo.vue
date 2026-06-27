<template>
  <div
    ref="heroRef"
    class="hero-logo"
    :class="{ 'hero-logo--hidden': hidden }"
  >
    <div class="hero-logo__pattern" aria-hidden="true" />
    <div
      ref="dropZoneRef"
      class="hero-logo__drop-zone"
      :class="{ 'hero-logo__drop-zone--active': highlightDropZone }"
      aria-hidden="true"
    />
    <div class="hero-logo__content">
      <!-- 士兵剪影占位 -->
      <div class="hero-logo__soldiers">
        <span v-for="i in 4" :key="i" class="hero-logo__soldier" />
      </div>
      <!-- OSTRACISM 标题占位 -->
      <div class="hero-logo__title">
        <span class="hero-logo__vase" />
        <span class="hero-logo__text">STRACISM</span>
      </div>
      <div class="hero-logo__divider" />
      <p
        ref="hintRef"
        class="hero-logo__hint"
        :class="{ 'hero-logo__hint--pulse': pulseHint }"
      >
        嵌入图腾以激活装置
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'

defineProps({
  hidden: {
    type: Boolean,
    default: false
  },
  pulseHint: {
    type: Boolean,
    default: true
  },
  highlightDropZone: {
    type: Boolean,
    default: false
  }
})

const heroRef = ref(null)
const dropZoneRef = ref(null)
const hintRef = ref(null)
let hintTween = null

onMounted(() => {
  if (hintRef.value) {
    hintTween = gsap.to(hintRef.value, {
      opacity: 0.35,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    })
  }
})

onBeforeUnmount(() => {
  hintTween?.kill()
})

function fadeOut() {
  hintTween?.kill()
  return gsap.to(heroRef.value, {
    opacity: 0,
    scale: 0.96,
    duration: 0.45,
    ease: 'power2.inOut'
  })
}

defineExpose({
  heroRef,
  dropZoneRef,
  hintRef,
  fadeOut
})
</script>

<style lang="scss" scoped>
.hero-logo {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: visibility 0s linear 1s;

  &--hidden {
    visibility: hidden;
    pointer-events: none;
  }

  &__pattern {
    position: absolute;
    inset: 0;
    background-color: $color-panel;
    background-image: repeating-conic-gradient(
        rgba($color-greek-blue, 0.06) 0% 25%,
        transparent 0% 50%
      ),
      repeating-linear-gradient(
        45deg,
        rgba($color-greek-blue, 0.04) 0,
        rgba($color-greek-blue, 0.04) 2px,
        transparent 2px,
        transparent 12px
      );
    background-size: 24px 24px, auto;
  }

  &__drop-zone {
    position: absolute;
    z-index: 2;
    top: 50%;
    left: 50%;
    width: min(420px, 72%);
    height: min(360px, 62%);
    transform: translate(-50%, -50%);
    pointer-events: none;
    border: 2px dashed transparent;
    border-radius: 12px;
    transition: border-color 0.25s, background 0.25s;

    &--active {
      border-color: rgba($color-greek-blue, 0.45);
      background: rgba($color-greek-blue, 0.06);
    }
  }

  &__content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 24px;
  }

  &__soldiers {
    display: flex;
    gap: 12px;
    align-items: flex-end;
  }

  &__soldier {
    display: block;
    width: clamp(36px, 5vw, 56px);
    height: clamp(64px, 10vh, 96px);
    background: $color-greek-blue;
    border-radius: 4px 4px 0 0;
    clip-path: polygon(20% 0, 80% 0, 100% 100%, 0 100%);

    &:nth-child(2),
    &:nth-child(3) {
      height: clamp(72px, 11vh, 104px);
    }
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  &__vase {
    display: block;
    width: clamp(28px, 4vw, 44px);
    height: clamp(36px, 5vh, 52px);
    background: $color-greek-blue;
    border-radius: 50% 50% 40% 40% / 60% 60% 40% 40%;
  }

  &__text {
    font-size: clamp(28px, 5vw, 52px);
    font-weight: 800;
    letter-spacing: 0.08em;
    color: $color-greek-blue;
    line-height: 1;
  }

  &__divider {
    width: min(320px, 60vw);
    height: 2px;
    background: rgba($color-greek-blue, 0.3);
  }

  &__hint {
    font-size: clamp(13px, 1.8vw, 16px);
    color: $color-greek-blue;
    letter-spacing: 0.12em;
    opacity: 1;
  }
}
</style>
