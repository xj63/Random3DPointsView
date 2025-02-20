import type { PointData } from '@/types/PointData'
import { colorMaps } from './colorUtils'

// 生成示例点云数据
export const randomPointCloudData = (numPoints: number = 1000): PointData[] => {
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
