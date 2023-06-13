export const url = process.env.NEXT_PUBLIC_APP_URL;

type FetchParams = {
	endpoint: string;
	method: 'GET' | 'POST';
	body?: any;
};

export const api = async ({ endpoint, method, body }: FetchParams) => {
	const response: Response = await fetch(`${url}${endpoint}`, {
		method,
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});

	const data = await response.json();

	console.log(JSON.parse(data));

	return JSON.parse(data);
};
