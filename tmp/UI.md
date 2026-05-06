## 碳足迹追踪应用 UI/UX 设计说明

这款应用的核心目标不是单纯记录用户每天产生了多少碳排放，而是通过清晰、温和、持续的视觉反馈，让用户逐渐理解自己的生活方式与环境影响之间的关系。整体 UI/UX 应该避免“惩罚感”和“负罪感”，而是采用鼓励式、教育式、游戏化的体验，让用户在交通、饮食、能源、购物、旅行等日常场景中，以最少操作完成记录，并获得可理解、可行动的环保建议。

从产品气质上看，应用应当呈现一种“现代、干净、自然、可信”的感觉。视觉语言可以结合自然元素与数字化数据仪表盘：浅绿色、森林绿、雾蓝、暖白、泥土棕可以作为主色系统，同时加入少量高亮色，例如柠檬黄或薄荷绿，用于成就、提醒和积极反馈。背景不应过度花哨，可以使用柔和渐变、微弱纹理、半透明卡片、圆角模块与轻量阴影，形成接近 iOS 现代卡片式界面和 Android Material 风格之间的平衡。

技术上，这个项目基于 Expo 和 React Native，因此设计系统需要从一开始就考虑跨平台一致性。Expo 官方将其定位为用于构建 React Native 应用的完整框架，支持用一个 JavaScript/TypeScript 项目构建 iOS、Android 和 Web 应用，这非常适合这种需要长期迭代的生活方式类产品。([Expo Documentation][1])

## 信息架构与核心导航

底部 Tab 导航建议设置为五个主要入口：Home、Log、Insights、Goals、Profile。Home 是每日概览页，显示今日碳排放、剩余目标额度、主要来源和快速记录入口。Log 页面用于添加交通、饮食、能源、购物等行为。Insights 页面负责数据可视化，例如周趋势、月趋势、类别占比、与上周相比的变化。Goals 页面展示用户的减排目标、连续打卡、徽章和建议任务。Profile 页面包含单位设置、地区、电力因子、隐私、数据导出和通知设置。

首页应该是用户最常打开的页面，因此设计必须非常直观。顶部可以显示一句动态问候，例如“今天你的碳足迹比昨天低 12%”。中间放置一个圆形或半圆形碳预算进度环，显示今日 CO₂e 数值。进度环不应该只用红绿表达好坏，因为这对色盲用户不友好；应同时使用图标、文字、比例和状态标签。下面用 3 到 4 张卡片展示主要排放来源，例如交通 42%、饮食 28%、家庭能源 18%、购物 12%。每张卡片都可以点击进入细节。

## Onboarding 体验

首次进入应用时，不要让用户马上填写复杂表单。Onboarding 应分成 4 到 5 个轻量步骤：选择国家/地区、选择常用交通方式、饮食习惯、家庭能源类型、个人目标。每一步只呈现一个主题，使用大图标、简短说明和滑动交互。例如饮食习惯可以用卡片选择：“植物为主”“混合饮食”“肉类较多”。交通方式可以展示地铁、公交、汽车、自行车、步行、电动车等图标。

Onboarding 的核心不是收集所有数据，而是建立初始估算模型。用户完成后，应用生成一个“你的初始碳画像”，例如“你的主要排放可能来自交通和饮食”。这个结果页应该非常视觉化，可以使用柔和动画显示树叶、生长的圆环或逐渐填充的地球图标。此处适合使用 Lottie 动画作为轻量插画，也可以在重要数据图形上使用 React Native Skia 实现自定义图表。React Native Skia 官方定位是 React Native 的高性能 2D 图形方案，适合做复杂图形、进度环、能量流动图和高级数据可视化。([Shopify][2])

## 视觉系统

整体布局应采用卡片式设计。每个模块都像一个独立的信息单元，圆角建议在 20–28px 之间，内边距保持宽松，文字层级清晰。标题使用较粗字体，正文使用中等灰度，数据数字使用更大的字号突出。例如“今日排放 8.4 kg CO₂e”中的 8.4 应成为视觉焦点，而单位和解释说明放在次级层级。

