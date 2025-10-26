export interface ExamCourse {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExamCourseDto {
  name: string;
  description?: string;
}

export interface UpdateExamCourseDto {
  name?: string;
  description?: string;
}

export interface ExamCourseResponse {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}