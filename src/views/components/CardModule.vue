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
      <div
        class="card-module__back"
        @click="clearSelection"
      >
        <img
          class="card-module__back-icon"
          src="@/assets/images/card_detail/back.svg"
          alt=""
        />
      </div>
      <template v-if="selectedCard && cardDetail">
        <div class="card-module__detail-panel">
          <div class="card-module__identity">{{ cardDetail.identity }}</div>
          <div class="card-module__expiry">{{ cardDetail.expiry }}</div>
          <div class="card-module__scope">{{ cardDetail.scope }}</div>
          <div class="card-module__difficulty">{{ cardDetail.difficulty }}</div>
          <div class="card-module__benefits">{{ cardDetail.benefits }}</div>
          <img
            class="card-module__card-img"
            :src="selectedCard.thumb"
            :alt="`卡片 ${selectedCard.id}`"
          />
        </div>
      </template>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { getCardDetail } from '@/content/cardDetailContent'
import heroLow from '@/assets/images/card_detail/hero_low.svg'
import heroMid from '@/assets/images/card_detail/hero_mid.svg'
import heroHigh from '@/assets/images/card_detail/hero_high.svg'

const props = defineProps({
  contentVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['scroll-sync'])

const heroMap = {
  low: heroLow,
  mid: heroMid,
  high: heroHigh
}

function loadCards() {
  const thumbEntries = Object.entries(
    import.meta.glob('@/assets/images/card/*.{jpg,jpeg,png,webp,svg}', {
      eager: true,
      import: 'default'
    })
  ).filter(([path]) => /card_\d+\./i.test(path) && !/_detail\./i.test(path))

  return thumbEntries
    .map(([path, thumb]) => {
      const id = parseInt(path.match(/card_(\d+)/i)?.[1] ?? '0', 10)
      return { id, thumb }
    })
    .sort((a, b) => a.id - b.id)
}

const cards = loadCards()
const selectedCard = ref(null)
const gridWrapRef = ref(null)

const cardDetail = computed(() =>
  selectedCard.value ? getCardDetail(selectedCard.value.id) : null
)

const heroSrc = computed(() => {
  const level = cardDetail.value?.difficultyLevel ?? 'mid'
  return heroMap[level] ?? heroMid
})

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
$card-detail-area-h: 684px;
$card-detail-w: 1524px;
$card-detail-h: 464px;
$card-detail-edge: 40px;
$card-detail-back-gap: 40px;
$card-detail-back-w: 110px;
$card-detail-back-h: 44px;
$card-detail-img-w: 438px;
$card-detail-img-h: 288px;
$card-detail-identity-left: 148px;
$card-detail-identity-top: 54px;
$card-detail-expiry-left: 528px;
$card-detail-expiry-top: 54px;
$card-detail-scope-left: 148px;
$card-detail-scope-top: 218px;
$card-detail-difficulty-left: 528px;
$card-detail-difficulty-top: 218px;
$card-detail-benefits-left: 148px;
$card-detail-benefits-top: 382px;
$card-detail-benefits-w: 580px;
$greek-blue: #0655bc;
$detail-gray: #959595;

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
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $card-detail-back-gap;
    width: $card-module-w;
    height: $card-detail-area-h;
    padding-top: $card-module-pt;
    box-sizing: border-box;
  }

  &__detail-panel {
    position: relative;
    width: $card-detail-w;
    height: $card-detail-h;
    background: url('@/assets/images/card_detail/card_bg.svg') no-repeat center / 100% 100%;
    box-sizing: border-box;
    overflow: hidden;
  }

  &__card-img {
    position: absolute;
    right: 0;
    bottom: 0;
    width: $card-detail-img-w;
    height: $card-detail-img-h;
    object-fit: cover;
    user-select: none;
    pointer-events: none;
  }

  &__identity,
  &__expiry,
  &__scope,
  &__difficulty,
  &__benefits {
    position: absolute;
    margin: 0;
    font-family: 'Mengyuan Heiti W6', 'Mengyuan Heiti', sans-serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 1.45;
    color: $detail-gray;
  }

  &__identity {
    left: $card-detail-identity-left;
    top: $card-detail-identity-top;
  }

  &__expiry {
    left: $card-detail-expiry-left;
    top: $card-detail-expiry-top;
  }

  &__scope {
    left: $card-detail-scope-left;
    top: $card-detail-scope-top;
  }

  &__difficulty {
    left: $card-detail-difficulty-left;
    top: $card-detail-difficulty-top;
  }

  &__benefits {
    left: $card-detail-benefits-left;
    top: $card-detail-benefits-top;
    width: $card-detail-benefits-w;
  }

  &__back {
    align-self: flex-start;
    margin-left: ($card-module-w - $card-detail-w) / 2;
    width: $card-detail-back-w;
    height: $card-detail-back-h;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
  }

  &__back-icon {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    user-select: none;
    pointer-events: none;
  }

  &__detail-body {
    display: flex;
    align-items: stretch;
    height: 100%;
    padding:
      ($card-detail-edge + $card-detail-back-h + 24px)
      40px
      40px
      ($card-detail-edge + 8px);
    box-sizing: border-box;
    gap: 24px;
  }

  &__detail-meta {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    gap: 20px;
  }

  &__detail-col {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__detail-connector {
    flex: 0 0 auto;
    width: 24px;
    height: auto;
    align-self: center;
    object-fit: contain;
    pointer-events: none;
    user-select: none;
  }

  &__field {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    min-width: 0;

    &--wide {
      align-items: flex-start;
    }
  }

  &__field-icon {
    flex: 0 0 48px;
    width: 48px;
    height: 48px;
    object-fit: contain;
    user-select: none;
    pointer-events: none;
  }

  &__field-copy {
    flex: 1 1 0;
    min-width: 0;
  }

  &__field-label {
    margin: 0 0 4px;
    font-family: 'Mengyuan Heiti W14', 'Mengyuan Heiti', sans-serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 1.2;
    color: $greek-blue;
  }

  &__field-value {
    margin: 0;
    font-family: 'Mengyuan Heiti W6', 'Mengyuan Heiti', sans-serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 1.45;
    color: $detail-gray;
  }

  &__field-divider {
    display: block;
    width: 100%;
    height: auto;
    object-fit: contain;
    pointer-events: none;
    user-select: none;
  }

  &__detail-visual {
    flex: 0 0 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  &__detail-title {
    display: block;
    width: 100%;
    max-width: 280px;
    height: auto;
    object-fit: contain;
    user-select: none;
    pointer-events: none;
  }

  &__detail-hero {
    display: block;
    width: 100%;
    max-width: 280px;
    height: auto;
    object-fit: contain;
    user-select: none;
    pointer-events: none;
  }
}
</style>
