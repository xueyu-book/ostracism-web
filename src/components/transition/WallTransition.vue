<template>
  <div ref="transitionRef" class="wall-transition">
    <!-- 石墙背景层 -->
    <div class="wall-transition__bg">
      <div ref="wallTopRef" class="wall-transition__wall wall-transition__wall--top">
        <div class="wall-transition__stone-pattern" />
      </div>
      <div
        ref="wallBottomRef"
        class="wall-transition__wall wall-transition__wall--bottom"
      >
        <div class="wall-transition__stone-pattern" />
      </div>
    </div>

    <!-- 转场后揭示的内容区 -->
    <div ref="revealRef" class="wall-transition__reveal">
      <div class="wall-transition__border wall-transition__border--top">
        <span v-for="i in 12" :key="`top-${i}`" class="wall-transition__icon-block" />
      </div>

      <div class="wall-transition__main">
        <slot name="revealed">
          <p class="wall-transition__placeholder">卡片展示区域（占位）</p>
        </slot>
      </div>

      <div class="wall-transition__border wall-transition__border--bottom">
        <span v-for="i in 12" :key="`bot-${i}`" class="wall-transition__icon-block" />
      </div>
    </div>

    <!-- 导航图标 -->
    <nav ref="navRef" class="wall-transition__nav">
      <button
        v-for="(item, index) in navItems"
        :key="item.id"
        class="wall-transition__nav-item"
        :title="item.label"
        :style="{ '--delay': `${index * 0.08}s` }"
      >
        <span class="wall-transition__nav-block" />
        <span class="wall-transition__nav-tooltip">{{ item.label }}</span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import gsap from 'gsap'

const navItems = [
  { id: 'cards', label: '卡片展示' },
  { id: 'rules', label: '规则问题' },
  { id: 'manifesto', label: '项目立意' },
  { id: 'exiles', label: '驱逐名单' },
  { id: 'about', label: '关于' },
  { id: 'contact', label: '联系' },
  { id: 'more', label: '更多' }
]

/** 转场节奏配置 */
const TIMING = {
  // 石柱横向拉开 + 石墙纵向拉开同步
  spreadDuration: 2.8,
  revealDuration: 1.0,
  revealOverlap: 0.5,
  navDuration: 0.65,
  navStagger: 0.1,
  navOverlap: 0.3
}

const transitionRef = ref(null)
const wallTopRef = ref(null)
const wallBottomRef = ref(null)
const revealRef = ref(null)
const navRef = ref(null)

function getViewportMetrics() {
  const vw = window.innerWidth
  const vh = window.innerHeight

  return {
    vw,
    vh,
    centerX: vw / 2,
    centerY: vh / 2,
    halfHeight: vh / 2
  }
}

function getWallMetrics() {
  const el = transitionRef.value
  const h = el?.clientHeight ?? window.innerHeight

  return { halfHeight: h / 2 }
}

/**
 * 以视口对角线交点（屏幕几何中心）为起点，计算石柱收拢 / 展开位置
 */
function computePillarSpread(leftPillar, rightPillar) {
  const { vw, centerX } = getViewportMetrics()
  const pw = leftPillar.offsetWidth || rightPillar.offsetWidth || 100
  const gap = 12

  const leftCenterX = centerX - gap / 2
  const rightCenterX = centerX + gap / 2

  return {
    leftStartX: leftCenterX - pw / 2,
    rightStartX: rightCenterX - (vw - pw / 2),
    leftEndX: 0,
    rightEndX: 0
  }
}

function getPillarBody(pillar) {
  return pillar.querySelector('.pillar__body')
}

function applyPillarEndState(leftPillar, rightPillar) {
  ;[leftPillar, rightPillar].forEach((pillar) => {
    const body = getPillarBody(pillar)
    gsap.set(pillar, { x: 0, y: 0, clearProps: 'transform' })
    gsap.set(body, { scaleY: 1, clearProps: 'transform' })
  })
}

/** 石柱在视口中心点收拢，柱身以垂直中心为原点缩放 */
function setPillarGrowStart(pillar, x) {
  const body = getPillarBody(pillar)
  gsap.set(pillar, { x, y: 0 })
  gsap.set(body, {
    scaleY: 0.02,
    transformOrigin: '50% 50%'
  })
}

function animatePillarGrow(pillar, x, duration, ease, position, timeline) {
  const body = getPillarBody(pillar)
  timeline.to(pillar, { x, y: 0, duration, ease }, position)
  timeline.to(body, { scaleY: 1, duration, ease }, position)
}

/**
 * @param {{ leftPillar: HTMLElement, rightPillar: HTMLElement }} pillars
 */
function skipToEnd(pillars) {
  const { leftPillar, rightPillar } = pillars
  const { halfHeight } = getWallMetrics()

  applyPillarEndState(leftPillar, rightPillar)
  gsap.set(wallTopRef.value, { y: halfHeight, scaleY: 1, clearProps: 'transform' })
  gsap.set(wallBottomRef.value, { y: -halfHeight, scaleY: 1, clearProps: 'transform' })
  gsap.set(revealRef.value, { opacity: 1 })
  gsap.set(navRef.value, { opacity: 1 })
  gsap.set(navRef.value.querySelectorAll('.wall-transition__nav-item'), {
    opacity: 1,
    y: 0,
    scale: 1
  })
}

function setWallGrowStart() {
  gsap.set(wallTopRef.value, {
    y: 0,
    scaleY: 0.02,
    transformOrigin: '50% 100%'
  })
  gsap.set(wallBottomRef.value, {
    y: 0,
    scaleY: 0.02,
    transformOrigin: '50% 0%'
  })
}

