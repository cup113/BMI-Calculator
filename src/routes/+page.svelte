<script lang="ts">
    import {
        stageGroups,
        categoryConfig,
    } from "$lib/constants";
    import {
        calculateBMI,
        getThresholds,
        classifyBMI,
        calculateWeightThresholds,
        calculateSegmentWidths,
        calculateBarPosition,
        convertWeightText,
    } from "$lib/bmi";

    let weight = $state<number | string>("");
    let height = $state<number | string>("");
    let gender = $state<"male" | "female">("male");
    let stage = $state<string>("成年");
    let weightUnit = $state<"kg" | "jin">("kg");
    let hasCalculated = $state(false);
    let showStagePicker = $state(false);
    let showDataSources = $state(false);

    /** 单位转换显示 */
    let convertedWeight = $derived(convertWeightText(Number(weight), weightUnit));

    /** BMI 计算 */
    let bmi = $derived(calculateBMI(Number(weight), Number(height), weightUnit));

    /** 当前选中年级/阶段的 BMI 阈值 */
    let currentThresholds = $derived(getThresholds(stage, gender));

    /** BMI 分类判断 */
    let category = $derived(classifyBMI(bmi, currentThresholds));

    /** 对应身高的体重阈值（kg） */
    let weightThresholds = $derived(calculateWeightThresholds(Number(height), currentThresholds));

    /** 进度条各段宽度 - 当前段占70%，其他各占10% */
    let segmentWidths = $derived(calculateSegmentWidths(category));

    /** 进度条指针位置 */
    let barPosition = $derived(calculateBarPosition(bmi, currentThresholds, category, segmentWidths));

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

    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest(".stage-picker-container")) {
            showStagePicker = false;
        }
    }
</script>

