"use client"

export const Loading = () => {
    return (
        <div className="h-full w-full flex justify-center items-center">
            <div className="animate-pulse">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="4" opacity="0.3" />
                    <circle cx="60" cy="60" r="40" stroke="currentColor" strokeWidth="4" opacity="0.5" />
                    <circle cx="60" cy="60" r="30" stroke="currentColor" strokeWidth="4" opacity="0.7" />
                    <circle cx="60" cy="60" r="20" stroke="currentColor" strokeWidth="4" opacity="0.9" />
                    <circle cx="60" cy="60" r="10" fill="currentColor" />
                </svg>
            </div>
        </div>
    )
}