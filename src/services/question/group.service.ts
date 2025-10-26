import axios from 'axios';
import { API_BASE_URL } from '@/config/configURL';
import { Group, GroupResponse, CreateGroupDto, UpdateGroupDto } from '@/interface/group';

//W---------={ axios instance with proper configuration }=----------</br>
const groupApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

//W---------={ Add request interceptor to include auth token }=----------</br>
groupApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class GroupService {

  //W---------={ Get all groups }=----------</br>
  async getAllGroups(): Promise<Group[]> {
    try {
      const response = await groupApi.get<Group[]>(`/api/groups`);
      return response.data;
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw new Error('Failed to fetch groups: ' + (error as Error).message);
    }
  }

  //W---------={ Get group by id }=----------</br>
  async getGroupById(id: number): Promise<GroupResponse> {
    try {
      const response = await groupApi.get<GroupResponse>(`/api/groups/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching group:', error);
      throw new Error('Failed to fetch group: ' + (error as Error).message);
    }
  }

  //W---------={ Create group }=----------</br>
  async createGroup(groupData: CreateGroupDto): Promise<Group> {
    try {
      const response = await groupApi.post<Group>(`/api/groups`, groupData);
      return response.data;
    } catch (error) {
      console.error('Error creating group:', error);
      throw new Error('Failed to create group: ' + (error as Error).message);
    }
  }

  //W---------={ Update group }=----------</br>
  async updateGroup(id: number, groupData: UpdateGroupDto): Promise<Group> {
    try {
      const response = await groupApi.put<Group>(`/api/groups/${id}`, groupData);
      return response.data;
    } catch (error) {
      console.error('Error updating group:', error);
      throw new Error('Failed to update group: ' + (error as Error).message);
    }
  }

  //W---------={ Delete group }=----------</br>
  async deleteGroup(id: number): Promise<void> {
    try {
      await groupApi.delete(`/api/groups/${id}`);
    } catch (error) {
      console.error('Error deleting group:', error);
      throw new Error('Failed to delete group: ' + (error as Error).message);
    }
  }
}

export const groupService = new GroupService();
export default groupService;