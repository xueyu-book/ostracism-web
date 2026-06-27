<template>
  <StageContainer class="intro-view">
    <PillarPair ref="pillarRef">
      <TotemDrag
        v-if="showTotem"
        :drop-target-ref="heroComponentRef"
        @drag-start="startDrag"
        @drop-success="handleDropSuccess"
      />
    </PillarPair>

    <main class="intro-view__center">
      <HeroLogo
        v-show="showHero"
        ref="heroRef"
        :pulse-hint="showDropHint"
        :highlight-drop-zone="highlightDropZone"
      />

      <WallTransition
        v-show="isTransitioning || showMainSite"
        ref="wallRef"
        :class="{ 'wall-transition--complete': showMainSite }"
      />
    </main>

    <button
      v-if="!showMainSite"
      class="intro-view__skip"
      type="button"
      @click="handleSkip"
    >
      跳过开场
    </button>
  </StageContainer>
</template>

<script setup>
import { ref, nextTick, computed } from 'vue'
import StageContainer from '@/components/layout/StageContainer.vue'
import PillarPair from '@/components/layout/PillarPair.vue'
import HeroLogo from '@/components/intro/HeroLogo.vue'
import TotemDrag from '@/components/intro/TotemDrag.vue'
import WallTransition from '@/components/transition/WallTransition.vue'
import { useIntroSequence } from '@/composables/useIntroSequence.js'

const {
  showHero,
  showTotem,
  showDropHint,
  highlightDropZone,
  isTransitioning,
  showMainSite,
  startDrag,
  onTotemDropped,
  startTransition,
  completeTransition,
  skipIntro
} = useIntroSequence()

const pillarRef = ref(null)
const heroRef = ref(null)
const wallRef = ref(null)
const isAnimating = ref(false)

// 显式 computed，确保 TotemDrag 始终拿到 HeroLogo 组件实例
const heroComponentRef = computed(() => heroRef.value)

function getPillarElements() {
  const pair = pillarRef.value
  return {
    leftPillar: pair?.leftRef?.value ?? pair?.leftRef,
    rightPillar: pair?.rightRef?.value ?? pair?.rightRef
  }
}

async function handleDropSuccess() {
  if (isAnimating.value) return
  isAnimating.value = true
  onTotemDropped()

  const hero = heroRef.value
  hero?.fadeOut?.()

  // Logo 渐隐与转场并行，不等待渐隐完成
  startTransition()
  await nextTick()

  const pillars = getPillarElements()
  if (wallRef.value?.play && pillars.leftPillar && pillars.rightPillar) {
    const tl = wallRef.value.play(pillars)
    tl.eventCallback('onComplete', () => {
      completeTransition()
      isAnimating.value = false
    })
  } else {
    completeTransition()
    isAnimating.value = false
  }
}

async function handleSkip() {
  skipIntro()
  await nextTick()
  const pillars = getPillarElements()
  if (wallRef.value?.skipToEnd && pillars.leftPillar && pillars.rightPillar) {
    wallRef.value.skipToEnd(pillars)
  }
}
</script>

<style lang="scss" scoped>
.intro-view {
  &__center {
    position: absolute;
    top: 0;
    bottom: 0;
    left: var(--pillar-width, #{$pillar-width});
    right: var(--pillar-width, #{$pillar-width});
    overflow: hidden;
  }

  &__skip {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 200;
    padding: 8px 16px;
    font-size: 13px;
    color: rgba($color-greek-blue, 0.55);
    border: 1px solid rgba($color-greek-blue, 0.25);
    border-radius: 4px;
    transition: color 0.2s, border-color 0.2s;

    &:hover {
      color: $color-greek-blue;
      border-color: rgba($color-greek-blue, 0.5);
    }
  }
}
</style>
