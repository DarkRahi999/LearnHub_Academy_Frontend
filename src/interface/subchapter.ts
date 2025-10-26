export interface SubChapter {
  id: number;
  name: string;
  chapterId: number;
  courseId: number;
  groupId: number;
  subjectId: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubChapterDto {
  name: string;
  chapterId: number;
  courseId: number;
  groupId: number;
  subjectId: number;
  description?: string;
}

export interface UpdateSubChapterDto {
  name?: string;
  chapterId?: number;
  courseId?: number;
  groupId?: number;
  subjectId?: number;
  description?: string;
}

export interface SubChapterResponse {
  id: number;
  name: string;
  chapterId: number;
  courseId: number;
  groupId: number;
  subjectId: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}