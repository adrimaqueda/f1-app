import { browser } from '$app/environment';
import { getMeetings, getMeeting, getSessions } from '$lib/data.remote';

function getInitialSeason() {
	if (!browser) return 2025;
	const saved = localStorage.getItem('selectedSeason');
	return saved ? parseInt(saved, 10) : 2025;
}

class CacheStore {
	meetings = $state(new Map());
	meetingDetails = $state(new Map());
	sessions = $state(new Map());
	selectedSeason = $state(getInitialSeason());

	setSeason(year) {
		this.selectedSeason = year;
		if (browser) {
			localStorage.setItem('selectedSeason', year.toString());
		}
	}

	async getMeetings(year) {
		const key = year.toString();
		if (this.meetings.has(key)) {
			return this.meetings.get(key);
		}
		const data = await getMeetings(year);
		this.meetings.set(key, data);
		return data;
	}

	async getMeeting(meetingKey) {
		if (this.meetingDetails.has(meetingKey)) {
			return this.meetingDetails.get(meetingKey);
		}
		const data = await getMeeting(meetingKey);
		this.meetingDetails.set(meetingKey, data);
		return data;
	}

	async getSessions(meetingKey) {
		if (this.sessions.has(meetingKey)) {
			return this.sessions.get(meetingKey);
		}
		const data = await getSessions(meetingKey);
		this.sessions.set(meetingKey, data);
		return data;
	}

	clear() {
		this.meetings.clear();
		this.meetingDetails.clear();
		this.sessions.clear();
	}
}

export const store = new CacheStore();
