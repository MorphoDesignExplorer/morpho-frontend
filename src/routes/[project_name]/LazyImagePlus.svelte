<!-- @migration-task Error while migrating Svelte code: $$props is used together with named props in a way that cannot be automatically migrated. -->
<script lang="ts">
    /*
    MIT License

    Copyright (c) 2022 Alexander Staroselskt

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.

    This copy of LazyImagePlus modifies the behavior of the original package whenever the path to the image is changed.
    */

	import { onMount } from 'svelte';

	/**
	 * Path to placeholder image.
	 * @type {string}
	 */
	export let placeholder: string;

	/**
	 * Path to image.
	 * @type {string}
	 */
	export let src: string;

	/**
	 * Alt image text description for accessibility.
	 * @type {string}
	 */
	export let alt: string;

	/**
	 * IntersectionObserver options
	 * @type {{ root?: any; rootMargin?: string; threshold?: number; }}
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver}
	 */
	export let options = { root: null, rootMargin: '0px 0px 0px 0px', threshold: 0.0 };

	let imgElement;
	let path: string;

	let observer: IntersectionObserver;
	let intersected = false;
	let loaded = false;
    let initial_mount_complete: boolean = false;

	$: path = intersected ? src : placeholder;
	$: cssClass = $$props.class || '';

    const setupObserver = () => {
		observer = new IntersectionObserver((entries, self) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					intersected = true;
					self.unobserve(imgElement);
				}
			});
		}, options);
		observer.observe(imgElement);

        initial_mount_complete = true;

		return () => {
			if (observer) {
				observer.unobserve(imgElement);
			}
		};
	}

	onMount(setupObserver);

    const resetSelf = () => {
        if (initial_mount_complete) {
            intersected = false;
            loaded = false;
            path = placeholder;
            setupObserver();
        }
    }

    $: src && resetSelf();

	function handleLoad() {
		if (!loaded && path === src) {
			loaded = true;
		}
	}
</script>

<span class="w-[9vw] h-[9vw] flex items-center">
    <img
        src={path}
        {alt}
        on:load={handleLoad}
        bind:this={imgElement}
        {...$$restProps}
        class="svelte-lazy-image {cssClass}"
        class:svelte-lazy-image--loaded={loaded}
    />
</span>
