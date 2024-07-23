<script lang="ts">
    import * as d3 from "d3";

    interface Model {
        id: number | string,
        scoped_id: number | string,
        parameters: Record<string, string|number>,
        output_parameters: Record<string, string|number>,
        files: Record<string, string>[],
    }

    interface Tooltip {
        tooltip_div: HTMLDivElement,
        tooltip_id: string | number,
        tooltip_x: string | number,
        tooltip_y: string | number
    }

    let width: number;
    let height: number;
    export let parameters: string[];
    export let models: Model[];
    export let display_options: {filter: boolean, grid: boolean, graph: boolean, sidepane: boolean};

    export let set_project;

    let render_target: SVGElement;
    let tooltip: Tooltip = {
        tooltip_id: "",
        tooltip_x: "",
        tooltip_y: ""
    };

    let x_paraname = "";
    let y_paraname = "";

    // data is a set of items of form [x_parameter_value, y_parameter_value, id, scoped_id]
    let data: (string|number)[][] = [];
    $: if (x_paraname != "" && y_paraname != "") {
        data = models.map(model => [
            (x_paraname in model.parameters)? model.parameters[x_paraname] : model.output_parameters[x_paraname],
            (y_paraname in model.parameters)? model.parameters[y_paraname] : model.output_parameters[y_paraname],
            model.id,
            model.scoped_id
        ])
    }

    export let marginTop = 20;
    export let marginRight = 20;
    export let marginBottom = 30;
    export let marginLeft = 4*20;


    let canvas: SVGElement;
    let gx: SVGElement;
    let gy: SVGElement;
    let point_set: SVGElement;
    let g_xlabel: SVGTextElement;
    let g_ylabel: SVGTextElement;
    let zoom;

    function zoomed({transform}) {
        const zx = transform.rescaleX(x).interpolate(d3.interpolateRound);
        const zy = transform.rescaleY(y).interpolate(d3.interpolateRound);
        d3.select(point_set).attr("transform", transform).selectChildren().attr("r", 4 / transform.k);;
        d3.select(gx).call(d3.axisBottom(zx), zx);
        d3.select(gy).call(d3.axisLeft(zy), zy);
    }

    zoom = d3.zoom().scaleExtent([0.5, 32]).on("zoom", zoomed);

    $: x = d3.scaleLinear(
        d3.extent(data.map(model => model[0])),
        [marginLeft, width - marginRight],
    );
    $: y = d3.scaleLinear(d3.extent(data.map(model => model[1])), [height - marginBottom, marginTop]);
    $: d3.select(gy).call(d3.axisLeft(y));
    $: d3.select(gx).call(d3.axisBottom(x));
    $: d3.select(render_target).call(zoom).call(zoom.transform, d3.zoomIdentity);

    let grid_position = "grid-column: 1 / 2; grid-row: 1 / 3;";


</script>

<div class="h-full border-r-2 border-r-gray-200 pb-4 flex flex-col items-center relative" style={grid_position}>
    <button
        on:click={() => {
            display_options.graph = !display_options.graph;
        }}
        class="absolute top-4 left-4 w-fit p-1 bg-blue-600 text-orange-200 hover:text-blue-600 hover:bg-orange-200 transition ease-in-out font-bold z-10 rounded-md shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
    </button>
    <div class="w-full h-full flex flex-col items-center" bind:clientHeight={height} bind:clientWidth={width} bind:this={render_target}>
        <svg class="w-full h-full select-none">
            <g bind:this={gx} transform="translate(0,{height - marginBottom})" />
            <g bind:this={gy} transform="translate({marginLeft},0)" />
            <g fill="black" bind:this={point_set}>
                {#each data as datum, i}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                    <circle
                        class="cursor-pointer"
                        on:click={() => set_project(datum[2])}
                        on:mousemove={event => {
                            tooltip["tooltip_div"].style.left = `${event.clientX+20}px`,
                            tooltip["tooltip_div"].style.top = `${event.clientY-100}px`
                            tooltip["tooltip_div"].style.opacity = "100%";
                            tooltip["tooltip_div"].style.display = "block";
                            tooltip["tooltip_x"] = datum[0];
                            tooltip["tooltip_y"] = datum[1];
                            tooltip["tooltip_id"] = datum[3];
                        }}
                        on:mouseout={event => {
                            tooltip["tooltip_div"].style.opacity = "0%";
                            tooltip["tooltip_div"].style.display = "none";
                        }}
                        cx={x(datum[0])} cy={y(datum[1])} r="4" 
                    />
                {/each}
            </g>
        </svg>
        <div
            bind:this={tooltip["tooltip_div"]}
            class="absolute bg-black text-white p-2 bg-opacity-55 w-fit flex-col transition ease-in-out opacity-0 hidden"
        >
            <p>id: {tooltip.tooltip_id}</p>
            <p>{x_paraname}: {tooltip.tooltip_x}</p>
            <p>{y_paraname}: {tooltip.tooltip_y}</p>
        </div>
    </div>
    <div class="flex w-4/5 gap-2 text-xs">
        <div class="flex flex-row w-full items-center gap-2">
            <p class="font-bold">X:</p>
            <select name="x-select" bind:value={x_paraname} class="border border-gray-200 bg-white p-2 px-3 rounded-md w-full capitalize">
                <option value="" disabled selected>x parameter</option>
                {#each parameters as parameter}
                <option value={parameter}>{parameter}</option>
                {/each}
            </select>
        </div>
        <div class="flex flex-row w-full items-center gap-2">
            <p class="font-bold">Y:</p>
            <select name="x-select" bind:value={y_paraname} class="border-[1px] border-gray-200 bg-white p-2 px-3 rounded-md w-full capitalize">
                <option value="" disabled selected>y parameter</option>
                {#each parameters as parameter}
                <option value={parameter}>{parameter}</option>
                {/each}
            </select>
        </div>
    </div>
</div>
