
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { Pagination } from "../../model/domain.interface";
import { Alert, Center, Spinner } from "@chakra-ui/react";

export type InfiniteScrollProps<T> = {
	children: (data: T[]) => React.ReactNode;
	queryKey: string[];
	fetchPage: (page?: number, limit?: number) => Promise<Pagination<T>>;
};

export function InfiniteScroll<T>({ children, queryKey, fetchPage }: InfiniteScrollProps<T>) {
  const [ref, entry] = useIntersectionObserver();
  const { data, isError, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery<
    Pagination<T>
  >({
    queryKey,
    queryFn: ({ pageParam }) => fetchPage(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: ({ meta }) =>
      meta.currentPage < meta.totalPages ? meta.currentPage + 1 : undefined,
    getPreviousPageParam: ({ meta }) => {
      if (meta.currentPage <= 1) {
        return undefined;
      }
      return meta.currentPage - 1
    },
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return <Center><Spinner /></Center>
  }

  if (isError) {
    return (
      <Alert.Root status="error">
        <Alert.Indicator />
        <Alert.Title>An error occurred while fetching</Alert.Title>
      </Alert.Root>
    )
  }

  return (
    <>
			{children(data?.pages.flatMap(p => p.items) || [])}
      {isFetchingNextPage && <Spinner />}
      <div ref={ref}></div>
    </>
  );
};
