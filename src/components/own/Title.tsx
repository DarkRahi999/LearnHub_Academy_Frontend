import React from 'react';

interface TitleProps {
  title: string;
  description: string;
}

export default function Title({ title, description }: TitleProps) {
  return (
    <div className="text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-red-700 mb-2">
        {title}
      </h2>
      <p className="text-sm md:text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
        {description}
      </p>
    </div>
  );
}