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
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeUnmount, nextTick } from 'vue'
import letterO from '@/assets/images/home/0_grey.svg'
import letterS from '@/assets/images/home/1_S.svg'
import letterT from '@/assets/images/home/2_T.svg'
import letterR from '@/assets/images/home/3_R.svg'
import letterA from '@/assets/images/home/4_A.svg'
import letterC from '@/assets/images/home/5_C.svg'
import letterI from '@/assets/images/home/6_I.svg'
import letterLowerS from '@/assets/images/home/7_s.svg'
import letterM from '@/assets/images/home/8_M.svg'

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
        })
      })
    })
  }, totalTime)
}

function isInDropZone(dragEl, zoneEl) {
  const dragRect = dragEl.getBoundingClientRect()
  const zoneRect = zoneEl.getBoundingClientRect()
  const centerX = dragRect.left + dragRect.width / 2
  const centerY = dragRect.top + dragRect.height / 2
  const pad = 28

  return (
    centerX >= zoneRect.left - pad &&
    centerX <= zoneRect.right + pad &&
    centerY >= zoneRect.top - pad &&
    centerY <= zoneRect.bottom + pad
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
}
</style>
