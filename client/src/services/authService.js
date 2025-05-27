import api from '../api/axios';

export const login = async (credentials) => {
  try {
    
    const response = await api.post('/user/login',credentials);
    return response.data;
  } catch (error) {
    console.error('Error getting current user:', error);
  }

};

export const getCurrentUser = async () => {
  try {
    
    const response = await api.get('/user/me');
    return response.data;
  } catch (error) {
    console.error('Error getting current user:', error);
  }
};

export const logout = async () => {
  try {
    const response= await api.post('/user/logout');
    return response.data;
  } catch (error) {
    console.error('Error getting current user:', error);
  }
};

export const changePassword = async (credentials) => {
  try {
    
    const response = await api.put('/user/admin/change-password',credentials);
    return response.data;
  } catch (error) {
    console.error('Error getting current user:', error);
  }

};

export const updateProfile = async (credentials) => {
  try {
    
    const response = await api.put('/user/admin/upadte-profile',credentials);
    return response.data;
  } catch (error) {
    console.error('Error getting current user:', error);
  }

};

export const getAllUsers = async () => {
  try {
    
    const response = await api.get('/user/get-all-user');
    return response.data;
  } catch (error) {
    console.error('Error getting current user:', error);
  }
};


export const updateUserRole = async (userId,role) => {
  try {
    
    const response = await api.post('/user/update-user-role',{
      userId: userId,
      newRole: role,  
    });
    return response.data;
  } catch (error) {
    console.error('Error getting current user:', error);
  }

};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/user/delete-user/${userId}`);
    return response.data;
  }catch (error) {
    console.error('Error getting current user:', error);
  }

};