颜色系统可以这样定义：

主色：Forest Green，用于主要按钮、完成状态、正向反馈。
辅助色：Sky Blue，用于交通、空气、旅行相关模块。
警示色：Warm Amber，用于目标接近上限时的提醒。
危险色：Soft Coral，用于明显超标，但避免过于刺眼。
背景色：Off White / Deep Navy，分别适配浅色模式和深色模式。
卡片色：浅色模式使用白色半透明，深色模式使用深灰蓝半透明。

字体方面，iOS 端应尽量贴近 San Francisco 的系统质感，Android 端保持 Material 风格。React Native 中可直接使用系统字体，避免过多自定义字体造成性能和包体积问题。标题、数字和标签需要形成明确层级：例如 32px 用于核心数据，20–24px 用于页面标题，16px 用于卡片标题，13–14px 用于说明文字。

## 动效设计

动效应服务于理解，而不是为了炫技。碳足迹应用中最重要的动效包括：数据变化动画、记录成功反馈、进度环更新、卡片进入动画、图表切换动画、目标达成庆祝动画。React Native Reanimated 官方说明其动画可以在 UI 线程上运行，用于实现流畅交互；Expo 当前也直接提供 Reanimated SDK 文档与内置版本说明，因此它应作为核心动画库。([docs.swmansion.com][3])

例如，用户添加一次“开车 12 km”记录后，首页的 CO₂e 数值不应突然跳变，而应从旧值平滑递增到新值，同时交通卡片的占比条缓慢扩展。若用户记录了步行、骑行或公共交通，界面可以显示轻微的正向反馈，例如“不错，今天你避免了约 1.2 kg CO₂e”。这个反馈可以用小型叶子飘动动画、轻微震动反馈和柔和绿色高亮来表达。

对于复杂图表，如月度碳排放曲线、类别堆叠图、碳预算进度环，可以使用 React Native Skia。它适合绘制高度自定义的 Canvas 图形，比普通 View 组合更适合做高级视觉表达。对于简单进入/退出动画、按钮按压、底部 Sheet 拖拽、卡片展开，则使用 Reanimated + Gesture Handler 更合适。

## 交互模式

记录流程必须极快。用户点击底部中间的 “+” 按钮后，弹出一个 Bottom Sheet，里面显示四个大分类：交通、饮食、能源、购物。每个分类进入后都使用“渐进式表单”，而不是一次展示所有字段。例如交通记录流程：

第一步：选择交通方式。
第二步：输入距离或选择常用路线。
第三步：选择人数或车辆类型。
第四步：显示估算结果并保存。

为了减少输入压力，应用应提供“快速记录”功能，例如“昨天一样”“通勤路线”“常用早餐”“家里用电”。用户长期使用后，应用首页可以自动显示推荐快捷项：“今天也乘公交去学校吗？”这种设计能显著降低记录成本。

iOS 体验中，Bottom Sheet、轻触反馈、圆角大卡片、Large Title、模糊背景会更自然。Android 体验中，应更注意 Material 3 的导航节奏、返回手势、状态栏适配和 elevation 层级。虽然 React Native 允许共用大部分组件，但微交互应允许平台差异。例如 iOS 上可以使用更明显的 blur 和 haptic，Android 上使用更清晰的 ripple、snackbar 和系统返回逻辑。

## 样式与组件技术方案

样式系统可以选择 NativeWind，让团队使用接近 Tailwind CSS 的方式书写 React Native 样式。NativeWind 官方说明它允许在 React Native 中使用 Tailwind CSS，并可在不同 React Native 平台之间共享样式组件；其 Expo 安装文档也列出了 nativewind、tailwindcss、react-native-reanimated 和 react-native-safe-area-context 等依赖。([nativewind.dev][4])

组件层建议拆成三层：

