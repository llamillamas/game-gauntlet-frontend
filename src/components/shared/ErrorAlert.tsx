import clsx from 'clsx'

interface ErrorAlertProps {
  error?: Error | string | null
  title?: string
  className?: string
  onRetry?: () => void
}

export function ErrorAlert({
  error,
  title = 'Something went wrong',
  className,
  onRetry,
}: ErrorAlertProps) {
  if (!error) return null

  const message = typeof error === 'string' ? error : error.message

  return (
    <div
      className={clsx(
        'bg-gg-error/10 border border-gg-error text-gg-error rounded-lg p-4',
        className,
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className="text-lg">⚠️</span>
        <div className="flex-1">
          <p className="font-semibold">{title}</p>
          {message && <p className="text-sm mt-1 opacity-80">{message}</p>}
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