<svelte:window onclick={handleClickOutside} />

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
    <div class="max-w-md mx-auto">
        <!-- Header -->
        <header class="text-center mb-8">
            <h1 class="text-3xl font-bold text-slate-800 mb-2">BMI 计算器</h1>
            <p class="text-slate-500">了解你的健康体重指数</p>
        </header>

        <!-- Input Card -->
        <section class="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <!-- 体重输入 -->
            <div class="mb-6">
                <div class="block text-sm font-semibold text-slate-700 mb-3">体重</div>
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
                            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                                {convertedWeight}
                            </span>
                        {/if}
                    </div>
                    <!-- 单位切换 -->
                    <div class="flex bg-slate-100 rounded-lg p-1">
                        <button
                            onclick={() => (weightUnit = "kg")}
                            class="px-4 py-2 rounded-md font-medium transition {weightUnit === 'kg'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-slate-600 hover:text-slate-800'}"
                        >
                            kg
                        </button>
                        <button
                            onclick={() => (weightUnit = "jin")}
                            class="px-4 py-2 rounded-md font-medium transition {weightUnit === 'jin'
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
                <div class="block text-sm font-semibold text-slate-700 mb-3">身高</div>
                <div class="flex gap-2">
                    <input
                        type="number"
                        bind:value={height}
                        placeholder="输入身高 (cm)"
                        step="0.5"
                        min="50"
                        max="300"
                        class="flex-1 px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                    />
                    <span class="flex items-center px-4 py-3 bg-slate-100 rounded-lg text-slate-600 font-medium">
                        cm
                    </span>
                </div>
                {#if height && (Number(height) < 50 || Number(height) > 300)}
                    <p class="text-red-500 text-xs mt-1">身高需在 50-300 cm 之间</p>
                {/if}
            </div>

            <!-- 性别选择 -->
            <div class="mb-6">
                <div class="block text-sm font-semibold text-slate-700 mb-3">性别</div>
                <div class="flex gap-3">
                    <button
                        onclick={() => (gender = "male")}
                        class="flex-1 py-3 px-4 rounded-lg font-medium transition {gender === 'male'
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
                    >
                        ♂ 男
                    </button>
                    <button
                        onclick={() => (gender = "female")}
                        class="flex-1 py-3 px-4 rounded-lg font-medium transition {gender === 'female'
                            ? 'bg-pink-500 text-white shadow-md'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}"
                    >
                        ♀ 女
                    </button>
                </div>
            </div>

            <!-- 年级/阶段选择 -->
            <div class="mb-8 stage-picker-container relative">
                <div class="block text-sm font-semibold text-slate-700 mb-3">年级/阶段</div>
                <button
                    onclick={() => (showStagePicker = !showStagePicker)}
                    class="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 transition bg-white flex items-center justify-between"
                >
                    <span class="font-medium text-slate-700">{stage}</span>
                    <svg
                        class="w-5 h-5 text-slate-400 transition-transform {showStagePicker ? 'rotate-180' : ''}"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <!-- 下拉选择面板 -->
                {#if showStagePicker}
                    <div class="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
                        {#each stageGroups as group}
                            <div class="p-3 border-b border-slate-100 last:border-0">
                                <p class="text-xs font-semibold text-slate-400 mb-2 px-1">{group.label}</p>
                                <div class="grid grid-cols-3 gap-2">
                                    {#each group.stages as s}
                                        <button
                                            onclick={() => selectStage(s)}
                                            class="py-2 px-3 rounded-lg text-sm font-medium transition {s === stage
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
                disabled={!weight || !height || Number(height) < 50 || Number(height) > 300}
                class="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
                开始计算
            </button>
        </section>

        <!-- Result Card -->
        {#if hasCalculated && bmi !== null && category && currentThresholds && weightThresholds}
            <section class="bg-white rounded-2xl shadow-lg p-8 mb-6">
                <!-- BMI 值 -->
                <div class="text-center mb-6">
                    <p class="text-slate-500 text-sm mb-2">你的 BMI 指数</p>
                    <p class="text-5xl font-bold {category.textColor}">{bmi}</p>
                    <p class="text-lg font-semibold {category.textColor} mt-2">{category.label}</p>
                </div>

                <!-- 体重阈值表格 -->
                <div class="mb-6 bg-slate-50 rounded-xl p-4">
                    <p class="text-xs text-slate-500 mb-3 text-center">
                        根据您当前性别、年龄段、身高的体重参考（单位: kg）
                    </p>
                    <div class="grid grid-cols-2 gap-2 text-center">
                        <div class="p-2 rounded-lg {category.index === 0 ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-white'}">
                            <p class="text-xs text-slate-500 mb-1">偏瘦</p>
                            <p class="text-sm font-bold text-blue-600">&lt; {weightThresholds.underweightMax}</p>
                        </div>
                        <div class="p-2 rounded-lg {category.index === 1 ? 'bg-green-100 ring-2 ring-green-500' : 'bg-white'}">
                            <p class="text-xs text-slate-500 mb-1">正常</p>
                            <p class="text-sm font-bold text-green-600">
                                {weightThresholds.underweightMax} - {weightThresholds.normalMax}
                            </p>
                        </div>
                        <div class="p-2 rounded-lg {category.index === 2 ? 'bg-amber-100 ring-2 ring-amber-500' : 'bg-white'}">
                            <p class="text-xs text-slate-500 mb-1">超重</p>
                            <p class="text-sm font-bold text-amber-600">
                                {weightThresholds.normalMax} - {weightThresholds.overweightMax}
                            </p>
                        </div>
                        <div class="p-2 rounded-lg {category.index === 3 ? 'bg-red-100 ring-2 ring-red-500' : 'bg-white'}">
                            <p class="text-xs text-slate-500 mb-1">肥胖</p>
                            <p class="text-sm font-bold text-red-600">≥ {weightThresholds.overweightMax}</p>
                        </div>
                    </div>
                </div>

                <!-- 进度条 -->
                <div class="mb-6">
                    <div class="relative h-4 rounded-full overflow-hidden flex">
                        {#each [0, 1, 2, 3] as i}
                            <div
                                class="h-full {['bg-blue-400', 'bg-green-400', 'bg-amber-400', 'bg-red-400'][i]} {category.index === i
                                    ? 'opacity-100'
                                    : 'opacity-40'}"
                                style="width: {segmentWidths[i]}%"
                            ></div>
                        {/each}

                        <!-- 指针 -->
                        <div
                            class="absolute top-1/2 -translate-y-1/2 w-1 h-6 bg-white border-2 border-slate-800 rounded-full shadow-md transition-all duration-300"
                            style="left: {barPosition}%"
                        ></div>
                    </div>

                    <!-- 标签 -->
                    <div class="flex text-xs mt-2 font-medium">
                        <span class="text-blue-600" style="width: {segmentWidths[0]}%">偏瘦</span>
                        <span class="text-green-600 text-center" style="width: {segmentWidths[1]}%">正常</span>
                        <span class="text-amber-600 text-center" style="width: {segmentWidths[2]}%">超重</span>
                        <span class="text-red-600 text-right" style="width: {segmentWidths[3]}%">肥胖</span>
                    </div>
                </div>

                <button
                    onclick={handleReset}
                    class="w-full py-2 px-4 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition"
                >
                    重新计算
                </button>
            </section>
        {/if}

        <!-- Privacy Notice -->
        <section class="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <div>
                    <h3 class="font-semibold text-slate-800 mb-1">隐私保护声明</h3>
                    <p class="text-sm text-slate-600 leading-relaxed">
                        本网站不以任何形式收集、存储或传输您的身高、体重、性别、年龄等个人信息。所有 BMI 计算均在您的浏览器本地完成。
                    </p>
                </div>
            </div>
        </section>

        <!-- Data Sources -->
        <section class="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
            <button
                onclick={() => (showDataSources = !showDataSources)}
                class="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition"
            >
                <div class="flex items-center gap-3">
                    <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <span class="font-semibold text-slate-800">数据来源</span>
                </div>
                <svg
                    class="w-5 h-5 text-slate-400 transition-transform {showDataSources ? 'rotate-180' : ''}"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {#if showDataSources}
                <div class="px-6 pb-6 pt-2 border-t border-slate-100">
                    <ul class="space-y-4 text-sm text-slate-600">
                        <li class="flex items-start gap-2">
                            <span class="flex-shrink-0 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium text-slate-500 mt-0.5">1</span>
                            <div>
                                <p class="font-medium text-slate-700 mb-1">7-22 岁 BMI 标准</p>
                                <p class="mb-1">《教育部关于印发〈国家学生体质健康标准（2014年修订）〉的通知》(教体艺〔2014〕5号)</p>
                                <a
                                    href="http://www.moe.gov.cn/s78/A17/twys_left/moe_938/moe_792/s3273/201407/t20140708_171692.html"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="text-blue-500 hover:text-blue-600 underline underline-offset-2 break-all"
                                >
                                    http://www.moe.gov.cn/s78/A17/twys_left/moe_938/moe_792/s3273/201407/t20140708_171692.html
                                </a>
                            </div>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="flex-shrink-0 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium text-slate-500 mt-0.5">2</span>
                            <div>
                                <p class="font-medium text-slate-700 mb-1">23 岁及以上 BMI 标准</p>
                                <p class="mb-1">《成人体重判定 / Criteria of weight for adults》(WS/T 428-2013)</p>
                                <a
                                    href="http://www.nhc.gov.cn/ewebeditor/uploadfile/2013/08/20130808135715967.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="text-blue-500 hover:text-blue-600 underline underline-offset-2 break-all"
                                >
                                    http://www.nhc.gov.cn/ewebeditor/uploadfile/2013/08/20130808135715967.pdf
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>
            {/if}
        </section>

        <footer class="text-center text-xs text-slate-400 pb-4">
            <p>BMI 仅作为健康参考指标，不构成医疗诊断依据</p>
        </footer>
    </div>
</div>

<style>
    @reference "tailwindcss";

    :global(body) {
        @apply bg-slate-50;
    }
</style>
