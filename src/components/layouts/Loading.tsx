interface IProps {
  title: string;
}

const Loading = ({title}: IProps) => {
  return (
    <>
    <div className="flex justify-center items-center h-[380px]">
        <p className="text-lg text-slate-700 dark:text-slate-300">
          Loading {title}...
        </p>
      </div>
    </>
  )
}

export default Loading;