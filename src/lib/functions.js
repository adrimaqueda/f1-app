import moment from 'moment/moment';
import 'moment/locale/es';

export function formatDate(date, options) {
	const d = new Date(date);
	const o = options === 'full' ? { month: 'long', year: 'numeric' } : options;

	return d.toLocaleDateString('es-ES', { day: 'numeric', ...o });
}

export function formatInterval(date1, date2) {
	const d1 = new Date(date1);
	const d2 = new Date(date2);

	if (d1.getMonth() === d2.getMonth()) {
		return `${formatDate(d1)} - ${formatDate(d2, 'full')}`;
	} else return `${formatDate(d1, { month: 'long' })} - ${formatDate(d2, 'full')}`;
}

export function getNumberOfDays(date) {
	moment.locale('es');
	return moment(date).fromNow();
}
