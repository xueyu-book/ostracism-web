<template>
  <section class="project-module">
    <div class="project-module__frame">
      <div class="project-module__line project-module__line--left" aria-hidden="true" />
      <div class="project-module__line project-module__line--right" aria-hidden="true" />

      <img
        class="project-module__deco project-module__deco--tl-1"
        src="@/assets/images/nav_pillar/project/left_icon_top_1.svg"
        alt=""
      />
      <img
        class="project-module__deco project-module__deco--tl-2"
        src="@/assets/images/nav_pillar/project/left_icon_top_2.svg"
        alt=""
      />
      <img
        class="project-module__deco project-module__deco--tr-1"
        src="@/assets/images/nav_pillar/project/right_icon_top_1.svg"
        alt=""
      />
      <img
        class="project-module__deco project-module__deco--tr-2"
        src="@/assets/images/nav_pillar/project/right_icon_top_2.svg"
        alt=""
      />
      <img
        class="project-module__deco project-module__deco--bl-1"
        src="@/assets/images/nav_pillar/project/left_icon_bottom_1.svg"
        alt=""
      />
      <img
        class="project-module__deco project-module__deco--bl-2"
        src="@/assets/images/nav_pillar/project/left_icon_bottom_2.svg"
        alt=""
      />
      <img
        class="project-module__deco project-module__deco--br-1"
        src="@/assets/images/nav_pillar/project/right_icon_bottom_1.svg"
        alt=""
      />
      <img
        class="project-module__deco project-module__deco--br-2"
        src="@/assets/images/nav_pillar/project/right_icon_bottom_2.svg"
        alt=""
      />

      <div class="project-module__scroll">
        <img
          class="project-module__header-logo"
          src="@/assets/images/nav_pillar/project/page_log.svg"
          alt=""
        />

        <header class="project-module__header">
          <h2 class="project-module__title-en">{{ projectHero.titleEn }}</h2>
          <p class="project-module__title-cn">{{ projectHero.titleCn }}</p>
        </header>

        <div class="project-module__body">
          <p
            v-for="(paragraph, index) in projectParagraphs"
            :key="`project-paragraph-${index}`"
            class="project-module__paragraph"
            :class="{ 'project-module__paragraph--lead': index === 0 }"
          >
            {{ paragraph }}
          </p>
        </div>

        <footer class="project-module__closing">
          <p class="project-module__paragraph">{{ projectClosing.intro }}</p>
          <p class="project-module__quote">{{ projectClosing.quote }}</p>
          <p class="project-module__tagline">{{ projectClosing.tagline }}</p>
        </footer>
      </div>

      <div class="project-module__side-icon project-module__side-icon--left" aria-hidden="true">
        <img
          class="project-module__side-icon-img"
          src="@/assets/images/nav_pillar/project/icon.svg"
          alt=""
        />
      </div>
      <div class="project-module__side-icon project-module__side-icon--right" aria-hidden="true">
        <img
          class="project-module__side-icon-img"
          src="@/assets/images/nav_pillar/project/icon.svg"
          alt=""
        />
      </div>

      <img
        class="project-module__footer-title"
        src="@/assets/images/nav_pillar/project/footer_title.svg"
        alt="Ostracism"
      />
    </div>
  </section>
</template>

<script setup>
import { projectHero, projectParagraphs, projectClosing } from '@/content/projectContent'
</script>

<style lang="scss" scoped>
$project-module-w: 1612px;
$project-module-pt: 40px;
$project-module-pb: 40px;
$project-module-px: 12px;
$project-line-w: 15px;
$project-line-tile-h: 562px;
$project-line-inset: 114px;
$project-side-icon-w: 44px;
$project-side-icon-h: 100px;
$project-side-icon-col-w: 136px;
$project-side-icon-left: -56px;
$project-side-icon-right: -56px;
$project-deco-edge-w: 406px;
$project-deco-edge-h: 120px;
$project-deco-edge-offset: -5px;
$project-footer-title-h: 96px;
$project-footer-title-bottom: 30px;
$project-body-footer-gap: 260px;
$project-paragraph-gap: 25px;
$greek-blue: #0655bc;
$text-color: #959595;

