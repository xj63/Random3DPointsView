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
    // 生成随机位置
    const x = (Math.random() - 0.5) * 10
    const y = (Math.random() - 0.5) * 10
    const z = (Math.random() - 0.5) * 10

    // 根据位置生成颜色（这只是一个示例，你可以使用任何颜色映射方案）
    const r = Math.abs(x / 10) // 根据x位置决定红色分量
    const g = Math.abs(y / 10) // 根据y位置决定绿色分量
    const b = Math.abs(z / 10) // 根据z位置决定蓝色分量

    points.push({
      position: [x, y, z],
      color: [r, g, b],
    })
  }
  return points
}

const pointCloudData = ref(
  new Blob([JSON.stringify(generatePointCloudData())], { type: 'application/json' }),
)
</script>

<style scoped></style>
