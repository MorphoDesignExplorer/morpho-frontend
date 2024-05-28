<script>
    import * as d3 from "d3";

    /** @type {number} */
    let width;
    /** @type {number} */
    let height;
    /** @type {string[]}*/
    export let parameters;
    /** @type {{id: number | string, parameters: Object<string, string|number>, output_parameters: Object<string, string|number>, files: Object<string, string>[]}[]} */
    export let models;
    /** @type {SVGElement}*/
    let render_target;

    let x_paraname = "";
    let y_paraname = "";

    /** @type {[string | number, string | number][]}*/
    let data = [];
    $: if (x_paraname != "" && y_paraname != "") {
        data = models.map(model => [
            (x_paraname in model.parameters)? model.parameters[x_paraname] : model.output_parameters[x_paraname],
            (y_paraname in model.parameters)? model.parameters[y_paraname] : model.output_parameters[y_paraname],
        ])
    }

    export let marginTop = 20;
    export let marginRight = 20;
    export let marginBottom = 30;
    export let marginLeft = 4*20;

    let gx;
    let gy;
    let zoom;

    function zoomed({transform}) {
        const zx = transform.rescaleX(x).interpolate(d3.interpolateRound);
        const zy = transform.rescaleY(y).interpolate(d3.interpolateRound);
        d3.select(gx).call(d3.axisBottom(zx), zx);
        d3.select(gy).call(d3.axisLeft(zy), zy);
    }

    $: zoom = d3.zoom().scaleExtent([0.5, 32]).on("zoom", zoomed);

    $: x = d3.scaleLinear(
        d3.extent(data.map(model => model[0])),
        [marginLeft, width - marginRight],
    );
    $: y = d3.scaleLinear(d3.extent(data.map(model => model[1])), [height - marginBottom, marginTop]);
    $: d3.select(gy).call(d3.axisLeft(y));
    $: d3.select(gx).call(d3.axisBottom(x));
    $: d3.select(render_target).call(zoom.transform, d3.zoomIdentity);

</script>

<div class="min-w-[50vw] border-r-2 border-r-amber-950 flex flex-col items-center">
    <div class="w-full h-5/6 flex flex-col items-center" bind:clientHeight={height} bind:clientWidth={width} bind:this={render_target}>
        <svg class="w-full h-full">
            <g bind:this={gx} transform="translate(0,{height - marginBottom})" />
            <g bind:this={gy} transform="translate({marginLeft},0)" />
            <g fill="black">
                {#each data as datum, i}
                    <circle key={i} cx={x(datum[0])} cy={y(datum[1])} r="2.5" />
                {/each}
            </g>
        </svg>
    </div>
    <div class="flex flex-col w-4/5 gap-2 font-mono">
        <div class="flex flex-row w-full items-center gap-2">
            <p class="font-bold">X:</p>
            <select name="x-select" bind:value={x_paraname} class="border-2 border-amber-950 p-2 w-full">
                <option value="" disabled selected>x parameter</option>
                {#each parameters as parameter}
                <option value={parameter}>{parameter}</option>
                {/each}
            </select>
        </div>
        <div class="flex flex-row w-full items-center gap-2">
            <p class="font-bold">Y:</p>
            <select name="x-select" bind:value={y_paraname} class="border-2 border-amber-950 p-2 w-full">
                <option value="" disabled selected>y parameter</option>
                {#each parameters as parameter}
                <option value={parameter}>{parameter}</option>
                {/each}
            </select>
        </div>
    </div>
</div>
