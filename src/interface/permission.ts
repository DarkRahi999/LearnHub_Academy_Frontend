export enum Permission {
  // User permissions
  VIEW_PROFILE = 'view_profile',
  UPDATE_PROFILE = 'update_profile',
  VIEW_NOTICES = 'view_notices',
  
  // Admin permissions
  MANAGE_USERS = 'manage_users',
  CREATE_NOTICE = 'create_notice',
  UPDATE_NOTICE = 'update_notice',
  DELETE_NOTICE = 'delete_notice',
  CREATE_COURSE = 'create_course',
  UPDATE_COURSE = 'update_course',
  DELETE_COURSE = 'delete_course',
  CREATE_BOOK = 'create_book',
  UPDATE_BOOK = 'update_book',
  DELETE_BOOK = 'delete_book',
  CREATE_QUESTION = 'create_question',
  UPDATE_QUESTION = 'update_question',
  DELETE_QUESTION = 'delete_question',
  
  // Super Admin permissions
  MANAGE_ADMINS = 'manage_admins',
  MANAGE_PERMISSIONS = 'manage_permissions',
  SYSTEM_SETTINGS = 'system_settings',
}