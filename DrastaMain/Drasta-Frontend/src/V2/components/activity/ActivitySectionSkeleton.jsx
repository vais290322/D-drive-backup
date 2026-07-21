export const ActivitySectionSkeleton = ({ isCardOnLeft }) => {
    const skeletonCarouselSection = (
      <div className="bg-gray-200 sm:bg-gray-300 rounded-xl flex items-center justify-center animate-pulse">
        <div className="relative w-full overflow-hidden ml-0 sm:ml-4 h-[250px] md:h-[70%]">
          <div className="flex w-full sm:w-[80%] h-full">
            <div className="w-full flex-shrink-0 pr-0 sm:pr-3">
              <div className="bg-white rounded-lg shadow-sm border h-full">
                <div className="p-2 sm:p-3 md:p-4 h-full">
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 md:gap-4 h-full">
                    <div className="w-full sm:w-[100px] md:w-[120px] lg:w-[140px] h-[120px] sm:h-full bg-gray-300 rounded-md flex-shrink-0 animate-pulse"></div>
                    <div className="w-full sm:h-full flex flex-col justify-between py-1 sm:py-2 md:py-3">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                      </div>
                      <div className="h-3 bg-gray-300 rounded w-1/3 mt-2 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  
    const skeletonTextSection = (
      <div className="bg-white p-6 sm:p-8 rounded-lg border h-[250px] animate-pulse">
        <div className="h-6 sm:h-8 bg-gray-300 rounded w-2/3 mb-4 sm:mb-6"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-4/5"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    );
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-stretch">
        {isCardOnLeft ? (
          <>
            {skeletonCarouselSection}
            {skeletonTextSection}
          </>
        ) : (
          <>
            {skeletonTextSection}
            {skeletonCarouselSection}
          </>
        )}
      </div>
    );
  };