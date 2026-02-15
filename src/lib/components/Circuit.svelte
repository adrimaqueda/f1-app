<script>
	let { circuitData, showDot = false, strokeWidth = '1' } = $props();

	const hasData = $derived(circuitData && circuitData.x && circuitData.y);

	const { x, y, corners, rotation } = circuitData || { x: [], y: [], corners: [], rotation: 0 };

	// Rotate points around center first, then compute everything from rotated coords
	const origCx = (Math.min(...x) + Math.max(...x)) / 2;
	const origCy = (Math.min(...y) + Math.max(...y)) / 2;
	const rad = (-rotation * Math.PI) / 180;
	const cos = Math.cos(rad);
	const sin = Math.sin(rad);

	const rotated = x.map((xCoord, i) => {
		const dx = xCoord - origCx;
		const dy = -(y[i] - origCy);
		return { x: origCx + dx * cos - dy * sin, y: origCy + dx * sin + dy * cos };
	});

	const pathData = rotated.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

	const minX = Math.min(...rotated.map((p) => p.x));
	const maxX = Math.max(...rotated.map((p) => p.x));
	const minY = Math.min(...rotated.map((p) => p.y));
	const maxY = Math.max(...rotated.map((p) => p.y));

	const width = maxX - minX;
	const height = maxY - minY;
	const padding = 500;

	const viewBox = `${minX - padding} ${minY - padding} ${width + padding * 2} ${height + padding * 2}`;
</script>

{#if !hasData}
	<div class="no-circuit">No circuit available</div>
{:else}
	<svg {viewBox} xmlns="http://www.w3.org/2000/svg">
		<path
			d={pathData}
			fill="none"
			stroke="#fefefe"
			stroke-width={strokeWidth}
			stroke-linecap="round"
			stroke-linejoin="round"
			vector-effect="non-scaling-stroke"
		/>

		{#if showDot}
			<circle
				r={+strokeWidth * 3}
				fill="red"
				stroke="red"
				stroke-width={+strokeWidth * 3}
				vector-effect="non-scaling-stroke"
			>
				<animateMotion dur="10s" repeatCount="indefinite" path={pathData} />
			</circle>
		{/if}
	</svg>
{/if}

<style>
	svg {
		width: auto;
		height: 100%;
		border-radius: 8px;
	}

	.no-circuit {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: #666;
		font-size: 0.9rem;
	}
</style>
