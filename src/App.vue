<template>
  <main>
    <ThreeDVisualization :blob="pointCloudData" />
  </main>
</template>

<script setup lang="ts">
import ThreeDVisualization from '@/components/ThreeDVisualization.vue'
import { ref } from 'vue'

// 生成示例点云数据
const generatePointCloudData = (numPoints: number = 1000) => {
  const points = []
  for (let i = 0; i < numPoints; i++) {
    points.push([
      (Math.random() - 0.5) * 10, // x
      (Math.random() - 0.5) * 10, // y
      (Math.random() - 0.5) * 10, // z
    ])
  }
  return points
}

const pointCloudData = ref(
  new Blob([JSON.stringify(generatePointCloudData())], { type: 'application/json' }),
)
</script>

<style scoped></style>
