import { query } from '$app/server';
import * as v from 'valibot';


async function fetchWithRetry(url) {
	const response = await fetch(url);
	if (response.status === 429) {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		return fetch(url).then((r) => r.json());
	}
	return response.json();
}

export const getMeetings = query(v.number(), async (year) => {
	const meetings = await fetch(`https://api.openf1.org/v1/meetings?year=${year}`).then((response) =>
		response.json()
	);

	const enriched = await Promise.all(
		meetings.map(async (meeting) => {
			if (!meeting.circuit_info_url) {
				return { ...meeting, circuitTrack: null };
			}
			try {
				const circuitInfo = await fetch(meeting.circuit_info_url).then((response) =>
					response.json()
				);
				return { ...meeting, circuitTrack: circuitInfo };
			} catch {
				return { ...meeting, circuitTrack: null };
			}
		})
	);

	return enriched;
});

export const getMeeting = query('unchecked', async (meetingKey) => {
	const data = await fetchWithRetry(`https://api.openf1.org/v1/meetings?meeting_key=${meetingKey}`);
	const meeting = data[0];

	if (!meeting?.circuit_info_url) {
		return { ...meeting, circuitTrack: null };
	}

	try {
		const circuitInfo = await fetch(meeting.circuit_info_url).then((r) => r.json());
		return { ...meeting, circuitTrack: circuitInfo };
	} catch {
		return { ...meeting, circuitTrack: null };
	}
});

export const getSessions = query('unchecked', async (meetingKey) => {
	const sessions = await fetchWithRetry(
		`https://api.openf1.org/v1/sessions?meeting_key=${meetingKey}&session_type=Race`
	);

	const results = [];

	for (let i = 0; i < sessions.length; i++) {
		const sessionKey = sessions[i].session_key;

		const [sessionResults, stints, drivers] = await Promise.all([
			fetchWithRetry(`https://api.openf1.org/v1/session_result?session_key=${sessionKey}`),
			fetchWithRetry(`https://api.openf1.org/v1/stints?session_key=${sessionKey}`),
			fetchWithRetry(`https://api.openf1.org/v1/drivers?session_key=${sessionKey}`)
		]);

		const stintsByDriver = stints.reduce((acc, stint) => {
			if (!acc[stint.driver_number]) {
				acc[stint.driver_number] = [];
			}
			acc[stint.driver_number].push(stint);
			return acc;
		}, {});

		const driversByNumber = Object.fromEntries(
			drivers.map((d) => [
				d.driver_number,
				{
					name: d.first_name + ' ' + d.last_name,
					team_colour: d.team_colour,
					team_name: d.team_name
				}
			])
		);

		const enrichedResults = sessionResults.map((result) => ({
			...result,
			stints: stintsByDriver[result.driver_number] || [],
			driver: driversByNumber[result.driver_number]
		}));

		results.push({
			session: sessions[i],
			results: enrichedResults
		});
	}

	return results;
});
