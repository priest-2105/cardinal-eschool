import React from "react";

const StudentDashboardSideBar: React.FC = () => {
  return (
      <aside className="w-64 bg-white shadow-md p-4">
        <div className="text-2xl font-bold text-blue-600 mb-6">Cardinal E-school</div>
        <nav className="space-y-4">
          <a href="#" className="block py-2 px-4 text-blue-500 bg-blue-100 rounded-md">Home</a>
          <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded-md">Profile</a>
          <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded-md">My Courses</a>
          <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded-md">Payments</a>
          <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-200 rounded-md">Admin Support</a>
        </nav>
      </aside>

  );
};

export default StudentDashboardSideBar;