function animateWallGrow(halfHeight, duration, ease, position, timeline) {
  timeline.to(
    wallTopRef.value,
    {
      y: halfHeight,
      scaleY: 1,
      duration,
      ease
    },
    position
  )
  timeline.to(
    wallBottomRef.value,
    {
      y: -halfHeight,
      scaleY: 1,
      duration,
      ease
    },
    position
  )
}

function play(pillars) {
  const { leftPillar, rightPillar } = pillars
  const { halfHeight } = getWallMetrics()
  const spread = computePillarSpread(leftPillar, rightPillar)

  gsap.killTweensOf([
    leftPillar,
    rightPillar,
    wallTopRef.value,
    wallBottomRef.value,
    getPillarBody(leftPillar),
    getPillarBody(rightPillar)
  ])

  gsap.set(revealRef.value, { opacity: 0 })
  gsap.set(navRef.value, { opacity: 0 })

  // 石柱、石墙均从视口中心点起始
  setPillarGrowStart(leftPillar, spread.leftStartX)
  setPillarGrowStart(rightPillar, spread.rightStartX)
  setWallGrowStart()

  const tl = gsap.timeline()
  const spreadEase = 'power3.inOut'
  const spreadStart = 0

  animatePillarGrow(
    leftPillar,
    spread.leftEndX,
    TIMING.spreadDuration,
    spreadEase,
    spreadStart,
    tl
  )
  animatePillarGrow(
    rightPillar,
    spread.rightEndX,
    TIMING.spreadDuration,
    spreadEase,
    spreadStart,
    tl
  )
  animateWallGrow(
    halfHeight,
    TIMING.spreadDuration,
    spreadEase,
    spreadStart,
    tl
  )

  // 揭示内容区（拉开接近尾声时淡入）
  tl.to(
    revealRef.value,
    {
      opacity: 1,
      duration: TIMING.revealDuration,
      ease: 'power2.out'
    },
    `-=${TIMING.revealOverlap}`
  )

  // 导航图标依次出现
  tl.fromTo(
    navRef.value.querySelectorAll('.wall-transition__nav-item'),
    { opacity: 0, y: 20, scale: 0.75 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: TIMING.navDuration,
      stagger: TIMING.navStagger,
      ease: 'back.out(1.5)'
    },
    `-=${TIMING.navOverlap}`
  ).set(navRef.value, { opacity: 1 })

  return tl
}

defineExpose({
  play,
  skipToEnd,
  transitionRef,
  wallTopRef,
  wallBottomRef,
  revealRef,
  navRef
})
</script>

<style lang="scss" scoped>
.wall-transition {
  position: absolute;
  inset: 0;
  z-index: 5;
  overflow: hidden;

  &__bg {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  &__wall {
    position: absolute;
    left: 0;
    right: 0;
    height: 50%;
    overflow: hidden;
    will-change: transform;

    &--top {
      top: 0;
      transform-origin: 50% 100%;
    }

    &--bottom {
      bottom: 0;
      transform-origin: 50% 0%;
    }
  }

  &__stone-pattern {
    width: 100%;
    height: 200%;
    background-color: $color-stone;
    background-image: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 28px,
        rgba($color-greek-blue, 0.08) 28px,
        rgba($color-greek-blue, 0.08) 30px
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 28px,
        rgba($color-greek-blue, 0.08) 28px,
        rgba($color-greek-blue, 0.08) 30px
      ),
      repeating-conic-gradient(
        rgba($color-greek-blue, 0.05) 0% 25%,
        transparent 0% 50%
      );
    background-size: auto, auto, 20px 20px;
  }

  &__wall--bottom &__stone-pattern {
    transform: translateY(-50%);
  }

  &__reveal {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    flex-direction: column;
    opacity: 0;
  }

  &__border {
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    gap: 8px;
    padding: 10px 16px;
    background: $color-stone-dark;

    &--top {
      border-bottom: 2px solid rgba($color-greek-blue, 0.2);
    }

    &--bottom {
      border-top: 2px solid rgba($color-greek-blue, 0.2);
      margin-top: auto;
    }
  }

  &__icon-block {
    display: block;
    width: clamp(20px, 2.5vw, 28px);
    height: clamp(20px, 2.5vw, 28px);
    background: rgba($color-greek-blue, 0.25);
    border-radius: 3px;
  }

  &__main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $color-panel;
    min-height: 0;
  }

  &__placeholder {
    font-size: clamp(14px, 2vw, 18px);
    color: rgba($color-greek-blue, 0.5);
    letter-spacing: 0.15em;
  }

  &__nav {
    position: absolute;
    top: clamp(48px, 8vh, 72px);
    left: 50%;
    transform: translateX(-50%);
    z-index: 30;
    display: flex;
    gap: clamp(8px, 1.5vw, 16px);
    padding: 8px 16px;
    background: rgba($color-panel, 0.92);
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    opacity: 0;
  }

  &__nav-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    &:hover .wall-transition__nav-tooltip {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  &__nav-block {
    display: block;
    width: clamp(28px, 3.5vw, 40px);
    height: clamp(28px, 3.5vw, 40px);
    background: $color-greek-blue;
    border-radius: 6px;
    transition: transform 0.2s, box-shadow 0.2s;

    .wall-transition__nav-item:hover & {
      transform: scale(1.08);
      box-shadow: 0 4px 12px rgba($color-greek-blue, 0.35);
    }
  }

  &__nav-tooltip {
    position: absolute;
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) translateY(-4px);
    padding: 4px 10px;
    background: #1a1a1a;
    color: #fff;
    font-size: 12px;
    white-space: nowrap;
    border-radius: 4px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s, transform 0.2s;
  }
}
</style>
