interface IProps {
  title: string;
  description: string;
  className?: string;
}

export default function Title({ title, description, className }: IProps) {
  return (
    <div className={`text-center ${className}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-red-700 mb-2">
        {title}
      </h2>
      <p className="text-sm md:text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
        {description}
      </p>
    </div>
  );
}