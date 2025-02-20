<template>
  <div ref="containerRef" class="three-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// 定义props
interface Props {
  blob: Blob
}

const props = defineProps<Props>()

// refs
const containerRef = ref<HTMLElement | null>(null)

// three.js 相关变量
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let points: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>
let controls: OrbitControls

// 初始化three.js场景
const initThreeScene = () => {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)

  const container = containerRef.value!
  camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000,
  )
  camera.position.z = 5

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.screenSpacePanning = false
  controls.maxPolarAngle = Math.PI // 限制垂直旋转
  controls.minDistance = 1 // 最小缩放距离
  controls.maxDistance = 100 // 最大缩放距离
}

// 创建点云
const createPointCloud = async () => {
  try {
    // 从blob中读取点云数据
    const data = await props.blob.text()
    const pointsData = JSON.parse(data) // 假设数据格式为 [[x1,y1,z1], [x2,y2,z2], ...]

    // 创建顶点几何体
    const geometry = new THREE.BufferGeometry()

    // 将点数据转换为Float32Array
    const positions = new Float32Array(pointsData.flat())

    // 设置位置属性
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    // 为每个点创建颜色
    const colors = new Float32Array(pointsData.length * 3)
    for (let i = 0; i < pointsData.length; i++) {
      // 这里可以根据点的位置或其他属性设置不同的颜色
      colors[i * 3] = 0.5 // R
      colors[i * 3 + 1] = 0.8 // G
      colors[i * 3 + 2] = 1.0 // B
    }
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    // 创建点材质
    const material = new THREE.PointsMaterial({
      size: 0.05, // 点的大小
      vertexColors: true, // 使用顶点颜色
      sizeAttenuation: true, // 近大远小
      transparent: true,
      opacity: 0.8,
    })

    // 如果已存在点云则移除
    if (points) {
      scene.remove(points)
      points.geometry.dispose()
      points.material.dispose()
    }

    // 创建点云对象
    points = new THREE.Points(geometry, material)
    scene.add(points)

    // 自动调整相机位置以适应点云
    const box = new THREE.Box3().setFromObject(points)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const fov = camera.fov * (Math.PI / 180)
    const cameraZ = Math.abs(maxDim / Math.sin(fov / 2))

    camera.position.z = cameraZ * 1.5
    camera.lookAt(center)
    controls.target.copy(center)
  } catch (error) {
    console.error('Error creating point cloud:', error)
  }
}

// 动画循环
const animate = () => {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

// 处理窗口大小变化
const onWindowResize = () => {
  const container = containerRef.value!
  camera.aspect = container.clientWidth / container.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.clientWidth, container.clientHeight)
}

// 清理函数
const cleanup = () => {
  window.removeEventListener('resize', onWindowResize)

  if (containerRef.value) {
    containerRef.value.removeChild(renderer.domElement)
  }

  if (points) {
    scene.remove(points)
    points.geometry.dispose()
    points.material.dispose()
  }

  renderer.dispose()
}

// 监听blob变化
watch(
  () => props.blob,
  async () => {
    await createPointCloud()
  },
  { deep: true },
)

// 生命周期钩子
onMounted(async () => {
  initThreeScene()
  await createPointCloud()
  animate()
  window.addEventListener('resize', onWindowResize)
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.three-container {
  width: 100%;
  height: 100vh;
  background: #000;
}
</style>
