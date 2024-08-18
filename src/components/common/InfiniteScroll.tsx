
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { Pagination } from "../../model/domain.interface";
import { Alert, Center, Spinner } from "@chakra-ui/react";

export type InfiniteScrollProps<T> = {
	children: (data: T[]) => JSX.Element;
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
    getNextPageParam: ({ meta }) => {
      const { currentPage, totalPages } = meta;
      if (currentPage >= totalPages) { 
        return undefined;
      }
      if (currentPage === totalPages - 1) {
        return undefined;
      }
      return currentPage + 1;
    },
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
    return <Alert>An error occurred while fetching</Alert>
  }

  return (
    <>
			{children(data?.pages.flatMap(p => p.items) || [])}
      {isFetchingNextPage && <Spinner />}
      <div ref={ref}></div>
    </>
  );
};
