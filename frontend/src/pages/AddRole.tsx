import React, { useState } from 'react';

const parentRoles = ['None', 'Super Admin', 'Admin', 'Manager'];

const AddRole: React.FC = () => {
  const [form, setForm] = useState({
    roleName: '',
    description: '',
    parentRole: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full max-w-3xl flex flex-col gap-8 p-0">
      <div className="text-2xl font-bold">Create Role</div>
      <form className="flex flex-col gap-6">
        <input
          type="text"
          name="roleName"
          className="rounded-full border border-[#e6ecf5] px-6 py-3 text-base outline-none focus:border-primary"
          placeholder="Enter role name"
          value={form.roleName}
          onChange={handleChange}
        />
        <textarea
          name="description"
          className="rounded-2xl border border-[#e6ecf5] px-6 py-3 text-base outline-none focus:border-primary min-h-[80px] resize-none"
          placeholder="Enter description"
          value={form.description}
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
      </form>
      <div className="flex justify-end gap-6">
        <button type="button" className="bg-[#163977] hover:bg-blue-900 text-white font-bold py-3 px-10 rounded-full text-lg">Cancel</button>
        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-10 rounded-full text-lg">Save</button>
      </div>
    </div>
  );
};

export default AddRole; 