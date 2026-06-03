interface Props {
  error: string;
  handleRetry: () => void;
  isOpenCVReady: boolean;
  isProcessing: boolean;
  retryCount: number;
}

const maxRetries = 3;

const ContourStatus = ({
  error,
  handleRetry,
  isOpenCVReady,
  isProcessing,
  retryCount,
}: Props) => (
  <>
    {error && (
      <div className="text-red-500 mb-4 p-2 bg-red-100 rounded">
        <p className="mb-2">{error}</p>
        {retryCount >= maxRetries && (
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry Processing
          </button>
        )}
      </div>
    )}
    {isProcessing && (
      <div className="text-blue-500 mb-4 p-2 bg-blue-100 rounded">
        {retryCount > 0
          ? `Retrying... Attempt ${retryCount}/${maxRetries}`
          : "Processing image..."}
      </div>
    )}
    {!isOpenCVReady && (
      <div className="text-blue-500 mb-4 p-2 bg-blue-100 rounded">
        Loading OpenCV...
      </div>
    )}
  </>
);

export default ContourStatus;