第一层是 UI primitives，例如 AppText、AppButton、Card、IconButton、ProgressRing、BottomSheetContainer、Input、SegmentedControl。
第二层是 composite components，例如 CarbonSummaryCard、EmissionCategoryCard、QuickLogCard、GoalProgressCard、WeeklyChart。
第三层是 screen-level layout，例如 HomeScreen、LogScreen、InsightsScreen、GoalsScreen、ProfileScreen。

这样做的好处是设计系统不会和业务逻辑混在一起。UI primitives 只负责视觉一致性，composite components 负责组合信息，screen 负责页面结构和数据流。

## 数据可视化体验

碳足迹是抽象概念，所以可视化非常关键。用户不一定理解 12 kg CO₂e 是多还是少，因此必须提供上下文。例如：

“12 kg CO₂e ≈ 开车约 45 km”
“本周比上周少 8%”
“你的饮食排放连续 3 天下降”
“如果本周多骑行 2 次，你可能减少 3.5 kg CO₂e”

Insights 页面不应只是堆图表，而应像一个环境健康报告。顶部展示本周总结，中间显示趋势图，下方给出“主要变化原因”和“下一步建议”。每个图表都应支持点击或长按查看细节。图表动画可以在页面进入时轻微展开，但不要每次刷新都重播复杂动画，以免造成疲劳。

## 游戏化与情绪设计

环保类应用很容易让用户感到压力，因此游戏化必须是温柔的。可以设计“绿色等级”“连续记录天数”“每周挑战”“虚拟森林”“城市空气改善计划”等系统。用户每减少一定 CO₂e，就能让自己的虚拟树成长一点，或解锁新的自然元素，例如小鸟、湖泊、太阳能板、自行车道。这个系统不应喧宾夺主，而是作为 Goals 页面的一部分，帮助用户建立长期习惯。

庆祝动画应克制。达成目标时可以显示小型粒子、树叶、柔和震动和一句鼓励语。没有达成目标时，不要显示失败，而是显示“还有改进空间，本周最大的机会在交通”。这类文案比“你超标了”更容易让用户继续使用。

## 可访问性与性能

应用必须支持深色模式、动态字体、屏幕阅读器、足够的对比度和非颜色状态表达。所有图标按钮都需要 accessibilityLabel。图表不能只依赖颜色区分类别，应同时使用标签、图案或说明文字。动画需要考虑 Reduce Motion 设置，用户开启减少动态效果时，应使用淡入淡出替代复杂位移动画。

性能方面，首页必须轻。不要在 HomeScreen 中一次性渲染大量图表。复杂统计可以延迟加载，Insights 页面再计算。动画优先使用 Reanimated，复杂图形使用 Skia，列表使用 FlashList 或优化后的 FlatList。React Native 新架构已经成为当前生态重点；Expo 文档说明从 React Native 0.82 开始 New Architecture 始终启用，legacy architecture 已冻结，这意味着新项目更应按 Fabric、TurboModules、Hermes 方向设计性能策略。([Expo Documentation][5])

## 总体设计方向

最终，这款碳足迹追踪应用应该像一个“个人环保教练”，而不是一个冷冰冰的数据表。它需要把复杂的碳排放计算转化为轻松的记录流程、清晰的视觉反馈和可执行的小建议。UI 要现代、自然、可信；UX 要低摩擦、可持续、鼓励式；技术实现要充分利用 Expo、React Native、Reanimated、Skia、NativeWind 等生态能力。只要设计系统从一开始就保持组件化、跨平台一致性、动画克制和数据解释清晰，这款应用就可以同时在 iOS 和 Android 上呈现出接近原生、长期可维护、视觉上有记忆点的体验。

[1]: https://docs.expo.dev/?utm_source=chatgpt.com "Expo Documentation"
[2]: https://shopify.github.io/react-native-skia/?utm_source=chatgpt.com "React Native Skia"
[3]: https://docs.swmansion.com/react-native-reanimated/?utm_source=chatgpt.com "React Native Reanimated"
[4]: https://www.nativewind.dev/v5?utm_source=chatgpt.com "Overview"
[5]: https://docs.expo.dev/guides/new-architecture/?utm_source=chatgpt.com "React Native's New Architecture"
