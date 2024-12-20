import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';

interface UserData {
  username: string;
  email: string;
  password: string;
  dob: string;
  gender: string;
  city: string;
  profilePic?: string;
}

const Profile: React.FC = () => {
  const email = localStorage.getItem('userEmail'); // Get email directly from localStorage
  if (!email) {
    alert('User is not logged in!');
    return null;
  }

  const [userData, setUserData] = useState<UserData>({
    username: '',
    email: '',
    password: '',
    dob: '',
    gender: '',
    city: '',
  });

  const [profilePic, setProfilePic] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<UserData>(`http://localhost:5000/api/users?email=${email}`);
        setUserData(response.data);
        setProfilePic(response.data.profilePic || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Could not fetch user data.');
      }
    };

    fetchUserData();
  }, [email]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('username', userData.username);
    formData.append('dob', userData.dob);
    formData.append('gender', userData.gender);
    formData.append('city', userData.city);
    if (file) formData.append('profilePic', file);
    if (userData.password) formData.append('password', userData.password);

    try {
      await axios.put(`http://localhost:5000/api/users?email=${email}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>

      {/* Profile Picture Selection */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-800">Profile Picture</h2>
        {profilePic && <img src={`http://localhost:5000${profilePic}`} alt="Profile" className="w-20 h-20 rounded-full mb-4" />}
        <div className="flex gap-4 mb-4">
          {/* Predefined Profile Pics */}
          {['pic1.jpg', 'pic2.jpg', 'pic3.jpg', 'pic4.jpg'].map((pic, index) => (
            <img
              key={index}
              src={`http://localhost:5000/uploads/${pic}`}
              alt={`Profile ${index + 1}`}
              className={`w-20 h-20 rounded-full cursor-pointer ${profilePic === `/uploads/${pic}` ? 'border-4 border-blue-500' : ''}`}
              onClick={() => setProfilePic(`/uploads/${pic}`)}
            />
          ))}
        </div>
      </div>

      {/* Editable User Details */}
      <div className="space-y-4">
        {Object.keys(userData)
          .filter(key => key !== 'email' && key !== 'profilePic')
          .map(key => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input
                type="text"
                name={key}
                value={(userData as any)[key]}
                onChange={handleChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 sm:text-sm"
              />
            </div>
          ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg">Save</button>
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg">Cancel</button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg">Edit</button>
        )}
      </div>
    </div>
  );
};

export default Profile;
