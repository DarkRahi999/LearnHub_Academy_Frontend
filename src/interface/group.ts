export interface Group {
  id: number;
  name: string;
  courseId: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGroupDto {
  name: string;
  courseId: number;
  description?: string;
}

export interface UpdateGroupDto {
  name?: string;
  courseId?: number;
  description?: string;
}

export interface GroupResponse {
  id: number;
  name: string;
  courseId: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}