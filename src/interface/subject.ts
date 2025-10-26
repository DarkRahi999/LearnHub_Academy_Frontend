export interface Subject {
  id: number;
  name: string;
  courseId: number;
  groupId: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubjectDto {
  name: string;
  courseId: number;
  groupId: number;
  description?: string;
}

export interface UpdateSubjectDto {
  name?: string;
  courseId?: number;
  groupId?: number;
  description?: string;
}

export interface SubjectResponse {
  id: number;
  name: string;
  courseId: number;
  groupId: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}