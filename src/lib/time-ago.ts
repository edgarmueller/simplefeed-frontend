import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";


function getLang() {
  if (navigator.languages !== undefined) 
    return navigator.languages[navigator.languages.length - 1]; 
  return navigator.language;
}

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo(getLang());

export const formatTimeAgo = (dateString: string) => {
	// timeago doesn't seem to consider timezone (?)
	const date = new Date(new Date(dateString).getTime() - new Date().getTimezoneOffset() * 60 * 1000);
	return timeAgo.format(date);
}