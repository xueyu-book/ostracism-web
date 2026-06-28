<template>
  <section class="rule-module">
    <p class="rule-module__title">规则问题</p>
  </section>
</template>

<style lang="scss" scoped>
$greek-blue: #0655bc;

.rule-module {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;

  &__title {
    font-family: 'Mengyuan Heiti', sans-serif;
    font-size: 36px;
    font-weight: 500;
    color: $greek-blue;
    letter-spacing: 0.12em;
  }
}
</style>
