<script lang="ts">
    // BMI 阈值表格：[男生 [偏瘦上限, 正常上限, 超重上限], 女生 [...]]
    const bmiThresholds = new Map<
        string,
        [[number, number, number], [number, number, number]]
    >([
        [
            "一年级",
            [
                [13.5, 18.2, 20.4],
                [13.3, 17.4, 19.3],
            ],
        ],
        [
            "二年级",
            [
                [13.7, 18.5, 20.5],
                [13.5, 17.9, 20.3],
            ],
        ],
        [
            "三年级",
            [
                [13.9, 19.5, 22.2],
                [13.6, 18.7, 21.2],
            ],
        ],
        [
            "四年级",
            [
                [14.2, 20.2, 22.7],
                [13.7, 19.5, 22.1],
            ],
        ],
        [
            "五年级",
            [
                [14.4, 21.5, 22.8],
                [13.8, 20.6, 23.0],
            ],
        ],
        [
            "六年级",
            [
                [14.7, 21.9, 24.3],
                [14.2, 20.9, 23.7],
            ],
        ],
        [
            "七年级",
            [
                [15.5, 22.2, 24.6],
                [14.8, 21.8, 24.5],
            ],
        ],
        [
            "八年级",
            [
                [15.7, 22.6, 25.0],
                [15.3, 22.3, 24.9],
            ],
        ],
        [
            "九年级",
            [
                [15.8, 22.9, 25.3],
                [16.0, 22.7, 25.2],
            ],
        ],
        [
            "高一",
            [
                [16.5, 23.3, 26.1],
                [16.5, 22.8, 25.3],
            ],
        ],
        [
            "高二",
            [
                [16.8, 23.8, 26.4],
                [16.9, 23.3, 25.5],
            ],
        ],
        [
            "高三",
            [
                [17.3, 23.9, 26.6],
                [17.1, 23.4, 25.8],
            ],
        ],
        [
            "大学",
            [
                [17.9, 24.0, 27.4],
                [17.2, 24.0, 28.0],
            ],
        ],
        [
            "成年",
            [
                [18.5, 24.0, 28.0],
                [18.5, 24.0, 28.0],
            ],
        ],
    ]);

    const stages = Array.from(bmiThresholds.keys());

    // 分组显示
    const stageGroups = [
        {
            label: "小学",
            stages: [
                "一年级",
                "二年级",
                "三年级",
                "四年级",
                "五年级",
                "六年级",
            ],
        },
        { label: "初中", stages: ["七年级", "八年级", "九年级"] },
        { label: "高中", stages: ["高一", "高二", "高三"] },
        { label: "其他", stages: ["大学", "成年"] },
    ];

    // State
    let weight = $state<number | string>("");
    let height = $state<number | string>("");
    let gender = $state<"male" | "female">("male");
    let stage = $state<string>("成年");
    let weightUnit = $state<"kg" | "jin">("kg");
    let hasCalculated = $state(false);
    let showStagePicker = $state(false);

    // 单位转换显示
    let convertedWeight = $derived.by(() => {
        if (!weight || Number(weight) <= 0) return "";
        const w = Number(weight);
        return weightUnit === "kg"
            ? `= ${(w * 2).toFixed(1)} 斤`
            : `= ${(w / 2).toFixed(1)} kg`;
    });

    // BMI 计算
    let bmi = $derived.by(() => {
        if (!weight || !height) return null;

        let weightKg = Number(weight);
        if (weightUnit === "jin") {
            weightKg = weightKg / 2;
        }

        const heightM = Number(height) / 100;
        if (heightM <= 0 || weightKg <= 0) return null;

        return Number((weightKg / (heightM * heightM)).toFixed(2));
    });

    // 当前阈值
    let currentThresholds = $derived.by(() => {
        const thresholds = bmiThresholds.get(stage);
        if (!thresholds) return null;
        const [maleThresholds, femaleThresholds] = thresholds;
        return gender === "male" ? maleThresholds : femaleThresholds;
    });

    // 分类判断
    let category = $derived.by(() => {
        if (!bmi || !currentThresholds) return null;

        const [under, normal, over] = currentThresholds;

        if (bmi < under) {
            return {
                index: 0,
                label: "偏瘦",
                color: "bg-blue-500",
                lightColor: "bg-blue-100",
                textColor: "text-blue-600",
                borderColor: "border-blue-500",
            };
        } else if (bmi < normal) {
            return {
                index: 1,
                label: "正常",
                color: "bg-green-500",
                lightColor: "bg-green-100",
                textColor: "text-green-600",
                borderColor: "border-green-500",
            };
        } else if (bmi < over) {
            return {
                index: 2,
                label: "超重",
                color: "bg-amber-500",
                lightColor: "bg-amber-100",
                textColor: "text-amber-600",
                borderColor: "border-amber-500",
            };
        } else {
            return {
                index: 3,
                label: "肥胖",
                color: "bg-red-500",
                lightColor: "bg-red-100",
                textColor: "text-red-600",
                borderColor: "border-red-500",
            };
        }
    });

    // 对应身高的体重阈值（kg）
    let weightThresholds = $derived.by(() => {
        if (!height || !currentThresholds) return null;
        const heightM = Number(height) / 100;
        if (heightM <= 0) return null;
        const [under, normal, over] = currentThresholds;
        return {
            underweightMax: (under * heightM * heightM).toFixed(1),
            normalMax: (normal * heightM * heightM).toFixed(1),
            overweightMax: (over * heightM * heightM).toFixed(1),
        };
    });

    // 进度条位置计算 - 当前段占70%，其他各占10%
    let barPosition = $derived.by(() => {
        if (!bmi || !currentThresholds || !category) return 0;

        const [under, normal, over] = currentThresholds;
        const currentIndex = category.index;

        // 计算每段在进度条上的起止位置
        // 段顺序：偏瘦(0), 正常(1), 超重(2), 肥胖(3)
        const segmentPositions: number[] = [];
        let pos = 0;
        for (let i = 0; i < 4; i++) {
            segmentPositions.push(pos);
            pos += i === currentIndex ? 70 : 10;
        }

        // 计算在当前段内的相对位置
        let segmentStart: number, segmentEnd: number;
        switch (currentIndex) {
            case 0: // 偏瘦
                segmentStart = Math.max(10, under - 5);
                segmentEnd = under;
                break;
            case 1: // 正常
                segmentStart = under;
                segmentEnd = normal;
                break;
            case 2: // 超重
                segmentStart = normal;
                segmentEnd = over;
                break;
            case 3: // 肥胖
                segmentStart = over;
                segmentEnd = over + 7;
                break;
            default:
                return 0;
        }

        const progress = Math.min(
            Math.max((bmi - segmentStart) / (segmentEnd - segmentStart), 0),
            1,
        );
        const segmentWidth = currentIndex === category.index ? 70 : 10;

        return segmentPositions[currentIndex] + progress * segmentWidth;
    });

    // 获取各段在进度条上的宽度
    let segmentWidths = $derived.by(() => {
        if (!category) return [10, 70, 10, 10];
        const widths = [10, 10, 10, 10];
        widths[category.index] = 70;
        return widths;
    });

    function handleCalculate() {
        const h = Number(height);
        if (weight && h >= 50 && h <= 300) {
            hasCalculated = true;
        }
    }

    function handleReset() {
        weight = "";
        height = "";
        gender = "male";
        stage = "成年";
        weightUnit = "kg";
        hasCalculated = false;
    }

    function selectStage(s: string) {
        stage = s;
        showStagePicker = false;
    }

    // 点击外部关闭选择器
    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest(".stage-picker-container")) {
            showStagePicker = false;
        }
    }
