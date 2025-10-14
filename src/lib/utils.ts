import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

//W---------{ common CN function for CSS }----------
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//W---------={ Reusable fadeUp animation function }=----------</br>
export const fadeUpAnimation = (y = 0, duration = 0, delay = 0) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration, delay },
});

//W---------={ Reusable fadeRight animation function }=----------</br>
export const fadeRightAnimation = (x = 20, duration = 0.5, delay = 0) => ({
  initial: { opacity: 0, x },
  animate: { opacity: 1, x: 0 },
  transition: { duration, delay },
});


//W---------={ FadeUp Animation }=----------</br>
export const fadeUp = {
  hidden: (y = 0) => ({
    opacity: 0,
    y: y,
  }),
  visible: ({ delay = 0, y = 0 } = {}) => ({
    opacity: 1,
    y: y,
    transition: { duration: 0.8, delay },
  }),
};
