<template>
  <div class="intro-view">
    <div
      class="intro-view__bg"
      :class="{ 'intro-view__bg--sliding': wallReady }"
      aria-hidden="true"
    >
      <div
        class="intro-view__bg-panel intro-view__bg-panel--top"
        :class="{ 'intro-view__bg-panel--slide': wallSliding }"
      >
        <img
          class="intro-view__wall-thickness intro-view__wall-thickness--top"
          :class="{ 'intro-view__wall-thickness--visible': wallReady }"
          src="@/assets/images/home/wall-thickness-top.png"
          alt=""
        />
        <img
          class="intro-view__bg-layer intro-view__bg-layer--top"
          src="@/assets/images/home/bg_top.jpg"
          alt=""
        />
      </div>
      <div
        class="intro-view__bg-panel intro-view__bg-panel--bottom"
        :class="{ 'intro-view__bg-panel--slide': wallSliding }"
      >
        <img
          class="intro-view__bg-layer intro-view__bg-layer--bottom"
          src="@/assets/images/home/bg-bottom.jpg"
          alt=""
        />
        <img
          class="intro-view__wall-thickness intro-view__wall-thickness--bottom"
          :class="{ 'intro-view__wall-thickness--visible': wallReady }"
          src="@/assets/images/home/wall-thickness-bottom.png"
          alt=""
        />
      </div>
    </div>

    <img
      class="intro-view__pillar intro-view__pillar--left"
      :class="{ 'intro-view__pillar--spread': pillarsSpread }"
      src="@/assets/images/home/pillar.svg"
      alt=""
    />
    <img
      class="intro-view__pillar intro-view__pillar--right"
      :class="{ 'intro-view__pillar--spread': pillarsSpread }"
      src="@/assets/images/home/pillar.svg"
      alt=""
    />

    <img
      v-show="!activated"
      ref="totemRef"
      class="intro-view__totem intro-view__fade-item"
      :class="{
        'intro-view__totem--pulse': !isDragging && !isHiding,
        'intro-view__totem--placeholder': isDragging,
        'intro-view__fade-item--out': isHiding
      }"
      :style="{ '--fade-delay': `${fadeDelays.totem}ms` }"
      src="@/assets/images/home/0_active.svg"
      alt="图腾"
      @pointerdown="onTotemPointerDown"
    />

    <img
      v-show="!activated"
      class="intro-view__soldier intro-view__fade-item"
      :class="{ 'intro-view__fade-item--out': isHiding }"
      :style="{ '--fade-delay': `${fadeDelays.soldier}ms` }"
      src="@/assets/images/home/soldier.svg"
      alt=""
    />

    <h1
      v-show="!activated"
      class="intro-view__title intro-view__fade-item"
      :class="{ 'intro-view__fade-item--out': isHiding }"
      :style="{ '--fade-delay': `${fadeDelays.title}ms` }"
    >
      <img
        ref="dropTargetRef"
        class="intro-view__title-letter intro-view__title-letter--o"
        :src="letterO"
        alt="O"
      />
      <img
        v-for="letter in titleLettersRest"
        :key="letter.alt"
        class="intro-view__title-letter"
        :src="letter.src"
        :alt="letter.alt"
      />
    </h1>

    <p
      v-show="!activated"
      class="intro-view__hint intro-view__fade-item"
      :class="{
        'intro-view__hint--pulse': !isHiding,
        'intro-view__fade-item--out': isHiding
      }"
      :style="{ '--fade-delay': `${fadeDelays.hint}ms` }"
    >
      接入图腾以激活装置
    </p>

    <Teleport to="body">
      <img
        v-show="isDragging"
        ref="ghostRef"
        class="intro-view__totem-ghost"
        :style="ghostStyle"
        src="@/assets/images/home/0_active.svg"
        alt=""
      />
    </Teleport>

    <nav v-show="wallSliding" class="intro-view__nav" aria-label="主导航">
      <button
        v-for="(item, index) in navItems"
        :key="item.id"
        type="button"
        class="intro-view__nav-item"
        :class="{
          'intro-view__nav-item--active': activeNav === item.id,
          'intro-view__nav-item--revealed': navRevealed
        }"
        :style="getNavItemStyle(item, index)"
        :aria-label="item.label"
        :aria-current="activeNav === item.id ? 'page' : undefined"
        @click="onNavClick(item.id)"
      >
        <span class="intro-view__nav-icon" v-html="item.svg" aria-hidden="true" />
      </button>
    </nav>

    <main v-show="contentVisible" class="intro-view__content">
      <section class="intro-view__module">
        <p class="intro-view__module-title">{{ activeModule.label }}</p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onBeforeUnmount, nextTick } from 'vue'