</script>

<svelte:window onclick={handleClickOutside} />

<div
    class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8"
>
    <div class="max-w-md mx-auto">
        <!-- Header -->
        <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-slate-800 mb-2">BMI 计算器</h1>
            <p class="text-slate-500">了解你的健康体重指数</p>
        </div>

        <!-- Input Card -->
        <div class="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <!-- 体重输入 -->
            <div class="mb-6">
                <div class="block text-sm font-semibold text-slate-700 mb-3"
                    >体重</div
                >
                <div class="flex gap-2">
                    <div class="flex-1 relative">
                        <input
                            type="number"
                            bind:value={weight}
                            placeholder="输入体重"
                            step="0.1"
                            min="1"
                            class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                        />
                        {#if convertedWeight}
                            <span
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"
                            >
                                {convertedWeight}
                            </span>
                        {/if}
                    </div>
                    <!-- 单位切换 -->
                    <div class="flex bg-slate-100 rounded-lg p-1">
                        <button
                            onclick={() => (weightUnit = "kg")}
                            class="px-4 py-2 rounded-md font-medium transition {weightUnit ===
                            'kg'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-slate-600 hover:text-slate-800'}"
                        >
                            kg
                        </button>
                        <button
                            onclick={() => (weightUnit = "jin")}
                            class="px-4 py-2 rounded-md font-medium transition {weightUnit ===
                            'jin'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-slate-600 hover:text-slate-800'}"
                        >
                            斤
                        </button>
                    </div>
                </div>
            </div>

            <!-- 身高输入 -->
            <div class="mb-6">
                <div class="block text-sm font-semibold text-slate-700 mb-3"
                    >身高</div
                >
                <div class="flex gap-2">
                    <input
                        type="number"
                        bind:value={height}
                        placeholder="50 - 300"
                        step="0.5"
                        min="50"
                        max="300"
                        class="flex-1 px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                    />
                    <span
                        class="flex items-center px-4 py-3 bg-slate-100 rounded-lg text-slate-600 font-medium"
                        >cm</span
                    >
                </div>
                {#if height && (Number(height) < 50 || Number(height) > 300)}
                    <p class="text-red-500 text-xs mt-1">
                        身高需在 50-300 cm 之间
                    </p>
                {/if}
            </div>

            <!-- 性别选择 -->
            <div class="mb-6">
                <div class="block text-sm font-semibold text-slate-700 mb-3"
                    >性别</div
                >
                <div class="flex gap-3">
                    <button
                        onclick={() => (gender = "male")}
                        class="flex-1 py-3 px-4 rounded-lg font-medium transition {gender ===
                        'male'
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
                    >
                        ♂ 男
                    </button>
                    <button
                        onclick={() => (gender = "female")}
                        class="flex-1 py-3 px-4 rounded-lg font-medium transition {gender ===
                        'female'
                            ? 'bg-pink-500 text-white shadow-md'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
                    >
                        ♀ 女
                    </button>
                </div>
            </div>

            <!-- 年级/阶段选择 - 改进的 UX -->
            <div class="mb-8 stage-picker-container relative">
                <div class="block text-sm font-semibold text-slate-700 mb-3"
                    >年级/阶段</div
                >
                <button
                    onclick={() => (showStagePicker = !showStagePicker)}
                    class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition bg-white flex items-center justify-between"
                >
                    <span class="font-medium text-slate-700">{stage}</span>
                    <svg
                        class="w-5 h-5 text-slate-400 transition-transform {showStagePicker
                            ? 'rotate-180'
                            : ''}"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>

                <!-- 下拉选择面板 -->
                {#if showStagePicker}
                    <div
                        class="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden"
                    >
                        {#each stageGroups as group}
                            <div
                                class="p-3 border-b border-slate-100 last:border-0"
                            >
                                <p
                                    class="text-xs font-semibold text-slate-400 mb-2 px-1"
                                >
                                    {group.label}
                                </p>
                                <div class="grid grid-cols-3 gap-2">
                                    {#each group.stages as s}
                                        <button
                                            onclick={() => selectStage(s)}
                                            class="py-2 px-3 rounded-lg text-sm font-medium transition {s ===
                                            stage
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}"
                                        >
                                            {s}
                                        </button>
                                    {/each}
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>

            <!-- 计算按钮 -->
            <button
                onclick={handleCalculate}
                disabled={!weight ||
                    !height ||
                    Number(height) < 50 ||
                    Number(height) > 300}
                class="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
                开始计算
            </button>
        </div>

        <!-- Result Card -->
        {#if hasCalculated && bmi !== null && category && currentThresholds && weightThresholds}
            <div class="bg-white rounded-2xl shadow-lg p-8 mb-6">
                <!-- BMI 值 -->
                <div class="text-center mb-6">
                    <p class="text-slate-500 text-sm mb-2">你的 BMI 指数</p>
                    <p class="text-5xl font-bold {category.textColor}">{bmi}</p>
                    <p class="text-lg font-semibold {category.textColor} mt-2">
                        {category.label}
                    </p>
                </div>

                <!-- 体重阈值表格 -->
                <div class="mb-6 bg-slate-50 rounded-xl p-4">
                    <p class="text-xs text-slate-500 mb-3 text-center">
                        根据您当前性别、年龄段、身高的体重参考（单位: kg）
                    </p>
                    <div class="grid grid-cols-2 gap-2 text-center">
                        <div
                            class="p-2 rounded-lg {category.index === 0
                                ? 'bg-blue-100 ring-2 ring-blue-500'
                                : 'bg-white'}"
                        >
                            <p class="text-xs text-slate-500 mb-1">偏瘦</p>
                            <p class="text-sm font-bold text-blue-600">
                                &lt; {weightThresholds.underweightMax}
                            </p>
                        </div>
                        <div
                            class="p-2 rounded-lg {category.index === 1
                                ? 'bg-green-100 ring-2 ring-green-500'
                                : 'bg-white'}"
                        >
                            <p class="text-xs text-slate-500 mb-1">正常</p>
                            <p class="text-sm font-bold text-green-600">
                                {weightThresholds.underweightMax} - {weightThresholds.normalMax}
                            </p>
                        </div>
                        <div
                            class="p-2 rounded-lg {category.index === 2
                                ? 'bg-amber-100 ring-2 ring-amber-500'
                                : 'bg-white'}"
                        >
                            <p class="text-xs text-slate-500 mb-1">超重</p>
                            <p class="text-sm font-bold text-amber-600">
                                {weightThresholds.normalMax} - {weightThresholds.overweightMax}
                            </p>
                        </div>
                        <div
                            class="p-2 rounded-lg {category.index === 3
                                ? 'bg-red-100 ring-2 ring-red-500'
                                : 'bg-white'}"
                        >
                            <p class="text-xs text-slate-500 mb-1">肥胖</p>
                            <p class="text-sm font-bold text-red-600">
                                ≥ {weightThresholds.overweightMax}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- 进度条 - 当前段占70%，其他各占10% -->
                <div class="mb-6">
                    <div class="relative h-4 rounded-full overflow-hidden flex">
                        <!-- 偏瘦段 -->
                        <div
                            class="bg-blue-400 h-full {category.index === 0
                                ? 'opacity-100'
                                : 'opacity-40'}"
                            style="width: {segmentWidths[0]}%"
                        ></div>
                        <!-- 正常段 -->
                        <div
                            class="bg-green-400 h-full {category.index === 1
                                ? 'opacity-100'
                                : 'opacity-40'}"
                            style="width: {segmentWidths[1]}%"
                        ></div>
                        <!-- 超重段 -->
                        <div
                            class="bg-amber-400 h-full {category.index === 2
                                ? 'opacity-100'
                                : 'opacity-40'}"
                            style="width: {segmentWidths[2]}%"
                        ></div>
                        <!-- 肥胖段 -->
                        <div
                            class="bg-red-400 h-full {category.index === 3
                                ? 'opacity-100'
                                : 'opacity-40'}"
                            style="width: {segmentWidths[3]}%"
                        ></div>

                        <!-- 指针 -->
                        <div
                            class="absolute top-1/2 -translate-y-1/2 w-1 h-6 bg-white border-2 border-slate-800 rounded-full shadow-md transition-all duration-300"
                            style="left: {barPosition}%"
                        ></div>
                    </div>

                    <!-- 标签 -->
                    <div class="flex text-xs mt-2 font-medium">
                        <span
                            class="text-blue-600"
                            style="width: {segmentWidths[0]}%">偏瘦</span
                        >
                        <span
                            class="text-green-600 text-center"
                            style="width: {segmentWidths[1]}%">正常</span
                        >
                        <span
                            class="text-amber-600 text-center"
                            style="width: {segmentWidths[2]}%">超重</span
                        >
                        <span
                            class="text-red-600 text-right"
                            style="width: {segmentWidths[3]}%">肥胖</span
                        >
                    </div>
                </div>

                <!-- 健康建议 -->
                <div
                    class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6"
                >
                    <p class="text-sm text-blue-900">
                        {#if category.label === "偏瘦"}
                            建议增加营养摄入，适度运动以增强体质。
                        {:else if category.label === "正常"}
                            很好！保持现在的生活方式，定期运动和均衡饮食。
                        {:else if category.label === "超重"}
                            建议适度增加运动量，控制饮食摄入，逐步调整体重。
                        {:else}
                            建议咨询医生或营养师，制定科学的减重计划。
                        {/if}
                    </p>
                </div>

                <!-- 重新计算按钮 -->
                <button
                    onclick={handleReset}
                    class="w-full py-2 px-4 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition"
                >
                    重新计算
                </button>
            </div>
        {/if}
    </div>
</div>

<style>
    @reference "tailwindcss";

    :global(body) {
        @apply bg-slate-50;
    }
</style>
