<template>
  <section class="rule-module">
    <div class="rule-module__columns">
      <article class="rule-module__column">
        <header class="rule-module__header">
          <h2 class="rule-module__title">
            <span class="rule-module__title-en">{{ ruleSections.titleEn }}</span>
            <span class="rule-module__title-cn">
              <span
                v-for="(line, lineIndex) in splitTitleCn(ruleSections.titleCn)"
                :key="`rule-title-cn-${lineIndex}`"
                class="rule-module__title-cn-line"
              >{{ line }}</span>
            </span>
          </h2>
          <div class="rule-module__divider" aria-hidden="true" />
        </header>

        <div class="rule-module__column-scroll">
          <div
            v-for="(item, index) in ruleSections.items"
            :key="`rule-${index}`"
            class="rule-module__block"
          >
            <h3 class="rule-module__block-title">{{ item.title }}</h3>
            <p class="rule-module__block-text">{{ item.text }}</p>
          </div>
        </div>
      </article>

      <article class="rule-module__column">
        <header class="rule-module__header">
          <h2 class="rule-module__title">
            <span class="rule-module__title-en">{{ faqSections.titleEn }}</span>
            <span class="rule-module__title-cn">
              <span
                v-for="(line, lineIndex) in splitTitleCn(faqSections.titleCn)"
                :key="`faq-title-cn-${lineIndex}`"
                class="rule-module__title-cn-line"
              >{{ line }}</span>
            </span>
          </h2>
          <div class="rule-module__divider" aria-hidden="true" />
        </header>

        <div class="rule-module__column-scroll">
          <div
            v-for="(item, index) in faqSections.items"
            :key="`faq-${index}`"
            class="rule-module__block"
          >
            <p class="rule-module__question">{{ item.question }}</p>
            <p class="rule-module__answer">{{ item.answer }}</p>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ruleSections, faqSections } from '@/content/ruleContent'

function splitTitleCn(text) {
  const lines = []
  for (let i = 0; i < text.length; i += 2) {
    lines.push(text.slice(i, i + 2))
  }
  return lines
}
</script>

<style lang="scss" scoped>
$rule-module-w: 1500px;
$rule-module-pt: 40px;
$rule-module-pb: 40px;
$greek-blue: #0655bc;
$text-black: #959595;

.rule-module {
  width: $rule-module-w;
  height: 100%;
  padding: $rule-module-pt 0 $rule-module-pb;
  box-sizing: border-box;
  pointer-events: auto;

  &__columns {
    display: flex;
    gap: 80px;
    height: 100%;
    min-height: 0;
  }

  &__column {
    flex: 1;
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  &__header {
    flex-shrink: 0;
    margin-bottom: 28px;
  }

  &__column-scroll {
    flex: 1;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
    line-height: 1.2;
  }

  &__title-en {
    font-family: 'Norse', serif;
    font-size: 36px;
    font-weight: 700;
    color: $greek-blue;
    letter-spacing: 0.04em;
  }

  &__title-cn {
    display: flex;
    flex-direction: column;
    font-family: 'Mengyuan Heiti W14', 'Mengyuan Heiti', sans-serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 1.1;
    color: $greek-blue;
    letter-spacing: 0.08em;
  }

  &__title-cn-line {
    display: block;
  }

  &__divider {
    height: 20px;
    margin-top: 12px;
    background: $greek-blue;
  }

  &__block {
    & + & {
      margin-top: 24px;
    }
  }

  &__block-title,
  &__question {
    margin: 0 0 8px;
    font-family: 'Mengyuan Heiti W14', 'Mengyuan Heiti', sans-serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 1.4;
    color: $greek-blue;
  }

  &__block-text,
  &__answer {
    margin: 0;
    font-family: 'Mengyuan Heiti W6', 'Mengyuan Heiti', sans-serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 1.5;
    color: $text-black;
    white-space: pre-wrap;
  }
}
</style>
