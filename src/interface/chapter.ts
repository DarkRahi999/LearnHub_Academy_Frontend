export interface Chapter {
  id: number;
  name: string;
  courseId: number;
  groupId: number;
  subjectId: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateChapterDto {
  name: string;
  courseId: number;
  groupId: number;
  subjectId: number;
  description?: string;
}

export interface UpdateChapterDto {
  name?: string;
  courseId?: number;
  groupId?: number;
  subjectId?: number;
  description?: string;
}

export interface ChapterResponse {
  id: number;
  name: string;
  courseId: number;
  groupId: number;
  subjectId: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}