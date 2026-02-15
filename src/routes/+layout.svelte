<script>
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Titillium+Web:wght@300;400;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<main>
	<header>
		<a href="/" class="logo">
			<span class="logo-f1">F1</span>
			<span class="logo-text">Race Tracker</span>
		</a>
	</header>
	{@render children()}
</main>

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(body) {
		background-color: #15151e;
		color: #f0f0f0;
		min-height: 100vh;
	}

	main {
		max-width: 1400px;
		width: 100%;
		margin: 0 auto;
		position: relative;
		font-family: 'Titillium Web', sans-serif;
		box-sizing: border-box;
		min-height: 100vh;
	}

	header {
		position: sticky;
		top: 0;
		z-index: 100;
		background: linear-gradient(180deg, #15151e 0%, #15151e 80%, transparent 100%);
		padding: 1.5rem 2rem 3rem;
	}

	.logo {
		display: inline-flex;
		align-items: center;
		text-decoration: none;
		color: #f0f0f0;
		gap: 0.5rem;
	}

	.logo-f1 {
		background: #e10600;
		color: white;
		font-weight: 700;
		font-size: 1.5rem;
		padding: 0.25rem 0.75rem;
		border-radius: 4px;
		letter-spacing: 1px;
	}

	.logo-text {
		font-size: 1.5rem;
		font-weight: 300;
		letter-spacing: 2px;
		text-transform: uppercase;
	}

	:global(a) {
		color: inherit;
		text-decoration: none;
	}
</style>
