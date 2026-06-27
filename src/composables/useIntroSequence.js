import { ref, computed } from 'vue'

/** @typedef {'idle'|'dragging'|'dropped'|'transition'|'main'} IntroPhase */

export function useIntroSequence() {
  /** @type {import('vue').Ref<IntroPhase>} */
  const phase = ref('idle')
  const isTransitionComplete = ref(false)

  const showHero = computed(() => ['idle', 'dragging', 'dropped'].includes(phase.value))
  const showTotem = computed(() => ['idle', 'dragging'].includes(phase.value))
  const showDropHint = computed(() => ['idle', 'dragging'].includes(phase.value))
  const highlightDropZone = computed(() => phase.value === 'dragging')
  const isTransitioning = computed(() => phase.value === 'transition')
  const showMainSite = computed(() => phase.value === 'main')

  function startDrag() {
    if (phase.value === 'idle') {
      phase.value = 'dragging'
    }
  }

  function onTotemDropped() {
    if (phase.value !== 'dragging' && phase.value !== 'idle') return
    phase.value = 'dropped'
  }

  function startTransition() {
    phase.value = 'transition'
  }

  function completeTransition() {
    isTransitionComplete.value = true
    phase.value = 'main'
  }

  function skipIntro() {
    isTransitionComplete.value = true
    phase.value = 'main'
  }

  return {
    phase,
    isTransitionComplete,
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
  }
}
