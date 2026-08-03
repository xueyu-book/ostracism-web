<template>
  <div
    class="intro-view"
    :class="{ 'intro-view--project': contentVisible && isProjectModule }"
  >
    <SplashScreen />

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
      v-show="showDefaultPillars"
      class="intro-view__pillar intro-view__pillar--left"
      :class="{ 'intro-view__pillar--spread': pillarsSpread }"
      src="@/assets/images/home/pillar.svg"
      alt=""
    />
    <img
      v-show="showDefaultPillars"
      class="intro-view__pillar intro-view__pillar--right"
      :class="{ 'intro-view__pillar--spread': pillarsSpread }"
      src="@/assets/images/home/pillar.svg"
      alt=""
    />

    <div
      v-show="showCardPillars"
      class="intro-view__nav-pillar-wrap intro-view__nav-pillar-wrap--left"
      :class="{ 'intro-view__nav-pillar-wrap--spread': pillarsSpread }"
    >
      <div ref="leftPillarScrollRef" class="intro-view__nav-pillar-scroll">
        <img
          class="intro-view__nav-pillar-img"
          :src="cardPillarLeft"
          alt=""
        />
      </div>
    </div>
    <div
      v-show="showCardPillars"
      class="intro-view__nav-pillar-wrap intro-view__nav-pillar-wrap--right"
      :class="{ 'intro-view__nav-pillar-wrap--spread': pillarsSpread }"
    >
      <div ref="rightPillarScrollRef" class="intro-view__nav-pillar-scroll">
        <img
          class="intro-view__nav-pillar-img"
          :src="cardPillarRight"
          alt=""
        />
      </div>
    </div>

    <img
      v-show="showRulePillars"
      class="intro-view__pillar intro-view__pillar--left intro-view__pillar--nav"
      :class="{ 'intro-view__pillar--spread': pillarsSpread }"
      :src="rulePillarLeft"
      alt=""
    />
    <img
      v-show="showRulePillars"
      class="intro-view__pillar intro-view__pillar--right intro-view__pillar--nav"
      :class="{ 'intro-view__pillar--spread': pillarsSpread }"
      :src="rulePillarRight"
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
      draggable="false"
      @pointerdown="onTotemPointerDown"
      @contextmenu.prevent
      @dragstart.prevent
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
      嵌入图腾以激活装置
    </p>

    <Teleport to="body">
      <div
        v-if="showMobileLandscapeTip"
        class="intro-view__mobile-tip"
        role="dialog"
        aria-modal="true"
        aria-label="建议横屏观看，获得最佳体验"
      >
        <button
          type="button"
          class="intro-view__mobile-tip-panel"
          aria-label="建议横屏观看，获得最佳体验"
          @click="dismissMobileTip"
        >
          <img
            class="intro-view__mobile-tip-img"
            src="@/assets/images/home/dialog_bg.svg"
            alt="建议横屏观看，获得最佳体验"
          />
        </button>
      </div>
    </Teleport>

    <Teleport to="body">
      <img
        v-show="isDragging"
        ref="ghostRef"
        class="intro-view__totem-ghost"
        :class="{ 'intro-view__totem-ghost--snapping': isSnapping }"
        :style="ghostStyle"
        src="@/assets/images/home/0_active.svg"
        alt=""
        draggable="false"
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
        <span class="intro-view__nav-tooltip">{{ item.label }}</span>
      </button>
    </nav>

    <main
      v-show="contentVisible"
      class="intro-view__content"
      :class="{
        'intro-view__content--card': isCardModule,
        'intro-view__content--rule': isRuleModule,
        'intro-view__content--project': isProjectModule,
        'intro-view__content--menu': isMenuModule
      }"
    >
      <component
        :is="activeModuleComponent"
        :content-visible="contentVisible"
        @scroll-sync="syncPillarScroll"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import SplashScreen from '@/components/intro/SplashScreen.vue'
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
import termsPdf from '@/assets/TOHC-terms.pdf'
import cardPillarLeft from '@/assets/images/nav_pillar/card/left.svg'
import cardPillarRight from '@/assets/images/nav_pillar/card/right.svg'
import rulePillarLeft from '@/assets/images/nav_pillar/rule/left.svg'
import rulePillarRight from '@/assets/images/nav_pillar/rule/right.svg'
import { pxToRem } from '@/utils/rem'
import CardModule from './components/CardModule.vue'
import RuleModule from './components/RuleModule.vue'
import ProjectModule from './components/ProjectModule.vue'
import MenuModule from './components/MenuModule.vue'
import ProvisionModule from './components/ProvisionModule.vue'

const moduleComponents = {
  card: CardModule,
  rule: RuleModule,
  project: ProjectModule,
  menu: MenuModule,
  provision: ProvisionModule
}

function withNavSvg(svg) {
  if (/preserveAspectRatio=/.test(svg)) {
    return svg.replace(/preserveAspectRatio="[^"]*"/, 'preserveAspectRatio="none"')
  }
  return svg.replace('<svg', '<svg preserveAspectRatio="none"')
}

