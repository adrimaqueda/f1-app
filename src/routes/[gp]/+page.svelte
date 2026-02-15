<script>
	import { store } from '$lib/store.svelte';
	import { page } from '$app/state';
	import Circuit from '$lib/components/Circuit.svelte';
	import { formatInterval, formatDate } from '$lib/functions';
	import { fly, fade } from 'svelte/transition';

	const [sessions, gpInfo] = $derived(
		await Promise.all([store.getSessions(page.params.gp), store.getMeeting(page.params.gp)])
	);

	$inspect(sessions);
</script>

{#snippet standings(data, sessionLaps)}
	{@const diff =
		!data.gap_to_leader || data.gap_to_leader.toString().includes('LAP')
			? data.gap_to_leader
			: `+${data.gap_to_leader} s`}
	<div
		class={['result', (data.dnf || data.dsq || data.dns) && 'dnf']}
		transition:fly|global={{ y: 200, delay: data.position * 30 }}
	>
		<div class="driver-info" style:border-left-color="#{data.driver?.team_colour}">
			<span class="position">
				{#if data.position !== null}{data.position}º{/if}
			</span>
			<span class="driver-name">
				{data.driver?.name ?? data.driver_number}
			</span>
			{#if data.dnf}
				<span class="gap">DNF</span>
			{:else if data.dsq}
				<span class="gap">DSQ</span>
			{:else if data.position !== 1 && data.position !== null}
				<span class="gap">{diff}</span>
			{/if}
		</div>
		<div class="stints">
			{#if data.dns}
				<span class="dns">DNS</span>
			{:else}
				<svg class="stint" height={30} width="95%">
					{#each data.stints as stint}
						{@const stintStart = stint.lap_start}
						{@const stintEnd =
							stint.lap_end !== null &&
							stint.stint_number !== data.stints.length &&
							stint.lap_end !== data.stints[stint.stint_number]?.lap_start
								? stint.lap_end + 1
								: stint.lap_end}

						{@const stintLength = ((stintEnd - stintStart) / sessionLaps) * 100}
						<rect
							x={(stintStart / sessionLaps) * 100 + '%'}
							y="1"
							width={stintLength + '%'}
							height="10"
							fill="var(--{stint.compound.toLowerCase()})"
							stroke="black"
							stroke-width="1"
							rx="5"
						/>

						{#if stint.stint_number !== data.stints.length}
							<text y="30" x={(stintEnd / sessionLaps) * 100 + '%'}>{stintEnd}</text>
						{/if}
					{/each}
				</svg>
			{/if}
		</div>
	</div>
{/snippet}

<svelte:boundary>
	{#key page.params.gp}
		<div class="gp-header" transition:fade|global>
			<div class="gp-info">
				<div class="gp-title">
					<img class="country-flag" src={gpInfo.country_flag} alt={gpInfo.country_name} />
					<h1>{gpInfo.meeting_name}</h1>
				</div>
				<p class="location">{gpInfo.location}, {gpInfo.country_name}</p>
				<p class="dates">{formatInterval(gpInfo.date_start, gpInfo.date_end)}</p>
			</div>
			<div class="circuit-container">
				<Circuit circuitData={gpInfo.circuitTrack} showDot={true} strokeWidth="3" />
			</div>
		</div>

		<div class="sessions-container" transition:fade|global>
			{#if sessions.length > 1}
				{#each sessions as { session, results }}
					{@const sessionLaps = results[0].number_of_laps}
					<details open={session.session_name === 'Race'}>
						<summary>
							<span class="session-name"> <span class="arrow">▼</span> {session.session_name}</span>
							<span class="session-date">{formatDate(session.date_start, 'full')}</span>
						</summary>
						<div class="results-container">
							{#each results as result}
								{@render standings(result, sessionLaps)}
							{/each}
						</div>
					</details>
				{/each}
			{:else}
				{@const results = sessions[0].results}
				{@const session = sessions[0].session}
				{@const sessionLaps = results[0].number_of_laps}
				<div class="single-session">
					<h2>{session.session_name} - {formatDate(session.date_start, 'full')}</h2>
					<div class="results-container">
						{#each results as result}
							{@render standings(result, sessionLaps)}
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/key}

	<div class="menu">
		<a href="/" class="back-link">
			<span>←</span> Back to Races
		</a>
	</div>

	{#snippet pending()}
		<div class="loading">
			<div class="spinner"></div>
			<p>Loading session data...</p>
		</div>
	{/snippet}

	{#snippet failed(error)}
		<div class="error">
			<p>Error: {error.message}</p>
		</div>
	{/snippet}
</svelte:boundary>

<style>
	.gp-header {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		padding: 2rem;
		background-color: #1f1f2e;
		margin: 0 2rem;
		border-radius: 16px;
		gap: 2rem;
	}

	.gp-info {
		flex: 1;
		min-width: 250px;
	}

	.gp-title {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 0.5rem;
	}

	.country-flag {
		width: 48px;
		height: auto;
		border-radius: 4px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}

	h1 {
		font-size: 2rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 2px;
		color: #f0f0f0;
	}

	.location {
		font-size: 1.1rem;
		color: #888;
		margin-bottom: 0.25rem;
	}

	.dates {
		font-size: 0.95rem;
		color: #e10600;
		font-weight: 300;
	}

	.circuit-container {
		position: relative;
		max-width: 300px;
		width: 100%;
		height: auto;
		border-radius: 12px;
		padding: 1rem;
	}

	.sessions-container {
		padding: 2rem;
		margin-bottom: 4rem;
	}

	details {
		margin-bottom: 1.5rem;
		background: #1f1f2e;
		border-radius: 12px;
		overflow: hidden;
		border: solid 2px #aeaeae;
	}

	summary {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.25rem 1.5rem;
		background: #252536;
		cursor: pointer;
		list-style: none;
		transition: background 0.2s ease;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	summary:hover {
		background: #2a2a40;
	}

	.session-name {
		font-size: 1.2rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 1px;
		color: #f0f0f0;

		.arrow {
			display: inline-block;
			transform: rotate(-90deg);
			transition: transform 0.3s;
		}
	}

	details[open] .arrow {
		transform: rotate(0);
	}

	.session-date {
		font-size: 0.9rem;
		color: #888;
	}

	.results-container {
		display: flex;
		flex-direction: column;
	}

	.result {
		display: flex;
		align-items: center;
		padding: 0.75rem 1.5rem;
		border-bottom: 1px solid #2a2a3e;
	}

	.result:last-child {
		border-bottom: none;
	}

	.result:hover {
		background: #252536;
	}

	.result.dnf {
		opacity: 0.4;
	}

	.driver-info {
		display: flex;
		align-items: center;
		gap: 1rem;
		min-width: 200px;
		flex: 1;
		border-left: solid 8px;
	}

	.position {
		font-weight: 700;
		font-size: 1.1rem;
		padding-left: 0.5rem;
		min-width: 35px;
	}

	.driver-name {
		font-weight: 400;
		flex: 1;
	}

	.gap {
		color: #e10600;
		font-weight: 600;
		font-size: 0.9rem;
	}

	.stints {
		flex: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		min-width: 200px;
	}

	.dns {
		color: #e10600;
		font-weight: 600;
		font-size: 0.9rem;
	}

	.stint {
		--soft: #ff3333;
		--medium: #ffd700;
		--hard: #cccccc;
		--intermediate: #33cc33;
		--wet: #1e90ff;
		width: 100%;
	}

	.stint text {
		font-size: 10px;
		font-family: 'Titillium Web', sans-serif;
		fill: #888;
	}

	.single-session h2 {
		font-size: 1.3rem;
		text-transform: uppercase;
		letter-spacing: 1px;
		margin-bottom: 1rem;
		color: #f0f0f0;
	}

	.menu {
		position: fixed;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 100;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background: rgba(31, 31, 46, 0.5);
		backdrop-filter: blur(10px);
		padding: 0.75rem 1.5rem;
		border-radius: 100px;
		border: 2px solid #e10600;
		color: #f0f0f0;
		font-weight: 500;
		transition: all 0.2s ease;
	}

	.back-link:hover {
		background: #e10600;
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
	}

	@media (max-width: 768px) {
		.gp-header {
			flex-direction: column-reverse;
			text-align: center;
			margin: 0 1rem;
			padding: 1.5rem;
		}

		.gp-title {
			flex-direction: column;
		}

		.circuit-container {
			max-width: 100%;
		}

		.sessions-container {
			padding: 1rem;
		}

		.result {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.stints {
			width: 100%;
		}

		.driver-info {
			width: 100%;
		}
	}
</style>
