<template>
  <section class="card-module">
    <div v-show="!selectedCard" ref="gridWrapRef" class="card-module__grid-wrap">
      <div class="card-module__grid">
        <button
          v-for="(card, index) in cards"
          :key="card.id"
          type="button"
          class="card-module__item"
          :data-card-id="card.id"
          :data-card-index="index"
          @click="selectCard(card)"
        >
          <img class="card-module__thumb" :src="card.thumb" :alt="`卡片 ${card.id}`" />
        </button>
      </div>
    </div>

    <div v-show="selectedCard" class="card-module__detail">
      <template v-if="selectedCard">
        <button type="button" class="card-module__back" aria-label="返回卡片列表" @click="clearSelection">
          返回
        </button>
        <img
          class="card-module__detail-img"
          :src="selectedCard.detail"
          :alt="`卡片 ${selectedCard.id} 详情`"
        />
      </template>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  contentVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['scroll-sync'])

function loadCards() {
  const thumbEntries = Object.entries(
    import.meta.glob('@/assets/images/card/*.{jpg,jpeg,png,webp,svg}', {
      eager: true,
      import: 'default'
    })
  ).filter(([path]) => /card_\d+\./i.test(path))

  const detailEntries = Object.entries(
    import.meta.glob('@/assets/images/card/*_detail.{jpg,jpeg,png,webp,svg}', {
      eager: true,
      import: 'default'
    })
  )

  const detailMap = new Map(
    detailEntries.map(([path, src]) => {
      const id = parseInt(path.match(/card_(\d+)_detail/i)?.[1] ?? '0', 10)
      return [id, src]
    })
  )

  return thumbEntries
    .map(([path, thumb]) => {
      const id = parseInt(path.match(/card_(\d+)/i)?.[1] ?? '0', 10)
      return {
        id,
        thumb,
        detail: detailMap.get(id) ?? thumb
      }
    })
    .sort((a, b) => a.id - b.id)
}

const cards = loadCards()
const selectedCard = ref(null)
const gridWrapRef = ref(null)

let scrollTarget = null

function emitScrollSync() {
  const root = gridWrapRef.value
  if (!root) return

  emit('scroll-sync', {
    scrollTop: root.scrollTop,
    scrollHeight: root.scrollHeight,
    clientHeight: root.clientHeight
  })
}

function handleGridScroll() {
  emitScrollSync()
}

function teardownGridScroll() {
  if (scrollTarget) {
    scrollTarget.removeEventListener('scroll', handleGridScroll)
    scrollTarget = null
  }
}

function setupGridScroll() {
  teardownGridScroll()

  const root = gridWrapRef.value
  if (!root || selectedCard.value || !props.contentVisible) return

  scrollTarget = root
  scrollTarget.addEventListener('scroll', handleGridScroll, { passive: true })

  requestAnimationFrame(() => {
    emitScrollSync()
  })
}

function setupListView() {
  nextTick(() => {
    requestAnimationFrame(() => {
      setupGridScroll()
    })
  })
}

function selectCard(card) {
  teardownGridScroll()
  selectedCard.value = card
}

function clearSelection() {
  selectedCard.value = null
  if (props.contentVisible) {
    setupListView()
  }
}

watch(
  () => props.contentVisible,
  (visible) => {
    if (visible && !selectedCard.value) {
      setupListView()
    } else if (!visible) {
      teardownGridScroll()
    }
  }
)

onMounted(() => {
  if (props.contentVisible && !selectedCard.value) {
    setupListView()
  }
})

onBeforeUnmount(() => {
  teardownGridScroll()
})
</script>

<style lang="scss" scoped>
$card-module-w: 1612px;
$card-module-h: 606px;
$card-module-pt: 40px;
$card-w: 250px;
$card-h: 170px;
$card-gap-x: 40px;
$card-gap-y: 40px;
$card-grid-w: $card-w * 5 + $card-gap-x * 4;
$greek-blue: #0655bc;

.card-module {
  width: $card-module-w;
  padding-top: $card-module-pt;
  box-sizing: border-box;
  pointer-events: auto;

  &__grid-wrap {
    width: 100%;
    height: $card-module-h;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    column-gap: $card-gap-x;
    row-gap: $card-gap-y;
    width: $card-grid-w;
    margin: 0 auto;
  }

  &__item {
    width: $card-w;
    height: $card-h;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    overflow: hidden;
    flex-shrink: 0;
  }

  &__thumb {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    user-select: none;
    pointer-events: none;
  }

  &__detail {
    position: relative;
    width: $card-module-w;
    height: $card-module-h;
    overflow: hidden;
  }

  &__detail-img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    user-select: none;
  }

  &__back {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    padding: 8px 16px;
    border: none;
    background: rgba(#efedea, 0.92);
    font-family: 'Mengyuan Heiti', sans-serif;
    font-size: 18px;
    color: $greek-blue;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background: rgba(#efedea, 1);
    }
  }
}
</style>
