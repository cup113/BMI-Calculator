<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.ico';

	let { children } = $props();
	export const prerender = true
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="description" content="免费在线 BMI 计算器，现代 UI，支持男女分龄评估（小学至成人），提供精准体重阈值参考，kg/斤双单位切换，保护隐私无数据上传。" />
	<meta name="keywords" content="BMI计算器,体重指数,身体质量指数,健康体重,肥胖评估,学生BMI,成人BMI,体重标准,身高体重比" />
	<meta name="author" content="Jason Li" />
	<meta property="og:title" content="BMI 计算器 - 分龄健康体重评估" />
	<meta property="og:description" content="免费在线 BMI 计算器，支持男女分龄评估，提供精准体重阈值参考。" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://bmi.cup11.top" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="BMI 计算器 - 分龄健康体重评估" />
	<meta name="twitter:description" content="免费在线 BMI 计算器，支持男女分龄评估，提供精准体重阈值参考。" />
</svelte:head>
{@render children()}
