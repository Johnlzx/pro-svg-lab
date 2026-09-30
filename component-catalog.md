# 可复用组件：ContourSpectrum

用途：为粗体标题、章标和封闭图形生成沿轮廓分布、随灰度扫描变化的材质。适合单个标志或短标题。

输入：`SVGMaterial.create(options)`，返回独立 SVG 字符串。

| 参数 | 默认 | 含义 |
|---|---|---|
| id | pro | 同一文档内必须唯一的资源前缀 |
| blur | 7.3 | 最后一次高斯模糊，单位为 SVG 用户坐标 |
| grain | 0.12 | 细颗粒幅度，0 关闭 |
| period | 4.4 | 主循环秒数 |
| palette | original | original / silver / lava / violet |
| stage | 5 | 0–5 显示到哪个处理阶段 |
| warp | 0 | 新增低频噪声位移幅度 |
| light | 0 | 新增镜面光照强度 |
| intro | true | 单次白色渐变揭示 |

时间契约：主扫描线性平移一个完整重复周期，持续循环；首次揭示持续 period−0.01 秒并冻结终值。扩展噪声和光照以主周期的两倍循环。

渲染：SVG path + filter primitives + SMIL；不需要绘帧脚本。实验室的 JS 负责参数编辑、原生 SVG 时间控制和导出。

注意：当前路径坐标按 337×129 设计。更换几何尺寸应一起调整滤镜区域、模糊尺度、渐变长度和旋转中心。颜色表依赖 sRGB 空间。默认白底参与后处理。

证据：`evidence/pipeline.png`、`evidence/materials.png`、`evidence/frame-comparison.png`。已做到机制与材质风格复现，不主张原视频的像素一致。
