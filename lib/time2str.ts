export const sec2time = (timeInSeconds: string): string => {
	let pad = function(num, size) { return ('000' + num).slice(size * -1); };
	let time: string = timeInSeconds;
	let minutes = Math.floor(Number(time) / 60) % 60;
	let seconds = Math.floor(Number(time) - minutes * 60);
	let duration: string = pad(minutes, 2) + ':' + pad(seconds, 2);
	return duration;
  }