const navItems = [
  { id: 'card', label: '卡片展示', svg: withNavSvg(iconCard), top: 65, left: 220, width: 46, height: 64 },
  { id: 'rule', label: '规则&问题', svg: withNavSvg(iconRule), top: 65, left: 312, width: 28, height: 64 },
  {
    id: 'project',
    label: '俱楽部主张',
    svg: withNavSvg(iconProject),
    top: 63,
    left: 382,
    width: 58,
    height: 68
  },
  { id: 'menu', label: '放逐名单', svg: withNavSvg(iconMenu), top: 65, left: 462, width: 68, height: 64 },
  {
    id: 'provision',
    label: '服务条款',
    svg: withNavSvg(iconProvision),
    top: 65,
    left: 552,
    width: 54,
    height: 66,
    externalUrl: termsPdf
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
const WALL_SLIDE_DURATION_MS = 2000
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

const activeModuleComponent = computed(
  () => moduleComponents[activeNav.value] ?? CardModule
)

const isCardModule = computed(() => activeNav.value === 'card')
const isRuleModule = computed(() => activeNav.value === 'rule')
const isProjectModule = computed(() => activeNav.value === 'project')
const isMenuModule = computed(() => activeNav.value === 'menu')
const showCardPillars = computed(() => contentVisible.value && isCardModule.value)
const showRulePillars = computed(() => contentVisible.value && isRuleModule.value)
const showDefaultPillars = computed(
  () => !showCardPillars.value && !showRulePillars.value
)

const leftPillarScrollRef = ref(null)
const rightPillarScrollRef = ref(null)

function resetPillarScroll() {
  ;[leftPillarScrollRef.value, rightPillarScrollRef.value].forEach((el) => {
    if (el) el.scrollTop = 0
  })
}

function syncPillarScroll({ scrollTop, scrollHeight, clientHeight }) {
  if (!showCardPillars.value) return

  const pillars = [leftPillarScrollRef.value, rightPillarScrollRef.value]
  if (!pillars[0] || !pillars[1]) return

  const contentMaxScroll = Math.max(scrollHeight - clientHeight, 0)
  const ratio = contentMaxScroll > 0 ? scrollTop / contentMaxScroll : 0

  pillars.forEach((el) => {
    const maxScroll = Math.max(el.scrollHeight - el.clientHeight, 0)
    el.scrollTop = ratio * maxScroll
  })
}

watch(activeNav, () => {
  resetPillarScroll()
})

function onNavClick(id) {
  const item = navItems.find((nav) => nav.id === id)
  if (item?.externalUrl) {
    window.open(item.externalUrl, '_blank', 'noopener,noreferrer')
    return
  }
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

const showMobileLandscapeTip = ref(false)
let mobileTipDismissed = false

function isMobileDevice() {
  const ua = navigator.userAgent || navigator.vendor || ''
  return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua)
}

function isPortraitOrientation() {
  return window.innerHeight >= window.innerWidth
}

function updateMobileLandscapeTip() {
  if (mobileTipDismissed) return
  showMobileLandscapeTip.value = isMobileDevice() && isPortraitOrientation()
}

function dismissMobileTip() {
  mobileTipDismissed = true
  showMobileLandscapeTip.value = false
}

function onViewportChange() {
  updateMobileLandscapeTip()
}

const DROP_ZONE_TOLERANCE = 10
const TOTEM_SNAP_DURATION_MS = 300
const TOTEM_SNAP_PAUSE_MS = 1000

const isDragging = ref(false)
const isSnapping = ref(false)
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
let snapTimer = null
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
  const centerX = dragRect.left + dragRect.width / 2
  const centerY = dragRect.top + dragRect.height / 2

  return (
    centerX >= zoneRect.left - DROP_ZONE_TOLERANCE &&
    centerX <= zoneRect.right + DROP_ZONE_TOLERANCE &&
    centerY >= zoneRect.top - DROP_ZONE_TOLERANCE &&
    centerY <= zoneRect.bottom + DROP_ZONE_TOLERANCE
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

function snapGhostToDropTarget(dropTarget) {
  const zoneRect = dropTarget.getBoundingClientRect()

  ghostStyle.left = `${zoneRect.left}px`
  ghostStyle.top = `${zoneRect.top}px`
  ghostStyle.width = `${zoneRect.width}px`
  ghostStyle.height = `${zoneRect.height}px`
}

function clearSnapTimer() {
  if (snapTimer !== null) {
    window.clearTimeout(snapTimer)
    snapTimer = null
  }
}

function completeTotemSnap() {
  clearSnapTimer()
  isDragging.value = false
  isSnapping.value = false
  triggerHide()
}

function startTotemSnap(dropTarget) {
  clearSnapTimer()
  isSnapping.value = true

  nextTick(() => {
    requestAnimationFrame(() => {
      snapGhostToDropTarget(dropTarget)
      snapTimer = window.setTimeout(
        completeTotemSnap,
        TOTEM_SNAP_DURATION_MS + TOTEM_SNAP_PAUSE_MS
      )
    })
  })
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
    startTotemSnap(dropTarget)
    return
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
  if (activated.value || isHiding.value || isDragging.value || isSnapping.value) return

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

onMounted(() => {
  updateMobileLandscapeTip()
  window.addEventListener('orientationchange', onViewportChange)
  window.addEventListener('resize', onViewportChange)
})

onBeforeUnmount(() => {
  removeListeners()
  window.removeEventListener('orientationchange', onViewportChange)
  window.removeEventListener('resize', onViewportChange)
  if (hideTimer !== null) {
    window.clearTimeout(hideTimer)
  }
  if (navRevealTimer !== null) {
    window.clearTimeout(navRevealTimer)
  }
  if (contentRevealTimer !== null) {
    window.clearTimeout(contentRevealTimer)
  }
  clearSnapTimer()
})
</script>

<style lang="scss" scoped>
@use 'sass:math';

$page-padding: 36px;
$pillar-w: 200px;
$pillar-h: 1080px;
$pillar-spread: 80px;
$spread-slide-duration: 2s;
$wall-mechanism-easing: cubic-bezier(0.58, 0, 0.72, 0.82);
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
$nav-icon-default: #918f81;
$nav-bg-scale: 1.2;
$nav-reveal-duration: 0.75s;
$totem-snap-duration: 0.3s;

@keyframes intro-totem-pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.45;
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
    transition: transform $wall-slide-duration $wall-mechanism-easing;

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
      left $pillar-spread-duration $wall-mechanism-easing,
      right $pillar-spread-duration $wall-mechanism-easing;

    &--left {
      left: $page-padding;

      &.intro-view__pillar--spread {
        left: -46px;
      }
    }

    &--right {
      right: $page-padding;
      transform: scaleX(-1);
      transform-origin: center center;

      &.intro-view__pillar--spread {
        right: -46px;
      }
    }

    &--nav {
      width: $pillar-w;
      height: auto;
      object-fit: initial;
    }

    &--nav.intro-view__pillar--right {
      transform: none;
      transform-origin: center center;
    }
  }

  &__nav-pillar-wrap {
    position: absolute;
    top: 0;
    width: $pillar-w;
    height: $design-h;
    overflow: hidden;
    z-index: 2;
    transition:
      left $pillar-spread-duration $wall-mechanism-easing,
      right $pillar-spread-duration $wall-mechanism-easing;

    &--left {
      left: $page-padding;

      &.intro-view__nav-pillar-wrap--spread {
        left: -46px;
      }
    }

    &--right {
      right: $page-padding;

      &.intro-view__nav-pillar-wrap--spread {
        right: -46px;
      }
    }
  }

  &__nav-pillar-scroll {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    pointer-events: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__nav-pillar-img {
    display: block;
    width: $pillar-w;
    height: auto;
    user-select: none;
    pointer-events: none;
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
    -webkit-user-select: none;
    -webkit-user-drag: none;
    -webkit-touch-callout: none;
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
    user-select: none;
    -webkit-user-select: none;
    -webkit-user-drag: none;
    -webkit-touch-callout: none;
    filter: drop-shadow(0 6px 18px rgba($greek-blue, 0.45));

    &--snapping {
      transition:
        left $totem-snap-duration cubic-bezier(0.22, 1, 0.36, 1),
        top $totem-snap-duration cubic-bezier(0.22, 1, 0.36, 1),
        width $totem-snap-duration cubic-bezier(0.22, 1, 0.36, 1),
        height $totem-snap-duration cubic-bezier(0.22, 1, 0.36, 1),
        filter $totem-snap-duration ease-out;
      filter: drop-shadow(0 2px 8px rgba($greek-blue, 0.25));
    }
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
    color: $nav-icon-default;
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

    &--revealed:hover,
    &--active {
      color: $greek-blue;
    }

    &--revealed:hover .intro-view__nav-tooltip {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  &__nav-tooltip {
    position: absolute;
    top: calc(100% + 8px);
    left: 50%;
    z-index: 2;
    transform: translateX(-50%) translateY(-4px);
    padding: 4px 10px;
    background: #1a1a1a;
    color: #fff;
    font-family: 'Mengyuan Heiti', sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.4;
    white-space: nowrap;
    border-radius: 4px;
    opacity: 0;
    pointer-events: none;
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
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

    &--card,
    &--rule,
    &--project,
    &--menu {
      align-items: flex-start;
      justify-content: center;
    }

    &--project {
      left: 54px;
      right: 54px;
      z-index: 3;
      overflow: visible;
    }
  }
}

.intro-view--project {
  .intro-view__pillar {
    z-index: 1;
  }
}

.intro-view__mobile-tip {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6vw;
  background: rgba(0, 0, 0, 0.55);
}

.intro-view__mobile-tip-panel {
  display: block;
  width: calc(88vw * 2 / 3);
  max-width: calc(88vw * 2 / 3);
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  box-sizing: border-box;
}

.intro-view__mobile-tip-img {
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
  pointer-events: none;
}
</style>
