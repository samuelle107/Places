async function asyncQueryHelper<T>(
  url: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(url, init);
  console.log(response.headers.get('Link'));
  const data: T = await response.json();

  return data;
}

export default asyncQueryHelper;
