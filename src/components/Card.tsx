interface CardProps {
  emoji: string;
  title: string;
  description: string;
  buttonText: string;
  disabled: boolean;
}

export default function Card({
  emoji,
  title,
  description,
  buttonText,
  disabled,
}: CardProps) {
  return (
    <div className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="text-[60px] sm:text-[80px] md:text-[100px] text-center">
        {emoji}
      </div>

      <a href={`/${title}`}>
        <h5 className="mb-5 text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
          {title}
        </h5>
      </a>
      <p className="mb-5 font-normal text-gray-700 dark:text-gray-400 text-center text-sm sm:text-base">
        {description}
      </p>
      <a
        href={`/${title}`}
        className={`inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full ${
          disabled ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {buttonText}
        <svg
          className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      </a>
    </div>
  );
}