.project-module {
  width: $project-module-w;
  height: 100%;
  min-height: 0;
  padding: $project-module-pt $project-module-px $project-module-pb;
  box-sizing: border-box;
  pointer-events: auto;
  overflow-x: visible;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  &__frame {
    position: relative;
    width: 100%;
    height: auto;
    box-sizing: border-box;
    overflow: visible;
    isolation: isolate;
  }

  &__deco {
    position: absolute;
    z-index: 1;
    display: block;
    pointer-events: none;
    user-select: none;

    &--tl-1 {
      top: $project-deco-edge-offset;
      left: 0;
      width: $project-deco-edge-w;
      height: $project-deco-edge-h;
    }

    &--tl-2 {
      top: 210px;
      left: 136px;
      width: 40px;
      height: 40px;
    }

    &--tr-1 {
      top: $project-deco-edge-offset;
      right: 0;
      width: $project-deco-edge-w;
      height: $project-deco-edge-h;
    }

    &--tr-2 {
      top: 210px;
      right: 136px;
      width: 40px;
      height: 40px;
    }

    &--bl-1 {
      bottom: $project-deco-edge-offset;
      left: 0;
      width: $project-deco-edge-w;
      height: $project-deco-edge-h;
    }

    &--bl-2 {
      bottom: 210px;
      left: 136px;
      width: 40px;
      height: 40px;
    }

    &--br-1 {
      bottom: $project-deco-edge-offset;
      right: 0;
      width: $project-deco-edge-w;
      height: $project-deco-edge-h;
    }

    &--br-2 {
      bottom: 210px;
      right: 136px;
      width: 40px;
      height: 40px;
    }
  }

  &__line {
    position: absolute;
    z-index: 0;
    top: $project-line-inset;
    bottom: $project-line-inset;
    width: $project-line-w;
    background-repeat: repeat-y;
    background-size: $project-line-w $project-line-tile-h;
    pointer-events: none;
    user-select: none;

    &--left {
      left: 0;
      background-image: url('@/assets/images/nav_pillar/project/left_line.svg');
      background-position: top left;
    }

    &--right {
      right: 0;
      background-image: url('@/assets/images/nav_pillar/project/right_line.svg');
      background-position: top right;
    }
  }

  &__side-icon {
    position: absolute;
    z-index: 4;
    top: $project-line-inset;
    bottom: $project-line-inset;
    width: $project-side-icon-col-w;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    user-select: none;

    &--left {
      left: $project-side-icon-left;
    }

    &--right {
      right: $project-side-icon-right;
    }
  }

  &__side-icon-img {
    display: block;
    width: $project-side-icon-w;
    height: $project-side-icon-h;
    object-fit: contain;
  }

  &__scroll {
    position: relative;
    z-index: 1;
    padding: 36px 96px ($project-body-footer-gap + $project-footer-title-h + $project-footer-title-bottom);
    box-sizing: border-box;
  }

  &__header-logo {
    display: block;
    width: 565px;
    max-width: 100%;
    height: auto;
    margin: 0 auto 20px;
    user-select: none;
    pointer-events: none;
  }

  &__header {
    margin-bottom: 40px;
    text-align: center;
  }

  &__title-en {
    margin: 0;
    font-family: 'Norse', serif;
    font-size: 72px;
    font-weight: 700;
    line-height: 0.95;
    letter-spacing: 0.04em;
    color: $greek-blue;
    text-transform: uppercase;
  }

  &__title-cn {
    margin: 10px 0 0;
    font-family: 'Mengyuan Heiti W14', 'Mengyuan Heiti', sans-serif;
    font-size: 36px;
    font-weight: 400;
    line-height: 1.2;
    letter-spacing: 0.08em;
    color: $greek-blue;
  }

  &__body {
    max-width: 1180px;
    margin: 0 auto;
  }

  &__paragraph {
    margin: 0;
    font-family: 'Mengyuan Heiti W6', 'Mengyuan Heiti', sans-serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 1.45;
    color: $text-color;
    text-align: left;
    text-indent: 2em;

    &--lead {
      font-family: 'Mengyuan Heiti W14', 'Mengyuan Heiti', sans-serif;
    }

    & + & {
      margin-top: $project-paragraph-gap;
    }
  }

  &__closing {
    max-width: 1180px;
    margin: 28px auto 0;
  }

  &__quote {
    margin: 20px 0 0;
    font-family: 'Mengyuan Heiti W6', 'Mengyuan Heiti', sans-serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 1.45;
    color: $text-color;
  }

  &__tagline {
    margin: 20px 0 0;
    font-family: 'Mengyuan Heiti W6', 'Mengyuan Heiti', sans-serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 1.45;
    color: $text-color;
  }

  &__footer-title {
    position: absolute;
    left: 50%;
    bottom: $project-footer-title-bottom;
    z-index: 3;
    display: block;
    width: 408px;
    height: $project-footer-title-h;
    transform: translateX(-50%);
    user-select: none;
    pointer-events: none;
  }
}
</style>
