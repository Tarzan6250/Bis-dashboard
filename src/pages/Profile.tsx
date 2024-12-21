import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface UserData {
  username: string;
  email: string;
  password?: string;
  dob: string;
  gender: string;
  city: string;
  profilePic?: string;
}

interface UpdateProfileResponse {
  message: string;
  user: UserData;
}

const predefinedPictures = [
  { id: 1, name: 'pic1.jpg', label: 'Professional' },
  { id: 2, name: 'pic2.jpg', label: 'Casual' },
  { id: 3, name: 'pic3.jpg', label: 'Creative' },
  { id: 4, name: 'pic4.jpg', label: 'Abstract' }
];

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData>({
    username: '',
    email: '',
    dob: '',
    gender: '',
    city: '',
  });

  const [profilePic, setProfilePic] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedPicture, setSelectedPicture] = useState<string>('');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const email = localStorage.getItem('userEmail');
      const token = localStorage.getItem('token');

      if (!email || !token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get<UserData>(
          `http://localhost:5000/api/users?email=${email}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        setUserData(response.data);
        setProfilePic(response.data.profilePic || '');
        const picName = response.data.profilePic?.split('/').pop();
        if (picName && predefinedPictures.some(pic => pic.name === picName)) {
          setSelectedPicture(picName);
        }
      } catch (error: any) {
        console.error('Error fetching user data:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userEmail');
          navigate('/login');
        } else {
          alert('Could not fetch user data. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData(prevData => ({ ...prevData, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, file: 'File size should be less than 5MB' }));
        return;
      }

      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, file: 'Please upload an image file' }));
        return;
      }

      setFile(selectedFile);
      setSelectedPicture('');
      setErrors(prev => ({ ...prev, file: '' }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handlePredefinedPicSelect = (picName: string) => {
    setSelectedPicture(picName);
    setProfilePic(`/uploads/${picName}`);
    setFile(null);
    setPreviewUrl('');
    setErrors(prev => ({ ...prev, file: '' }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (password) {
      if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters long';
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (!userData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!userData.dob) {
      newErrors.dob = 'Date of birth is required';
    }

    if (!userData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!userData.city.trim()) {
      newErrors.city = 'City is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    const email = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token');

    if (!email || !token) {
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('username', userData.username);
    formData.append('dob', userData.dob);
    formData.append('gender', userData.gender);
    formData.append('city', userData.city);
    
    if (file) {
      formData.append('profilePic', file);
    } else if (selectedPicture) {
      formData.append('predefinedPic', selectedPicture);
    }
    
    if (password) {
      formData.append('password', password);
    }

    try {
      const response = await axios.put<UpdateProfileResponse>(
        `http://localhost:5000/api/users?email=${email}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setIsEditing(false);
      setPassword('');
      setConfirmPassword('');
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
      
      if (response.data.user) {
        setUserData(response.data.user);
        setProfilePic(response.data.user.profilePic || '');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        navigate('/login');
      } else {
        setErrors(prev => ({
          ...prev,
          submit: error.response?.data?.message || 'Failed to update profile.'
        }));
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPassword('');
    setConfirmPassword('');
    setFile(null);
    setPreviewUrl('');
    setErrors({});
    const currentPicName = profilePic?.split('/').pop();
    setSelectedPicture(currentPicName || '');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit Profile
            </button>
          )}
        </div>

        {updateSuccess && (
          <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
            Profile updated successfully!
          </div>
        )}

        {errors.submit && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
            {errors.submit}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Profile Picture Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Profile Picture</h2>
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={previewUrl || (profilePic ? `http://localhost:5000${profilePic}` : '/default-avatar.png')}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 cursor-pointer">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={!isEditing}
                    />
                  </label>
                )}
              </div>
            </div>

            {errors.file && (
              <p className="text-red-500 text-sm text-center">{errors.file}</p>
            )}

            {isEditing && (
              <div className="grid grid-cols-2 gap-4">
                {predefinedPictures.map((pic) => (
                  <button
                    key={pic.id}
                    type="button"
                    onClick={() => handlePredefinedPicSelect(pic.name)}
                    className={`p-2 text-sm rounded-md ${
                      selectedPicture === pic.name
                        ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500'
                        : 'bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {pic.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={userData.username}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  isEditing
                    ? 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                    : 'border-transparent bg-gray-50'
                }`}
                disabled={!isEditing}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={userData.email}
                className="mt-1 block w-full rounded-md border-transparent bg-gray-50 shadow-sm sm:text-sm"
                disabled
              />
            </div>

            {isEditing && (
              <>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </>
            )}

            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={userData.dob}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  isEditing
                    ? 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                    : 'border-transparent bg-gray-50'
                }`}
                disabled={!isEditing}
              />
              {errors.dob && (
                <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
              )}
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={userData.gender}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  isEditing
                    ? 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                    : 'border-transparent bg-gray-50'
                }`}
                disabled={!isEditing}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
              )}
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={userData.city}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  isEditing
                    ? 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                    : 'border-transparent bg-gray-50'
                }`}
                disabled={!isEditing}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