import letterO from '@/assets/images/home/0_grey.svg'
import letterS from '@/assets/images/home/1_S.svg'
import letterT from '@/assets/images/home/2_T.svg'
import letterR from '@/assets/images/home/3_R.svg'
import letterA from '@/assets/images/home/4_A.svg'
import letterC from '@/assets/images/home/5_C.svg'
import letterI from '@/assets/images/home/6_I.svg'
import letterLowerS from '@/assets/images/home/7_s.svg'
import letterM from '@/assets/images/home/8_M.svg'
import iconCard from '@/assets/images/nav_icon/1_card.svg?raw'
import iconRule from '@/assets/images/nav_icon/2_rule.svg?raw'
import iconProject from '@/assets/images/nav_icon/3_project.svg?raw'
import iconMenu from '@/assets/images/nav_icon/4_menu.svg?raw'
import iconProvision from '@/assets/images/nav_icon/5_provision.svg?raw'
import { pxToRem } from '@/utils/rem'

function withNavSvg(svg) {
  if (/preserveAspectRatio=/.test(svg)) {
    return svg.replace(/preserveAspectRatio="[^"]*"/, 'preserveAspectRatio="none"')
  }
  return svg.replace('<svg', '<svg preserveAspectRatio="none"')
}

const navItems = [
  { id: 'card', label: '卡片展示', svg: withNavSvg(iconCard), top: 65, left: 220, width: 46, height: 64 },
  { id: 'rule', label: '规则问题', svg: withNavSvg(iconRule), top: 65, left: 312, width: 28, height: 64 },
  {
    id: 'project',
    label: '项目立意',
    svg: withNavSvg(iconProject),
    top: 63,
    left: 382,
    width: 58,
    height: 68
  },
  { id: 'menu', label: '驱逐名单', svg: withNavSvg(iconMenu), top: 65, left: 462, width: 68, height: 64 },
  {
    id: 'provision',
    label: '服务条款',
    svg: withNavSvg(iconProvision),
    top: 65,
    left: 552,
    width: 54,
    height: 66
  }
]

const titleLettersRest = [
  { src: letterS, alt: 'S' },
  { src: letterT, alt: 'T' },
  { src: letterR, alt: 'R' },
  { src: letterA, alt: 'A' },
  { src: letterC, alt: 'C' },
  { src: letterI, alt: 'I' },
  { src: letterLowerS, alt: 's' },
  { src: letterM, alt: 'M' }
]

const HIDE_DURATION = 600
const HIDE_STAGGER = 280
const WALL_SLIDE_DURATION_MS = 1200
const NAV_REVEAL_STAGGER_MS = 180
const NAV_REVEAL_DURATION_MS = 750

const fadeDelays = {
  soldier: 0,
  title: HIDE_STAGGER,
  hint: HIDE_STAGGER * 2,
  totem: HIDE_STAGGER * 3
}

const activated = ref(false)
const isHiding = ref(false)
const pillarsSpread = ref(false)
const wallReady = ref(false)
const wallSliding = ref(false)
const navRevealed = ref(false)
const contentVisible = ref(false)
const activeNav = ref('card')

