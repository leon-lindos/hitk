<template>
  <div class="inline-block align-middle" role="status" :aria-label="t('common.loading')">
    <ThinkingOrb state="working" :size="orbSize" :theme="color === 'white' ? 'dark' : 'auto'" />
    <span class="sr-only">{{ t('common.loading') }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ThinkingOrb from '@/hitk/ThinkingOrb.vue'

const { t } = useI18n()

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl'
type SpinnerColor = 'primary' | 'secondary' | 'white' | 'gray'

interface Props {
  size?: SpinnerSize
  color?: SpinnerColor
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary'
})

// HiTK: thinking orbs 的 working 球代替转圈
const orbSize = computed(() => ({ sm: 16, md: 32, lg: 48, xl: 64 })[props.size])
</script>

