<script lang="ts">
  import Spinner from "../../layouts/spinner.svelte";
  // import { Chatbot } from "./chatbot.model";
  import {
    sendChat$,
    sendChat,
    getPrefixes$,
    getPrefixes,
  } from "./chatbot.service.js";

  let showSpinner = false;
  let chatResponse = "";
  let payload: any = {
    model: "text-davinci-003",
    prompt: "Hello world",
    temperature: 0,
    max_tokens: 200,
    prefixes: [],
  };
  let promptPrefixes = [];
  let selectedPrefixes = [0];
  let max_tokens_slider: number = 500;
  let temp_slider: number = 0.1;
  //externalize this soon
  let models: any[] = [{model:"text-davinci-003", max_tokens:4096},{model:"code-davinci-002", max_tokens:8000},{model:"text-curie-001", max_tokens:2048}]
  
  let selectedModel: any = models[0];
  $: length = selectedPrefixes.length;
  sendChat$.subscribe((data) => {
    chatResponse = data;
    showSpinner = false;
    payload.prompt = "";
  });
  getPrefixes$.subscribe((data) => {
    promptPrefixes = data;
    showSpinner = false;
  });
  getPrefixes();

  function handleUpload() {
    showSpinner = true;
    payload.prefixes = selectedPrefixes;
    payload.model = selectedModel.model;
    payload.max_tokens = Number(max_tokens_slider);
    payload.temperature = Number(temp_slider);
    sendChat(payload);
  }

  function promptInputChange(e) {
    payload.prompt = e.target.value;
  }

  function handleMaxTokenValue(e) {
    max_tokens_slider = e.target.value;
    payload.max_tokens = Number(max_tokens_slider);
  };

  function handleTempValue(e) {
    temp_slider = e.target.value;
    payload.temperature = Number(temp_slider);
  };
  //write
</script>

<div class="message h-screen ">
  <slot />

  <div class="mx-auto flex flex-col">
    {#if showSpinner}
      <div class="relative top-36">
        <svelte:component this={Spinner} />
      </div>
    {/if}
    <div class="mx-auto w-full text-center"> 
    <textarea
      class="textarea-borders"
      rows={10}
      bind:value={chatResponse}
      readonly
    />
    
    <input
      class="textarea-borders py-3"
      type="text"
      bind:value={payload.prompt}
      on:change={promptInputChange}
      on:keydown={(e) => {
        if (e.key === "Enter" || e.key === "Return" || e.key === "Next") {
          handleUpload();
        }
      }}
    />
  </div>

     <!-- multi select -->
     <div class="mx-auto w-full bg-white lg:w-3/4 rounded border-2 border-black shadow-lg">
      <select class="w-full  h-full p-3" bind:value={selectedPrefixes} >
        {#each promptPrefixes as prompt}
          <option class="flex-wrap" value={prompt.prompt}>{prompt.name}</option>
        {/each}
      </select>
    </div>
    
    <!-- This Section is for the advanced features -->
    <!-- Range Slider for token max -->
    <div class=" hidden lg:flex flex-wrap justify-center mx-auto w-full lg:w-3/4">

      <div class=" my-3 w-full range-slider bg-white lg:w-2/6 border-2 border-black rounded shadow-lg flex">
        <input class="relative left-1 pl-5 p-3 accent-orange-500 range-slider__range w-full " type="range" value={max_tokens_slider} min="100" max={selectedModel.max_tokens} step="25" on:click={()=> handleMaxTokenValue(event)}>
        <span class=" range-slider__value p-3">{max_tokens_slider}</span>
      </div>

      <div class="mx-auto relative w-full lg:w-1/6 my-3 rounded border-2 border-black shadow-lg">
        <select class="w-full h-full p-3" bind:value={selectedModel} >
          {#each models as model}
            <option class="flex-wrap" value={model}>{model.model}</option>
          {/each}
        </select>
      </div>

      <div class="my-3 w-full range-slider bg-white lg:w-2/6 border-2 border-black rounded shadow-lg flex">
        <input class="relative left-1 pl-5 p-3 range-slider__range w-full accent-orange-500 " type="range" value={temp_slider} min="0" max="1.0" step="0.1" on:click={()=> handleTempValue(event)}>
        <span class=" range-slider__value p-3">{temp_slider}</span>
      </div>

    </div>

    <div class="flex w-full mx-auto mt-10">
      <button
        class="mx-auto w-1/4 rounded btn_w_border sidebar-icon shadow-lg"
        on:click={handleUpload}
      >
        Send
      </button>
    </div>
  </div>
</div>