const activeModule = computed(
  () => navItems.find((item) => item.id === activeNav.value) ?? navItems[0]
)

function onNavClick(id) {
  activeNav.value = id
}

function getNavItemStyle(item, index) {
  return {
    top: pxToRem(item.top),
    left: pxToRem(item.left),
    width: pxToRem(item.width),
    height: pxToRem(item.height),
    '--nav-reveal-delay': `${index * NAV_REVEAL_STAGGER_MS}ms`
  }
}

const isDragging = ref(false)
const totemRef = ref(null)
const ghostRef = ref(null)
const dropTargetRef = ref(null)

const ghostStyle = reactive({
  left: '0px',
  top: '0px',
  width: '46px',
  height: '66px'
})

let startX = 0
let startY = 0
let originX = 0
let originY = 0
let activePointerId = null
let hideTimer = null
let navRevealTimer = null
let contentRevealTimer = null

function getNavRevealTotalMs() {
  return (navItems.length - 1) * NAV_REVEAL_STAGGER_MS + NAV_REVEAL_DURATION_MS
}

function scheduleNavReveal() {
  if (navRevealTimer !== null) {
    window.clearTimeout(navRevealTimer)
  }
  if (contentRevealTimer !== null) {
    window.clearTimeout(contentRevealTimer)
  }
  navRevealTimer = window.setTimeout(() => {
    navRevealed.value = true
    navRevealTimer = null
    contentRevealTimer = window.setTimeout(() => {
      contentVisible.value = true
      contentRevealTimer = null
    }, getNavRevealTotalMs())
  }, WALL_SLIDE_DURATION_MS)
}

function triggerHide() {
  if (isHiding.value || activated.value) return

  isHiding.value = true

  const totalTime = fadeDelays.totem + HIDE_DURATION
  hideTimer = window.setTimeout(() => {
    activated.value = true
    isHiding.value = false
    hideTimer = null
    nextTick(() => {
      requestAnimationFrame(() => {
        wallReady.value = true
        pillarsSpread.value = true
        requestAnimationFrame(() => {
          wallSliding.value = true
          scheduleNavReveal()
        })
      })
    })
  }, totalTime)
}

function isInDropZone(dragEl, zoneEl) {
  const dragRect = dragEl.getBoundingClientRect()
  const zoneRect = zoneEl.getBoundingClientRect()
  const tolerance = 4

  return (
    dragRect.left >= zoneRect.left - tolerance &&
    dragRect.top >= zoneRect.top - tolerance &&
    dragRect.right <= zoneRect.right + tolerance &&
    dragRect.bottom <= zoneRect.bottom + tolerance
  )
}

function updateGhostPosition(clientX, clientY) {
  ghostStyle.left = `${originX + clientX - startX}px`
  ghostStyle.top = `${originY + clientY - startY}px`
}

function onPointerMove(e) {
  if (!isDragging.value || e.pointerId !== activePointerId) return
  updateGhostPosition(e.clientX, e.clientY)
}

function onPointerUp(e) {
  if (!isDragging.value || e.pointerId !== activePointerId) return

  const totem = totemRef.value
  if (totem?.hasPointerCapture?.(e.pointerId)) {
    totem.releasePointerCapture(e.pointerId)
  }

  activePointerId = null
  removeListeners()

  const dropTarget = dropTargetRef.value
  const ghost = ghostRef.value

  if (dropTarget && ghost && isInDropZone(ghost, dropTarget)) {
    triggerHide()
  }

  isDragging.value = false
}

function addListeners() {
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerUp)
}

function removeListeners() {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerUp)
}

