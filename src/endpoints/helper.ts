async function asyncQueryHelper<T>(
  url: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(url, init);
  const data: T = await response.json();

  return data;
}

export default asyncQueryHelper;
