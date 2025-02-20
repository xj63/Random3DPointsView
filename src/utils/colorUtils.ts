export const colorMaps = {
  // 根据高度映射颜色
  heightColor: (height: number, minHeight: number, maxHeight: number): [number, number, number] => {
    const t = (height - minHeight) / (maxHeight - minHeight)
    return [t, 0.5, 1 - t] // 从蓝色过渡到红色
  },

  // 根据距离映射颜色
  distanceColor: (distance: number, maxDistance: number): [number, number, number] => {
    const t = distance / maxDistance
    return [t, 1 - t, 0] // 从绿色过渡到红色
  },

  // 热力图颜色
  heatmapColor: (value: number): [number, number, number] => {
    // 实现热力图颜色映射
    return [value, 0, 1 - value]
  },

  // 根据强度映射颜色
  intensityColor: (
    intensity: number,
    minIntensity: number,
    maxIntensity: number,
  ): [number, number, number] => {
    const t = (intensity - minIntensity) / (maxIntensity - minIntensity)
    return [t, t, t] // 灰度
  },
}
