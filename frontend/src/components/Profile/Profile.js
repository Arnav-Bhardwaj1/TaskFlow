import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Mail, 
  Save, 
  Camera, 
  Shield, 
  Calendar,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      avatar: user?.avatar || ''
    }
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const profileData = {
        ...data,
        avatar: avatarPreview
      };
      
      const result = await updateProfile(profileData);
      if (result.success) {
        setIsEditing(false);
        reset(data);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAvatarPreview(user?.avatar || '');
    reset({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      avatar: user?.avatar || ''
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-1">
          Manage your account settings and profile information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            {/* Avatar Section */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12" />
                  )}
                </div>
                
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:shadow-xl transition-shadow">
                    <Camera className="w-4 h-4 text-primary-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-500">@{user?.username}</p>
            </div>

            {/* Profile Stats */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-success-600" />
                  <span className="text-sm text-gray-600">Member since</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(user?.createdAt)}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  <span className="text-sm text-gray-600">Last login</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(user?.lastLogin)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleCancel}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isLoading}
                    className="btn-primary inline-flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  {...register('firstName', {
                    required: 'First name is required',
                    maxLength: {
                      value: 50,
                      message: 'First name cannot exceed 50 characters'
                    }
                  })}
                  type="text"
                  id="firstName"
                  disabled={!isEditing}
                  className={`input w-full ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-danger-600">{errors.firstName.message}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  {...register('lastName', {
                    required: 'Last name is required',
                    maxLength: {
                      value: 50,
                      message: 'Last name cannot exceed 50 characters'
                    }
                  })}
                  type="text"
                  id="lastName"
                  disabled={!isEditing}
                  className={`input w-full ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-danger-600">{errors.lastName.message}</p>
                )}
              </div>

              {/* Avatar URL */}
              <div>
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-2">
                  Avatar URL
                </label>
                <input
                  {...register('avatar')}
                  type="url"
                  id="avatar"
                  disabled={!isEditing}
                  placeholder="https://example.com/avatar.jpg"
                  className={`input w-full ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter a URL for your profile picture
                </p>
              </div>
            </form>
          </motion.div>

          {/* Account Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-warning-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Account Security</h3>
                <p className="text-sm text-gray-600">Manage your account security settings</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Email Address</h4>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                <span className="text-xs bg-success-100 text-success-800 px-2 py-1 rounded-full">
                  Verified
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Username</h4>
                  <p className="text-sm text-gray-600">@{user?.username}</p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                  Unique
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Account Status</h4>
                  <p className="text-sm text-gray-600">
                    {user?.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  user?.isActive 
                    ? 'bg-success-100 text-success-800' 
                    : 'bg-danger-100 text-danger-800'
                }`}>
                  {user?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                For security reasons, some account settings can only be changed by contacting support.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

