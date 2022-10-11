import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'react-feather'

interface Props {
  totalPages: number
  handlePageChange: (page: number) => void
  curPage: number
  resultsLength: number
  resultsPerPage: number
}

export const Pagination = (props: Props) => {
  const { curPage, handlePageChange, resultsLength, resultsPerPage } = props
  const totalPages = props.totalPages || 1

  return (
    <div className="px-4 py-3 flex items-center justify-between sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden items-center ">
        <button
          onClick={() => handlePageChange(curPage - 1)}
          disabled={curPage === 1}
          className="disabled:opacity-50 disabled:pointer-events-none relative inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-500 text-sm font-medium rounded-md text-slate-600 dark:text-slate-400  hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          Previous
        </button>

        <span className="text-slate-500">Page {curPage}</span>
        <button
          onClick={() => handlePageChange(curPage + 1)}
          className="btn disabled:opacity-50 disabled:pointer-events-none"
          disabled={curPage === totalPages}
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Showing{' '}
            <span className="font-medium">
              {(curPage - 1) * resultsPerPage + 1}
            </span>{' '}
            to <span className="font-medium">{curPage * resultsPerPage}</span>{' '}
            of <span className="font-medium">{resultsLength}</span> results
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={() => handlePageChange(1)}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <span className="sr-only">First</span>
              <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              onClick={() => handlePageChange(curPage - 1)}
              disabled={curPage === 1}
              className="relative inline-flex items-center px-2 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <span className="sr-only">First</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            {curPage === totalPages && totalPages > 2 && (
              <button
                onClick={() => handlePageChange(curPage - 2)}
                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
              >
                {curPage - 2}
              </button>
            )}
            {curPage !== 1 && (
              <button
                onClick={() => handlePageChange(curPage - 1)}
                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
              >
                {curPage - 1}
              </button>
            )}
            <button
              aria-current="page"
              disabled
              className="z-10 bg-primary-50 border-primary-500 text-primary-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              {curPage}
            </button>
            {curPage !== totalPages && (
              <button
                onClick={() => handlePageChange(curPage + 1)}
                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
              >
                {curPage + 1}
              </button>
            )}
            {curPage === 1 && totalPages > 2 && (
              <button
                onClick={() => handlePageChange(curPage + 2)}
                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
              >
                {curPage + 2}
              </button>
            )}
            <button
              onClick={() => handlePageChange(curPage + 1)}
              disabled={curPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <span className="sr-only">Last</span>
              <ChevronsRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}
