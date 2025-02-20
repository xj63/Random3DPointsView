# 3D Point Cloud Visualization

这是一个基于 Vue 3 和 Three.js 的 3D 点云可视化项目。它允许用户以交互式的方式查看和操作三维点云数据。

## 主要特性

- 3D 点云实时渲染
- 支持点云颜色映射（高度、距离、热力图、强度等）
- 交互式控制（旋转、缩放、平移）
- 自适应视图
- 响应式设计

## 技术栈

- Vue 3
- TypeScript
- Three.js
- OrbitControls

## 使用方法

将点云数据转换为指定格式的 Blob 对象后传入组件：

```typescript
interface PointData {
  position: [number, number, number]; // 点的坐标 [x, y, z]
  color: [number, number, number];    // 点的颜色 [r, g, b]
}
```

## 示例

```vue
<template>
    <ThreeDVisualization :blob="pointCloudData" />
</template>

<script setup lang="ts">
import ThreeDVisualization from '@/components/ThreeDVisualization.vue'
import type { PointData } from './types/PointData'
import { ref } from 'vue'
import { colorMaps } from './utils/colorUtils'

// 生成示例点云数据
const generatePointCloudData = (numPoints: number = 1000): PointData[] => {
  const points: PointData[] = []

  // 生成随机位置
  const positions = Array(numPoints)
    .fill(0)
    .map(() => {
      const pos = [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
      ]
      return pos
    })

  // 使用高度映射生成颜色
  positions.forEach((pos) => {
    points.push({
      position: pos as [number, number, number],
      color: colorMaps.heightColor(pos[1], -8, 8),
    })
  })

  return points
}

const pointCloudData = ref(
  new Blob([JSON.stringify(generatePointCloudData())], { type: 'application/json' }),
)
</script>
```

## 颜色映射

提供多种颜色映射方案：
- 高度映射（heightColor）
- 距离映射（distanceColor）
- 热力图（heatmapColor）
- 强度映射（intensityColor）
