export type AsyncQueryResponse<T, H extends string = ''> = Record<H, any> & {
  data: T;
};

async function asyncQueryHelper<T, H extends string = ''>(
  url: RequestInfo | URL,
  init?: RequestInit,
  headers: H[] = []
): Promise<AsyncQueryResponse<T, H>> {
  const response = await fetch(url, init);
  const data: T = await response.json();
  const obj = headers.reduce(
    (prev, curr) => {
      return {
        ...prev,
        [curr]: response.headers.get(curr),
      };
    },
    {
      data,
    }
  ) as AsyncQueryResponse<T, H>;

  return obj;
}

export default asyncQueryHelper;
