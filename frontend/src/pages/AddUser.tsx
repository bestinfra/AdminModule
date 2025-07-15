import React, { useState } from 'react';

const roles = ['Admin', 'Manager', 'User'];
const parentRoles = ['None', 'Super Admin', 'Admin', 'Manager'];

const AddUser: React.FC = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: '',
    parentRole: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full max-w-6xl flex flex-col gap-8 p-0">
      <div className="text-2xl font-bold">Create User</div>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="flex flex-col gap-6">
          <input
            type="text"
            name="fullName"
            className="rounded-full border border-[#e6ecf5] px-6 py-3 text-base outline-none focus:border-primary"
            placeholder="Enter full name"
            value={form.fullName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="phone"
            className="rounded-full border border-[#e6ecf5] px-6 py-3 text-base outline-none focus:border-primary"
            placeholder="Enter phone number"
            value={form.phone}
            onChange={handleChange}
          />
          <select
            name="role"
            className="rounded-full border border-[#e6ecf5] px-6 py-3 text-base outline-none focus:border-primary text-gray-500"
            value={form.role}
            onChange={handleChange}
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-6">
          <input
            type="email"
            name="email"
            className="rounded-full border border-[#e6ecf5] px-6 py-3 text-base outline-none focus:border-primary"
            placeholder="Enter email address"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            className="rounded-full border border-[#e6ecf5] px-6 py-3 text-base outline-none focus:border-primary"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
          />
          <select
            name="parentRole"
            className="rounded-full border border-[#e6ecf5] px-6 py-3 text-base outline-none focus:border-primary text-gray-500"
            value={form.parentRole}
            onChange={handleChange}
          >
            <option value="">Select Parent Role</option>
            {parentRoles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </form>
      <div className="flex justify-end gap-6">
        <button type="button" className="bg-[#163977] hover:bg-blue-900 text-white font-bold py-3 px-10 rounded-full text-lg">Cancel</button>
        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-10 rounded-full text-lg">Save</button>
      </div>
    </div>
  );
};

export default AddUser; 