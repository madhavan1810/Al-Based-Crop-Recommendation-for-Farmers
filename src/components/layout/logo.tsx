export function Logo() {
  return (
    <div className="flex items-center gap-2 p-2">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-primary"
      >
        <path
          d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 19C19.5304 18.4696 19.8284 17.7652 19.8284 17C19.8284 16.2348 19.5304 15.5304 19 15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 14V11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 21V18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 18C17.6569 18 19 16.6569 19 15C19 13.3431 17.6569 12 16 12C14.3431 12 13 13.3431 13 15C13 16.6569 14.3431 18 16 18Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <h2 className="font-headline text-xl font-semibold text-foreground group-data-[collapsible=icon]:hidden">
        FarmBharat.AI
      </h2>
    </div>
  );
}
