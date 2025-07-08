interface DefaultHeadingProps {
  title: string;
  description: string;
}

export default function DefaultHeading({
  title,
  description,
}: DefaultHeadingProps) {
  return (
    <>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Welcome to{" "}
        <span className="text-blue-600 dark:text-blue-500">{title}</span>
      </h1>
      <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400 text-center">
        {description}
      </p>
    </>
  );
}
