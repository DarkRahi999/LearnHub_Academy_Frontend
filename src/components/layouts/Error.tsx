interface IProps {
  error: string;
}

const Error = ({ error }: IProps) => {
  return (
    <div className="flex justify-center items-center h-[380px]">
      <p className="text-lg text-red-600 dark:text-red-700">Error: {error}</p>
    </div>
  );
};

export default Error;