function onTotemPointerDown(e) {
  if (activated.value || isHiding.value || isDragging.value) return

  const totem = totemRef.value
  if (!totem) return

  e.preventDefault()
  isDragging.value = true
  activePointerId = e.pointerId

  const rect = totem.getBoundingClientRect()
  startX = e.clientX
  startY = e.clientY
  originX = rect.left
  originY = rect.top

  ghostStyle.left = `${originX}px`
  ghostStyle.top = `${originY}px`
  ghostStyle.width = `${rect.width}px`
  ghostStyle.height = `${rect.height}px`

  totem.setPointerCapture(e.pointerId)
  addListeners()
}

onBeforeUnmount(() => {
  removeListeners()
  if (hideTimer !== null) {
    window.clearTimeout(hideTimer)
  }
  if (navRevealTimer !== null) {
    window.clearTimeout(navRevealTimer)
  }
  if (contentRevealTimer !== null) {
    window.clearTimeout(contentRevealTimer)
  }
})
</script>

<style lang="scss" scoped>
@use 'sass:math';

$page-padding: 36px;
$pillar-w: 200px;
$pillar-h: 1080px;
$pillar-spread: 80px;
$spread-slide-duration: 1.2s;
$pillar-spread-duration: $spread-slide-duration;
$design-w: 1920px;
$design-h: 1080px;
$wall-slide-distance: 900px;
$wall-slide-bottom-distance: 940px;
$wall-slide-duration: $spread-slide-duration;
$bg-layer-h: math.div($design-h, 2);
$bg-seam-overlap: 1px;
$wall-thickness-h: 28px;
$totem-w: 46px;
$totem-h: 66px;
$soldier-w: 524px;
$soldier-h: 220px;
$greek-blue: #0655bc;
$wall-reveal-bg: #efedea;
$nav-active-bg: #918f81;
$nav-bg-scale: 1.2;
$nav-reveal-duration: 0.75s;

@keyframes intro-totem-pulse {
  0%,
  100% {
    opacity: 1;
    transform: translate(0, 0);
  }

  50% {
    opacity: 0.45;
    transform: translate(14px, -12px);
  }
}

@keyframes intro-hint-pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.35;
  }
}

