
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Pagination } from "../../domain.interface";

export type InfiniteScrollProps<T> = {
	children: (data: T[]) => JSX.Element;
	queryKey: string[];
	queryFn: (page?: number, limit?: number) => Promise<Pagination<T>>;
};

export function InfiniteScroll<T>({ children, queryKey, queryFn }: InfiniteScrollProps<T>) {
  const { ref, inView } = useInView();
  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery<
    Pagination<T>
  >({
    queryKey,
    getNextPageParam: (prevPage) => {
      if (prevPage.meta.currentPage === prevPage.meta.totalPages - 1) {
        return undefined;
      }
      return prevPage.meta.currentPage + 1;
    },
    getPreviousPageParam: (nextPage) => nextPage.meta.currentPage - 1,
    queryFn: ({ pageParam = 1, meta }) => queryFn(pageParam),
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return (
    <>
			{children(data?.pages.flatMap(p => p.items) || [])}
      <div ref={ref}></div>
    </>
  );
};
