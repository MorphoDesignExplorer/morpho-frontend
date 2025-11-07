<script lang="ts">
    import { run } from 'svelte/legacy';

    import { page } from '$app/stores';
    import type { Model } from '$lib/types';
    import * as echarts from 'echarts';
    import { onMount } from 'svelte';
    import { writable, type Writable } from 'svelte/store';
    import { slide } from 'svelte/transition';
    import { get_display_options, get_filter_predicates } from '$lib/context';

    interface Props {
        models: Model[];
        set_project: any;
        parameters: string[];
        unit_map: Record<string, string>;
        model_in_focus: Model;
    }

    let {
        models,
        set_project,
        parameters = $bindable(),
        unit_map,
        model_in_focus
    }: Props = $props();

    parameters = parameters.sort()
    const default_parameters: string[] = $page.data.metadata.captions.map(item => item.tag_name);
    let filter_predicates = get_filter_predicates()
    let display_options = get_display_options();

    let chart: HTMLElement = $state();
    let chart_object: echarts.ECharts = $state();
    let container: HTMLDivElement = $state();

    let current_display: Writable<"scatter" | "parallel"> = writable("scatter");
    let configuration_active = $state(false);
    let chart_state = writable({
        parameter_toggle: parameters.map(item => {
            return default_parameters.includes(item)
        }),
        parallel_search: ""
    })
    chart_state.subscribe(parallel)

    function render() {
        if ($current_display === "parallel") {
            parallel()
        } else if ($current_display === "scatter") {
            scatter()
        }
    }



    let XY_chart_state = $state({
        parameter_x: default_parameters[0],
        parameter_y: default_parameters[1]
    })

    function get_data(param_x: string, param_y: string) {
        return models.map(model => {
            let parameter_copy = Object.assign({}, model.parameters);
            parameter_copy = Object.assign(parameter_copy, model.output_parameters)

            return [parameter_copy[param_x], parameter_copy[param_y]];
        })
    }

    onMount(async () => {
        chart_object = echarts.init(chart, null, {
            width: container.clientWidth * 0.8,
            height: container.clientWidth * 0.8
        });

        chart_object.resize({
            width: chart.clientWidth,
            height: chart.clientWidth * 0.8
        })

        render();

        current_display.subscribe(() => {
            $filter_predicates.chart_predicate = []
        })
    })

    function get_label(tag_name: string) {
        return tag_name.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") + "\n" + `[${unit_map[tag_name] || "unitless"}]`
    }

    function parallel() {
        if (chart_object === undefined)
            return;
        chart_object.clear()

        const parameters_allowed = parameters.filter((_, index) => {
            return $chart_state.parameter_toggle[index]
        })

        const get_item_for_parallel_point = (model: Model) => {
            const agg_object = Object.assign(Object.assign({}, model.parameters), model.output_parameters)
            return parameters_allowed.map(
                param => agg_object[param]
            )
        }

        chart_object.setOption({
            parallelAxis: parameters_allowed.map((item, index) => {
                return {
                    dim: index,
                    name: get_label(item)
                }
            }),
            series: {
                type: "parallel",
                lineStyle: {
                    width: 2
                },
                data: models.map(
                    model => {
                        return get_item_for_parallel_point(model)
                    }
                )
            },
            dataZoom: {
                type: "inside"
            },
            emphasis: {
                lineStyle: {
                    color: "#c05a6f",
                    width: 3,
                    opacity: 100,
                    shadowBlur: 4,
                    shadowOffsetX: 0,
                    shadowColor: "#e66a83"
                }
            }
        })
    }

    function scatter() {
        if (chart_object === undefined)
            return;
        chart_object.clear()
        chart_object.setOption({
            xAxis: {
                name: get_label(XY_chart_state.parameter_x),
                nameLocation: "end",
                nameTextStyle: {
                    align: "right",
                    verticalAlign: "top",
                    padding: [30, 0, 0, 0]
                },
                nameGap: 0,
            },
            yAxis: {
                name: get_label(XY_chart_state.parameter_y),
                nameTextStyle: {
                    align: "left"
                }
            },
            series: [
                {
                    symbolSize: 20,
                    data: get_data(XY_chart_state.parameter_x, XY_chart_state.parameter_y),
                    type: 'scatter'
                }
            ],
            toolbox: {
                feature: {
                dataZoom: {
                    yAxisIndex: false
                },
                brush: {
                    type: ['rect', 'clear']
                }
                }
            },
            dataZoom: {
                type: "inside"
            },
            brush: {
                xAxisIndex: 'all',
                brushLink: 'all',
                outOfBrush: {
                    colorAlpha: 0.1
                }
            },
            emphasis: {
                itemStyle: {
                    color: "#c05a6f",
                    width: 3,
                    opacity: 100,
                    shadowBlur: 4,
                    shadowOffsetX: 0,
                    shadowColor: "#e66a83"
                }
            }
        })
    }

    let grid_position = "grid-column: 1 / 2; grid-row: 1 / 3;";
    run(() => {
        $current_display && render();
    });
    run(() => {
        XY_chart_state && render();
    });
    run(() => {
        models && render();
    });
    run(() => {
        if (model_in_focus) {
            setTimeout(() => {
                chart_object.dispatchAction({
                    type: "downplay",
                    seriesIndex: 0,
                    dataIndex: [...Array(models.length).keys()]
                })
                chart_object.dispatchAction({
                    type: "highlight",
                    seriesIndex: 0,
                    dataIndex: models.indexOf(model_in_focus)
                })
            }, 20);
        }
    });
    run(() => {
        if (chart_object) {
            // documentation: https://echarts.apache.org/en/api.html#events.{event_name}
            chart_object.on("click", (params) => {
                set_project(
                    models.at(params.dataIndex)?.id
                )
            })
            chart_object.on("axisareaselected", event => {
                const series = chart_object.getModel().getSeries()[0];
                const indices: number[] = series.getRawIndicesByActiveState("active");
                $filter_predicates.chart_predicate = models.filter((_, index) => indices.indexOf(index) > -1).map(model => model.id);
            })
            chart_object.on("brushselected", event => {
                const indices: number[] = event.batch[0].selected[0].dataIndex;
                $filter_predicates.chart_predicate = models.filter((_, index) => indices.indexOf(index) > -1).map(model => model.id);
            })
            chart_object.getZr().on("click", (event) => {
                if (!event.target) {
                    chart_object.dispatchAction({
                        type: "downplay",
                        seriesIndex: 0,
                        dataIndex: [...Array(models.length).keys()]
                    })
                    
                    if ($current_display === "scatter") {
                        // $filter_predicates.chart_predicate = []
                    }
                }
            })
        }
    });
