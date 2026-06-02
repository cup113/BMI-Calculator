<script lang="ts">
  import { m } from "$lib/paraglide/messages";

  let { showDataSources = $bindable(false) }: {
    showDataSources: boolean;
  } = $props();
</script>

<section class="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
  <button
    onclick={() => (showDataSources = !showDataSources)}
    class="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition"
  >
    <div class="flex items-center gap-3">
      <div
        class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
      >
        <svg
          class="w-5 h-5 text-blue-600"
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
      <span class="font-semibold text-slate-800">{m.data_source()}</span>
    </div>
    <svg
      class="w-5 h-5 text-slate-400 transition-transform {showDataSources ? 'rotate-180' : ''}"
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
    <div class="px-6 pb-6 pt-2 border-t border-slate-100">
      <ul class="space-y-4 text-sm text-slate-600">
        <li class="flex items-start gap-2">
          <span
            class="flex-shrink-0 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium text-slate-500 mt-0.5"
          >1</span>
          <div>
            <p class="font-medium text-slate-700 mb-1">
              {m.source_1_title()}
            </p>
            <p class="mb-1">{m.source_1_desc()}</p>
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
          <span
            class="flex-shrink-0 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-medium text-slate-500 mt-0.5"
          >2</span>
          <div>
            <p class="font-medium text-slate-700 mb-1">
              {m.source_2_title()}
            </p>
            <p class="mb-1">{m.source_2_desc()}</p>
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
