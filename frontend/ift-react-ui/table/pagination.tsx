interface PaginationProps {
  postsPerPage: number;
  totalPosts: number;
  currentPage: number;
  paginate: any;
}

const Pagination = (props: PaginationProps) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(props.totalPosts / props.postsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="absolute bottom-0">
      <div className="fixed bottom-0 w-5/6">
        <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6 border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>

          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {" "}
                  {(props.currentPage - 1) * props.postsPerPage + 1}{" "}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {" "}
                  {Math.min(
                    props.currentPage * props.postsPerPage,
                    props.totalPosts
                  )}{" "}
                </span>{" "}
                of <span className="font-medium"> {props.totalPosts} </span>{" "}
                results
              </p>
            </div>

            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  onClick={() => {
                    if (props.currentPage - 1 >= 1)
                      props.paginate(props.currentPage - 1);
                  }}
                >
                  <span className="sr-only">Previous</span>
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}
                {pageNumbers.map((number) => {
                  if (number === props.currentPage) {
                    return (
                      <button
                        key={number}
                        className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                        onClick={() => props.paginate(number)}
                      >
                        {number}
                      </button>
                    );
                  } else {
                    return (
                      <button
                        key={number}
                        className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                        onClick={() => props.paginate(number)}
                      >
                        {number}
                      </button>
                    );
                  }
                })}

                <button
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  onClick={() => {
                    if (props.currentPage + 1 <= totalPages)
                      props.paginate(props.currentPage + 1);
                  }}
                >
                  <span className="sr-only">Next</span>
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
