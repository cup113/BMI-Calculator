<script lang="ts">
  import { m } from "$lib/paraglide/messages";

  let { showDataSources = $bindable(false) }: {
    showDataSources: boolean;
  } = $props();
</script>

<section class="bg-surface rounded-2xl shadow-lg overflow-hidden mb-6">
  <button
    onclick={() => (showDataSources = !showDataSources)}
    class="w-full p-6 flex items-center justify-between hover:bg-surface-hover transition"
  >
    <div class="flex items-center gap-3">
      <div
        class="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center"
      >
        <svg
          class="w-5 h-5 text-blue-600 dark:text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <span class="font-semibold text-text-primary">{m.data_source()}</span>
    </div>
    <svg
      class="w-5 h-5 text-text-muted transition-transform {showDataSources ? 'rotate-180' : ''}"
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

  {#if showDataSources}
    <div class="px-6 pb-6 pt-2 border-t border-border-light">
      <ul class="space-y-4 text-sm text-text-secondary">
        <li class="flex items-start gap-2">
          <span
            class="flex-shrink-0 w-6 h-6 bg-surface-alt rounded-full flex items-center justify-center text-xs font-medium text-text-muted mt-0.5"
          >1</span>
          <div>
            <p class="font-medium text-text-primary mb-1">
              {m.source_1_title()}
            </p>
            <p class="mb-1">{m.source_1_desc()}</p>
            <a
              href="http://www.moe.gov.cn/s78/A17/twys_left/moe_938/moe_792/s3273/201407/t20140708_171692.html"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2 break-all"
            >
              http://www.moe.gov.cn/s78/A17/twys_left/moe_938/moe_792/s3273/201407/t20140708_171692.html
            </a>
          </div>
        </li>
        <li class="flex items-start gap-2">
          <span
            class="flex-shrink-0 w-6 h-6 bg-surface-alt rounded-full flex items-center justify-center text-xs font-medium text-text-muted mt-0.5"
          >2</span>
          <div>
            <p class="font-medium text-text-primary mb-1">
              {m.source_2_title()}
            </p>
            <p class="mb-1">{m.source_2_desc()}</p>
            <a
              href="http://www.nhc.gov.cn/ewebeditor/uploadfile/2013/08/20130808135715967.pdf"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2 break-all"
            >
              http://www.nhc.gov.cn/ewebeditor/uploadfile/2013/08/20130808135715967.pdf
            </a>
          </div>
        </li>
        <li class="flex items-start gap-2">
          <span
            class="flex-shrink-0 w-6 h-6 bg-surface-alt rounded-full flex items-center justify-center text-xs font-medium text-text-muted mt-0.5"
          >3</span>
          <div>
            <p class="font-medium text-text-primary mb-1">
              {m.source_3_title()}
            </p>
            <p class="mb-1">{m.source_3_desc()}</p>
            <a
              href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2 break-all"
            >
              https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight
            </a>
          </div>
        </li>
        <li class="flex items-start gap-2">
          <span
            class="flex-shrink-0 w-6 h-6 bg-surface-alt rounded-full flex items-center justify-center text-xs font-medium text-text-muted mt-0.5"
          >4</span>
          <div>
            <p class="font-medium text-text-primary mb-1">
              {m.source_4_title()}
            </p>
            <p class="mb-1">{m.source_4_desc()}</p>
            <a
              href="https://www.nhc.gov.cn/wjw/yingyang/202507/4f77bfad42c14ff0b08be24ab4bd6d83/files/WS%20T%20868-2025-20250715130803122.pdf"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2 break-all"
            >
              https://www.nhc.gov.cn/wjw/yingyang/202507/4f77bfad42c14ff0b08be24ab4bd6d83/files/WS%20T%20868-2025-20250715130803122.pdf
            </a>
          </div>
        </li>
      </ul>
    </div>
  {/if}
</section>
