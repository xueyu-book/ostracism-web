<template>
  <!-- 原位占位 -->
  <div
    ref="originRef"
    class="totem totem--origin"
    :class="{ 'totem--placeholder': isDragging, 'totem--hidden': hidden }"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <div class="totem__icon" />
    <span class="totem__label">图腾</span>
  </div>

  <!-- 拖拽跟随层：挂到 body，避免被遮挡 -->
  <Teleport to="body">
    <div
      v-show="isDragging"
      ref="ghostRef"
      class="totem totem--floating"
      :style="ghostStyle"
    >
      <div class="totem__icon" />
      <span class="totem__label">拖拽至中央</span>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  hidden: {
    type: Boolean,
    default: false
  },
  dropTargetRef: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['drag-start', 'drop-success', 'drop-fail'])

const ghostRef = ref(null)
const originRef = ref(null)
const isDragging = ref(false)

const ghostStyle = reactive({
  left: '0px',
  top: '0px',
  width: 'auto'
})

let startX = 0
let startY = 0
let originX = 0
let originY = 0
let ghostWidth = 0
let activePointerId = null
let pulseTween = null

onMounted(() => {
  if (originRef.value) {
    pulseTween = gsap.to(originRef.value, {
      opacity: 0.55,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    })
  }
})

onBeforeUnmount(() => {
  pulseTween?.kill()
  removeListeners()
})

function resolveHeroComponent() {
  const raw = props.dropTargetRef
  if (!raw) return null
  if (raw.$) return raw
  if (typeof raw === 'object' && 'value' in raw) {
    return raw.value ?? null
  }
  return raw
}

function resolveDomRef(refLike) {
  if (!refLike) return null
  if (refLike instanceof HTMLElement) return refLike
  return refLike.value ?? null
}

function getDropZoneElement() {
  const component = resolveHeroComponent()
  if (!component) return null

  return (
    resolveDomRef(component.dropZoneRef) ||
    resolveDomRef(component.heroRef) ||
    resolveDomRef(component.hintRef)
  )
}

function isInDropZone(dragEl, zoneEl) {
  const dragRect = dragEl.getBoundingClientRect()
  const zoneRect = zoneEl.getBoundingClientRect()

  const centerX = dragRect.left + dragRect.width / 2
  const centerY = dragRect.top + dragRect.height / 2
  const pad = 48

  return (
    centerX >= zoneRect.left - pad &&
    centerX <= zoneRect.right + pad &&
    centerY >= zoneRect.top - pad &&
    centerY <= zoneRect.bottom + pad
  )
}

function updateGhostPosition(clientX, clientY) {
  const dx = clientX - startX
  const dy = clientY - startY
  ghostStyle.left = `${originX + dx}px`
  ghostStyle.top = `${originY + dy}px`
}

function onPointerDown(e) {
  if (props.hidden || isDragging.value) return

  const el = e.currentTarget
  e.preventDefault()
  isDragging.value = true
  activePointerId = e.pointerId
  pulseTween?.pause()

  const rect = el.getBoundingClientRect()
  startX = e.clientX
  startY = e.clientY
  originX = rect.left
  originY = rect.top
  ghostWidth = rect.width

  ghostStyle.left = `${originX}px`
  ghostStyle.top = `${originY}px`
  ghostStyle.width = `${ghostWidth}px`

  el.setPointerCapture(e.pointerId)
  emit('drag-start')
  addListeners()
}

function onPointerMove(e) {
  if (!isDragging.value || e.pointerId !== activePointerId) return
  updateGhostPosition(e.clientX, e.clientY)
}

function onPointerUp(e) {
  if (!isDragging.value || e.pointerId !== activePointerId) return

  const el = e.currentTarget
  activePointerId = null
  removeListeners()

  if (el.hasPointerCapture?.(e.pointerId)) {
    el.releasePointerCapture(e.pointerId)
  }

  const dropZone = getDropZoneElement()
  const ghostEl = ghostRef.value

  if (dropZone && ghostEl && isInDropZone(ghostEl, dropZone)) {
    gsap.to(ghostEl, {
      opacity: 0,
      scale: 0.5,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        isDragging.value = false
        gsap.set(ghostEl, { opacity: 1, scale: 1.12 })
      }
    })
    emit('drop-success')
    return
  }

  isDragging.value = false
  if (ghostEl) {
    gsap.set(ghostEl, { opacity: 1, scale: 1.12 })
  }
  pulseTween?.restart()
  emit('drop-fail')
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

defineExpose({ ghostRef })
</script>

<style lang="scss" scoped>
.totem {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  touch-action: none;
  user-select: none;

  &--origin {
    cursor: grab;
    will-change: opacity;

    &:active {
      cursor: grabbing;
    }
  }

  &--placeholder {
    opacity: 0.25;
    pointer-events: none;
  }

  &--hidden {
    visibility: hidden;
    pointer-events: none;
  }

  &--floating {
    position: fixed;
    z-index: 9999;
    cursor: grabbing;
    opacity: 1;
    transform: scale(1.12);
    filter: drop-shadow(0 8px 24px rgba($color-greek-blue, 0.55));

    .totem__icon {
      border-color: rgba(255, 255, 255, 0.55);
      box-shadow:
        0 0 0 3px rgba($color-greek-blue, 0.25),
        0 8px 20px rgba($color-greek-blue, 0.45);
    }

    .totem__label {
      color: $color-greek-blue;
      font-weight: 600;
      opacity: 1;
    }
  }

  &__icon {
    width: 48px;
    height: 56px;
    background: $color-greek-blue;
    border-radius: 50% 50% 35% 35% / 55% 55% 45% 45%;
    box-shadow: 0 4px 12px rgba($color-greek-blue, 0.4);
    border: 2px solid rgba(255, 255, 255, 0.2);
  }

  &__label {
    font-size: 11px;
    color: rgba($color-greek-blue, 0.7);
    letter-spacing: 0.1em;
    white-space: nowrap;
  }
}
</style>
