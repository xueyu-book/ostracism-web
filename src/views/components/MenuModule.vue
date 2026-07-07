<template>
  <section class="menu-module">
    <div class="menu-module__layout">
      <div
        ref="listScrollRef"
        class="menu-module__list-scroll"
        :class="{ 'menu-module__list-scroll--empty': isEmpty }"
        @mouseenter="isHovering = true"
        @mouseleave="isHovering = false"
      >
        <article v-if="isEmpty" class="menu-module__entry">
          <p class="menu-module__entry-text">
            {{ menuEmptyState.titleEn }}
            <span class="menu-module__empty-text-cn">{{ menuEmptyState.titleCn }}</span>
          </p>
          <img
            class="menu-module__entry-line"
            src="@/assets/images/nav_pillar/menu/line.svg"
            alt=""
          />
        </article>

        <template v-else>
          <article
            v-for="(entry, index) in scrollList"
            :key="`${entry.id}-${index}`"
            class="menu-module__entry"
          >
            <p class="menu-module__entry-text">
              {{ entry.id }} / {{ entry.name }} / {{ entry.location }}
            </p>
            <img
              v-if="index < scrollList.length - 1"
              class="menu-module__entry-line"
              src="@/assets/images/nav_pillar/menu/line.svg"
              alt=""
            />
          </article>
        </template>
      </div>

      <div class="menu-module__hero">
        <img
          class="menu-module__hero-img"
          src="@/assets/images/nav_pillar/menu/hero.svg"
          alt=""
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { exileList, menuEmptyState } from '@/content/menuContent'

const SCROLL_SPEED = 0.35

const listScrollRef = ref(null)
const isHovering = ref(false)
const isEmpty = computed(() => exileList.length === 0)
const scrollList = computed(() => [...exileList, ...exileList])

let rafId = null

function tick() {
  const el = listScrollRef.value
  if (el && !isHovering.value) {
    const loopHeight = el.scrollHeight / 2
    if (loopHeight > el.clientHeight) {
      el.scrollTop += SCROLL_SPEED
      if (el.scrollTop >= loopHeight) {
        el.scrollTop -= loopHeight
      }
    }
  }
  rafId = requestAnimationFrame(tick)
}

function startAutoScroll() {
  stopAutoScroll()
  nextTick(() => {
    if (listScrollRef.value) {
      listScrollRef.value.scrollTop = 0
    }
    rafId = requestAnimationFrame(tick)
  })
}

function stopAutoScroll() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

onMounted(() => {
  if (!isEmpty.value) {
    startAutoScroll()
  }
})
onBeforeUnmount(stopAutoScroll)
</script>

<style lang="scss" scoped>
$menu-module-w: 1612px;
$menu-module-pt: 40px;
$menu-module-pb: 40px;
$menu-entry-w: 720px;
$menu-hero-gap: 230px;
$greek-blue: #0655bc;
$list-gray: #959595;

.menu-module {
  width: $menu-module-w;
  height: 100%;
  padding: $menu-module-pt 0 $menu-module-pb;
  box-sizing: border-box;
  pointer-events: auto;

  &__layout {
    display: flex;
    gap: $menu-hero-gap;
    height: 100%;
    min-height: 0;
    padding-left: 40px;
    justify-content: flex-start;
  }

  &__list-scroll {
    flex: 0 0 $menu-entry-w;
    width: $menu-entry-w;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    &--empty {
      overflow-y: hidden;
    }
  }

  &__empty-text-cn {
    font-family: 'Source Han Sans SC', 'Noto Sans CJK SC', 'Noto Sans SC', sans-serif;
    text-transform: none;
  }

  &__entry {
    width: $menu-entry-w;
    padding-bottom: 18px;
  }

  &__entry-text {
    margin: 0 0 14px;
    font-family: 'Norse', serif;
    font-size: 54px;
    font-weight: 400;
    line-height: 1.15;
    letter-spacing: 0.02em;
    color: $list-gray;
    text-transform: uppercase;
  }

  &__entry-line {
    display: block;
    width: 100%;
    height: auto;
  }

  &__hero {
    position: relative;
    flex: 0 0 420px;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__hero-img {
    display: block;
    width: 100%;
    height: auto;
    max-height: 100%;
    object-fit: contain;
    user-select: none;
    pointer-events: none;
  }

  &__hero-copy {
    position: absolute;
    left: 50%;
    top: 52%;
    transform: translate(-50%, -50%);
    width: 100%;
    text-align: center;
    pointer-events: none;
  }

  &__hero-title-en {
    margin: 0;
    font-family: 'Norse', serif;
    font-size: 72px;
    font-weight: 700;
    line-height: 0.95;
    letter-spacing: 0.04em;
    color: $greek-blue;
    text-transform: uppercase;
  }

  &__hero-title-cn {
    margin: 12px 0 0;
    font-family: 'Mengyuan Heiti W14', 'Mengyuan Heiti', sans-serif;
    font-size: 36px;
    font-weight: 400;
    line-height: 1.2;
    letter-spacing: 0.08em;
    color: $greek-blue;
  }
}
</style>
