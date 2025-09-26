type WhyChoose = {
  title: string;
  icon: React.ReactNode;
  description: string;
};

export default function WhyChooseCard({ choose }: { choose: WhyChoose }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center space-y-4 ring-1 ring-slate-200 dark:ring-slate-800 transition-transform transform hover:scale-105 hover:shadow-xl dark:border dark:border-slate-800">
      <div className="p-4 rounded-full bg-red-50 dark:bg-red-950">
        {choose.icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        {choose.title}
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        {choose.description}
      </p>
    </div>
  );
}