.intro-view {
  position: relative;
  width: $design-w;
  height: $design-h;
  overflow: hidden;
  flex-shrink: 0;

  &__fade-item {
    opacity: 1;
    transition: opacity 0.6s ease var(--fade-delay, 0ms);

    &--out {
      opacity: 0;
      pointer-events: none;
      animation: none !important;
    }
  }

  &__bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;

    &--sliding {
      background: $wall-reveal-bg;
    }
  }

  &__bg-panel {
    position: absolute;
    left: 0;
    width: $design-w;
    line-height: 0;
    font-size: 0;
    will-change: transform;
    transition: transform $wall-slide-duration ease-in-out;

    &--top {
      top: 0;
    }

    &--bottom {
      top: $bg-layer-h - $bg-seam-overlap;
    }

    &--top.intro-view__bg-panel--slide {
      transform: translateY($wall-slide-distance);
    }

    &--bottom.intro-view__bg-panel--slide {
      transform: translateY(-$wall-slide-bottom-distance);
    }
  }

  &__bg-layer {
    display: block;
    width: $design-w;
    height: $bg-layer-h;
    object-fit: cover;
    object-position: center;
    user-select: none;
    pointer-events: none;
    vertical-align: top;

    &--top {
      object-position: center top;
    }

    &--bottom {
      object-position: center bottom;
    }
  }

  &__wall-thickness {
    position: absolute;
    left: 0;
    display: block;
    width: $design-w;
    height: $wall-thickness-h;
    object-fit: fill;
    user-select: none;
    pointer-events: none;
    opacity: 0;

    &--visible {
      opacity: 1;
    }

    &--top {
      bottom: 100%;
    }

    &--bottom {
      top: 100%;
    }
  }

  &__pillar {
    position: absolute;
    top: 0;
    width: $pillar-w;
    height: $pillar-h;
    object-fit: fill;
    pointer-events: none;
    user-select: none;
    z-index: 2;
    transition:
      left $pillar-spread-duration ease-in-out,
      right $pillar-spread-duration ease-in-out;

    &--left {
      left: $page-padding;

      &.intro-view__pillar--spread {
        left: $page-padding - $pillar-spread;
      }
    }

    &--right {
      right: $page-padding;
      transform: scaleX(-1);
      transform-origin: center center;

      &.intro-view__pillar--spread {
        right: $page-padding - $pillar-spread;
      }
    }
  }

  &__totem {
    position: absolute;
    left: 220px;
    bottom: 10px;
    width: $totem-w;
    height: $totem-h;
    object-fit: fill;
    display: block;
    touch-action: none;
    cursor: grab;
    user-select: none;
    z-index: 3;

    &--pulse {
      animation: intro-totem-pulse 2.4s ease-in-out infinite;
    }

    &--placeholder {
      opacity: 0.25;
      animation: none;
    }

    &:active {
      cursor: grabbing;
    }
  }

  &__totem-ghost {
    position: fixed;
    z-index: 9999;
    object-fit: fill;
    pointer-events: none;
    touch-action: none;
    cursor: grabbing;
    filter: drop-shadow(0 6px 18px rgba($greek-blue, 0.45));
  }

  &__soldier {
    position: absolute;
    bottom: 520px;
    left: 50%;
    transform: translateX(-50%);
    width: $soldier-w;
    height: $soldier-h;
    object-fit: fill;
    display: block;
    user-select: none;
    z-index: 2;
  }

  &__title {
    position: absolute;
    bottom: 414px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 0;
    line-height: 0;
    z-index: 2;
  }

  &__title-letter {
    height: 66px;
    width: auto;
    object-fit: contain;
    user-select: none;
    pointer-events: none;

    &--o {
      width: 46px;
      height: 66px;
      margin-right: 4px;
      object-fit: fill;
    }
  }

  &__hint {
    position: absolute;
    bottom: 324px;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'Mengyuan Heiti', sans-serif;
    font-size: 30px;
    font-weight: 500;
    letter-spacing: normal;
    color: $greek-blue;
    white-space: nowrap;
    z-index: 2;

    &--pulse {
      animation: intro-hint-pulse 2.4s ease-in-out infinite;
    }
  }

  &__nav {
    position: absolute;
    inset: 0;
    z-index: 10;
    pointer-events: none;
  }

  &__nav-item {
    position: absolute;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    color: $greek-blue;
    overflow: visible;
    opacity: 0;
    transform: translateX(-14px) scale(0.92);
    pointer-events: none;
    transition:
      opacity $nav-reveal-duration ease-out,
      transform $nav-reveal-duration cubic-bezier(0.22, 1, 0.36, 1),
      color 0.2s ease;
    transition-delay: var(--nav-reveal-delay, 0ms), var(--nav-reveal-delay, 0ms), 0ms;

    &--revealed {
      opacity: 1;
      transform: translateX(0) scale(1);
      pointer-events: auto;
    }

    &::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      width: calc(100% * #{$nav-bg-scale});
      height: calc(100% * #{$nav-bg-scale});
      transform: translate(-50%, -50%);
      background: url('@/assets/images/nav_icon/nav_bg.jpg') repeat-x left center / auto 100%;
      z-index: 0;
    }

    &--active {
      color: $nav-active-bg;
    }
  }

  &__nav-icon {
    position: relative;
    z-index: 1;
    display: block;
    width: 100%;
    height: 100%;
    line-height: 0;
    pointer-events: none;

    :deep(svg) {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  &__content {
    position: absolute;
    top: 166px;
    right: 110px;
    bottom: 206px;
    left: 110px;
    z-index: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  &__module {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: auto;
  }

  &__module-title {
    font-family: 'Mengyuan Heiti', sans-serif;
    font-size: 36px;
    font-weight: 500;
    color: $greek-blue;
    letter-spacing: 0.12em;
  }
}
</style>
