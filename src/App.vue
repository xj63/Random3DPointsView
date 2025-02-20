<template>
  <main>
    <div v-if="!pointCloudData" class="loading">Loading...</div>
    <ThreeDVisualization v-else :blob="pointCloudData" />
  </main>
</template>

<script setup lang="ts">
import ThreeDVisualization from '@/components/ThreeDVisualization.vue'
import type { PointData } from './types/PointData'
import { ref } from 'vue'
import { colorMaps } from './utils/colorUtils'

async function generatePointCloudData(): Promise<Blob> {
  // 获取当前路由路径
  const path = window.location.pathname
  const name = path.split('/')[1] // 获取第一个路径段
  // 如果是 random 或 cube
  if (name === 'random' || name === 'cube') {
    const { randomPointCloudData } = await import('./utils/randomPoint')
    return new Blob([JSON.stringify(randomPointCloudData())], { type: 'application/json' })
  }

  try {
    const response = await fetch(`/data/${name}.3dp.json`)
    // 尝试解析 JSON
    const data = await response.json()

    // 如果能成功解析为 JSON，则返回新的 Blob
    return new Blob([JSON.stringify(data)], { type: 'application/json' })
  } catch (error) {
    console.error('Error loading point cloud data:', error)
    // 解析失败时返回随机点云
    const { randomPointCloudData } = await import('./utils/randomPoint')
    return new Blob([JSON.stringify(randomPointCloudData())], { type: 'application/json' })
  }
}

const pointCloudData = ref()
generatePointCloudData().then((p) => (pointCloudData.value = p))
</script>

<style scoped>
.loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  color: white;
}
</style>