</script>

<div class="graph-container w-full h-full pb-4 flex flex-col items-center border-r-2 border-blue-500 text-base overflow-scroll" style={grid_position} bind:this={container}>
    <div class="mt-4 pl-2 w-full flex items-end gap-2 border-b-4 border-blue-500">
        <button class="p-0.5 flex items-center justify-center border-x border-t border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition ease-in-out"
        onclick={() => {
            $display_options.graph = false;
        }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        </button>
        <button
            onclick={() => {$current_display = "scatter"}}
            class="p-0.5 px-3 flex items-center justify-center border-x border-t border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition ease-in-out font-bold"
            class:bg-blue-500={$current_display == "scatter"}
            class:text-white={$current_display == "scatter"}
        >
            Scatter Plot
        </button>
        <button
            onclick={() => {$current_display = "parallel"}}
            class="p-0.5 px-3 flex items-center justify-center border-x border-t border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition ease-in-out font-bold"
            class:bg-blue-500={$current_display == "parallel"}
            class:text-white={$current_display == "parallel"}
        >
            Parallel Coordinates
        </button>
    </div>
    <canvas class="relative" bind:this={chart}></canvas>

    <div class="px-4 flex flex-col gap-2 w-full">
        <div class="w-full flex border-b-4 border-blue-500">
            <label 
                for="configure_checkbox"
                class="mr-auto gap-1 px-3 py-1 flex text-blue-500 font-bold border-t border-x border-blue-500 hover:bg-blue-500 hover:text-white transition ease-in-out select-none cursor-pointer"
                class:text-white={configuration_active}
                class:bg-blue-500={configuration_active}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                Configure Plot
                <input type="checkbox" id="configure_checkbox" class="hidden" bind:checked={configuration_active}>
            </label>
        </div>
        {#if configuration_active}
        <div class="p-4" transition:slide={{duration: 100}}>
            {#if $current_display === "parallel"}
            <div class="mb-2 w-full flex gap-2 items-center">
                <p class="font-bold">Search Variables:</p>
                <input type="text" class="border border-gray-200 p-1" placeholder="Search parameters" bind:value={$chart_state.parallel_search}>
            </div>
            <div class="flex flex-wrap justify-start">
                {#each $chart_state.parameter_toggle as parameter_boolean, index}
                <label for="parameter_{index}" class="px-3 py-1 m-1 text-blue-500 border border-blue-500 text-sm select-none cursor-pointer" class:bg-blue-500={$chart_state.parameter_toggle[index]} class:text-white={$chart_state.parameter_toggle[index]}>
                    {@html parameters[index].toLowerCase().replace($chart_state.parallel_search, string => `<span class="bg-orange-200">${string}</span>`)}
                    <input type="checkbox" class="hidden" id="parameter_{index}" bind:checked={$chart_state.parameter_toggle[index]}>
                </label>
                {/each}
            </div>
            {:else if $current_display === "scatter"}
            <div class="flex flex-col gap-2">
                <div class="flex w-full gap-4">
                    <label for="x_param_select" class="min-w-fit">X-Axis</label>
                    <select bind:value={XY_chart_state.parameter_x} class="mr-auto w-full border border-gray-200 shadow-sm text-sm text-slate-600 font-semibold p-1">
                    {#each parameters as parameter}
                        <option value={parameter}>{parameter}</option>
                    {/each}
                </select>
                </div>
                <div class="flex w-full gap-4">
                    <label for="y_param_select" class="min-w-fit">Y-Axis</label>
                    <select bind:value={XY_chart_state.parameter_y} class="mr-auto w-full border border-gray-200 shadow-sm text-sm text-slate-600 font-semibold p-1">
                    {#each parameters as parameter}
                        <option value={parameter}>{parameter}</option>
                    {/each}
                    </select>
                </div>
            </div>
            {/if}
        </div>
        {/if}
    </div>
</div>

<style>
    .graph-container {
        scrollbar-width: thin;
        scrollbar-color: #3B82F6 white;
    }

</style>
