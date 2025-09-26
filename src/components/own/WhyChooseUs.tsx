import {
  Users,
  Laptop,
  FileText,
  CheckSquare,
  Microscope,
  BookOpen,
  Heart,
  FileInput,
} from "lucide-react";
import WhyChooseCard from "./WhyChooseCard";

// Represents the data structure for a single service card.
type WhyChoose = {
  title: string;
  icon: React.ReactNode;
  description: string;
};

export default function WhyChooseUs() {
  // Data for the service cards.
  const whyChoose: WhyChoose[] = [
    {
      title: "Offline Master Classes",
      icon: <Users className="text-red-600" size={32} />,
      description: "Get comprehensive training in our physical classrooms.",
    },
    {
      title: "Online Master Classes",
      icon: <Laptop className="text-red-600" size={32} />,
      description:
        "Learn from anywhere with our live and recorded online classes.",
    },
    {
      title: "Medical Admission Exam (1st Phase)",
      icon: <FileText className="text-red-600" size={32} />,
      description:
        "Prepare for the first phase of medical school entrance exams.",
    },
    {
      title: "Medical Admission Exam (2nd Phase)",
      icon: <CheckSquare className="text-red-600" size={32} />,
      description: "Advance your preparation for the second phase of exams.",
    },
    {
      title: "Special Exams",
      icon: <Microscope className="text-red-600" size={32} />,
      description: "Access specialized practice tests for specific topics.",
    },
    {
      title: "Publications",
      icon: <BookOpen className="text-red-600" size={32} />,
      description: "Find our official guides and question banks.",
    },
    {
      title: "Medical Mentor Support",
      icon: <Heart className="text-red-600" size={32} />,
      description:
        "Receive personalized guidance from our experienced mentors.",
    },
    {
      title: "Extra Information Sheets",
      icon: <FileInput className="text-red-600" size={32} />,
      description: "Get bonus study materials to boost your knowledge.",
    },
  ];
  return (
    <div className="py-8">
      <div className="container mx-auto px-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
          {whyChoose.map((choose, index) => (
            <WhyChooseCard key={index} choose={choose} />
          ))}
        </div>
      </div>
    </div>
  );
}