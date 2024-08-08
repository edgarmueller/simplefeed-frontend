
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Pagination } from "../../model/domain.interface";
import { Spinner } from "@chakra-ui/react";

export type InfiniteScrollProps<T> = {
	children: (data: T[]) => JSX.Element;
	queryKey: string[];
	fetchPage: (page?: number, limit?: number) => Promise<Pagination<T>>;
};

export function InfiniteScroll<T>({ children, queryKey, fetchPage }: InfiniteScrollProps<T>) {
  const { ref, inView } = useInView();
  const { data, isError, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery<
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
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return (
    <>
      {isError ? <div>An error occurred while fetching</div> : null}
			{children(data?.pages.flatMap(p => p.items) || [])}
      {isFetchingNextPage && <Spinner />}
      <div ref={ref}></div>
    </>
  );
};
