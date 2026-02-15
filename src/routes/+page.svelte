<script>
	import Circuit from '$lib/components/Circuit.svelte';
	import { store } from '$lib/store.svelte';
	import { formatInterval, getNumberOfDays } from '$lib/functions';
	import { fly } from 'svelte/transition';

	const meetings = $derived(
		((await store.getMeetings(store.selectedSeason)) ?? []).filter(
			(d) => d.meeting_name !== 'Pre-Season Testing'
		)
	);

	function transtionOptions(i) {
		return { y: 200, delay: i * 30 };
	}

	function handleSeasonChange(e) {
		store.setSeason(parseInt(e.target.value, 10));
	}
</script>

{#snippet grandPrixBox(meeting, link)}
	<div class="card-header">
		<img class="gp-flag" src={meeting.country_flag} alt={meeting.country_name} />
		<span class="gp-name">{meeting.meeting_name}</span>
	</div>
	<div class="circuit-container">
		<Circuit circuitData={meeting.circuitTrack} />
	</div>
	<div class="card-footer">
		<span class="gp-date">{formatInterval(meeting.date_start, meeting.date_end)}</span>
		{#if link}
			<span class="arrow">→</span>
		{:else}
			<span>{getNumberOfDays(meeting.date_end)}</span>
		{/if}
	</div>
{/snippet}

<div class="select-container">
	<p>Mostrar las carreras de</p>
	<select value={store.selectedSeason} onchange={handleSeasonChange}>
		{#each [2023, 2024, 2025, 2026] as year}
			<option value={year}>{year}</option>
		{/each}
	</select>
</div>

<svelte:boundary>
	<div class="grand-prix-container">
		{#each meetings as meeting, i (meeting.meeting_key)}
			{#if new Date(meeting.date_end) <= new Date()}
				<a
					class="grand-prix"
					href={`/${meeting.meeting_key}`}
					transition:fly|global={{ ...transtionOptions(i) }}
				>
					{@render grandPrixBox(meeting, true)}
				</a>
			{:else}
				<div class="grand-prix" transition:fly|global={{ ...transtionOptions(i) }}>
					{@render grandPrixBox(meeting)}
				</div>
			{/if}
		{/each}
	</div>

	{#snippet pending()}
		<div class="loading">
			<div class="spinner"></div>
			<p>Loading races...</p>
		</div>
	{/snippet}

	{#snippet failed(error)}
		<div class="error">
			<p>Error loading meetings</p>
		</div>
	{/snippet}
</svelte:boundary>

<style>
	.grand-prix-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1.5rem;
		padding: 0 2rem 2rem;
		align-items: stretch;
	}

	.grand-prix {
		display: flex;
		flex-direction: column;
		background: #1f1f2e;
		border-radius: 16px;
		overflow: hidden;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
	}

	.card-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1.25rem;
		background: linear-gradient(135deg, #e10600 0%, #b30500 100%);
		flex-shrink: 0;
	}

	.grand-prix {
		display: grid;
		grid-template-rows: subgrid;
		grid-row: span 3;
		background: #15151e;
		border-radius: 16px;
		overflow: hidden;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
	}

	.grand-prix:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 30px rgba(225, 6, 0, 0.2);
	}

	.card-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1.25rem;
		background: linear-gradient(135deg, #e10600 0%, #b30500 100%);
	}

	.gp-flag {
		height: 24px;
		width: auto;
		border-radius: 4px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.gp-name {
		font-size: 1.1rem;
		font-weight: 600;
		color: white;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.circuit-container {
		height: 120px;
		padding: 1rem;
		background: #15151e;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.card-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.25rem;
		background: #1f1f2e;
		border-top: 1px solid #2a2a3e;
	}

	.gp-date {
		font-size: 0.9rem;
		color: #888;
		font-weight: 300;
	}

	.arrow {
		color: #e10600;
		font-size: 1.25rem;
		font-weight: 700;
		transition: transform 0.2s ease;
	}

	.grand-prix:hover .arrow {
		transform: translateX(4px);
	}

	.loading,
	.error {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 50vh;
		gap: 1rem;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 3px solid #2a2a3e;
		border-top-color: #e10600;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.error p {
		color: #e10600;
		font-size: 1.1rem;
	}

	.select-container {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 1.5rem 0;
		font-size: 1.5rem;

		select {
			background: #1f1f2e;
			color: white;
			padding: 0.5rem 1rem;
			border-color: #e10600;
			border-radius: 10px;
			font-size: 1.5rem;
			margin-left: 1rem;
		}
	}
</style>
