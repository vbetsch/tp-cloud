export const fetchJsonByUrl = async (url: string, options: RequestInit) => {
	const response: Response = await fetch(url, options);
	return await response.json();
};
