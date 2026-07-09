<template>
  <section class="card-module">
    <div v-show="!selectedCard" ref="gridWrapRef" class="card-module__grid-wrap">
      <div class="card-module__grid">
        <button
          v-for="(card, index) in cards"
          :key="card.id"
          type="button"
          class="card-module__item"
          :class="{ 'card-module__item--revealed': cardsRevealed }"
          :style="getCardItemStyle(index)"
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
        <div
          class="card-module__detail-panel"
          :style="cardDetailPanelStyle"
        >
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
import { ref, computed, watch, onBeforeUnmount, nextTick } from 'vue'
import { getCardDetail } from '@/content/cardDetailContent'
import cardBg1to50 from '@/assets/images/card_detail/card_bg__1-50.svg'
import cardBg51to80 from '@/assets/images/card_detail/card_bg__51-80.svg'
import cardBg81to90 from '@/assets/images/card_detail/card_bg__81-90.svg'

const props = defineProps({
  contentVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['scroll-sync'])

const CARD_REVEAL_STAGGER_ROW_MS = 55
const CARD_REVEAL_STAGGER_COL_MS = 30
const CARD_GRID_COLUMNS = 5

function getCardItemStyle(index) {
  const row = Math.floor(index / CARD_GRID_COLUMNS)
  const col = index % CARD_GRID_COLUMNS

  return {
    '--card-reveal-delay': `${row * CARD_REVEAL_STAGGER_ROW_MS + col * CARD_REVEAL_STAGGER_COL_MS}ms`
  }
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
const cardsRevealed = ref(false)

const cardDetail = computed(() =>
  selectedCard.value ? getCardDetail(selectedCard.value.id) : null
)

function getCardDetailBg(cardId) {
  if (cardId <= 50) return cardBg1to50
  if (cardId <= 80) return cardBg51to80
  return cardBg81to90
}

const cardDetailPanelStyle = computed(() => ({
  backgroundImage: `url('${getCardDetailBg(selectedCard.value?.id ?? 1)}')`
}))

let scrollTarget = null
let revealFrame = null

function resetCardsReveal() {
  cardsRevealed.value = false

  if (revealFrame) {
    cancelAnimationFrame(revealFrame)
    revealFrame = null
  }
}

function triggerCardsReveal() {
  resetCardsReveal()

  nextTick(() => {
    revealFrame = requestAnimationFrame(() => {
      revealFrame = requestAnimationFrame(() => {
        cardsRevealed.value = true
        revealFrame = null
      })
    })
  })
}

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
  triggerCardsReveal()

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
      resetCardsReveal()
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  teardownGridScroll()
  resetCardsReveal()
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
$card-detail-offset-x: ($card-module-w - $card-detail-w) * 0.5;
$card-detail-edge: 40px;
$card-detail-back-gap: 40px;
$card-detail-back-w: 124px;
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
$card-reveal-duration: 0.75s;
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
    padding: 0;
    border: none;
    border-radius: 10px;
    background: none;
    cursor: pointer;
    overflow: hidden;
    flex-shrink: 0;
    opacity: 0;
    transform: translateX(-14px) scale(0.92);
    transition:
      opacity $card-reveal-duration ease-out,
      transform $card-reveal-duration cubic-bezier(0.22, 1, 0.36, 1);
    transition-delay: var(--card-reveal-delay, 0ms), var(--card-reveal-delay, 0ms);

    &--revealed {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
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
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
    box-sizing: border-box;
    overflow: hidden;
  }

  &__card-img {
    position: absolute;
    right: 0;
    bottom: 0;
    width: $card-detail-img-w;
    object-fit: cover;
    border-radius: 14px;
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
    white-space: pre-line;
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
    margin-left: $card-detail-offset-x;
    width: $card-detail-back-w;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
  }

  &__back-icon {
    display: block;
    width: 100%;
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
