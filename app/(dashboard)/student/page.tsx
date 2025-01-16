

export default function StudentDashboard() {
  return (
         <>
            {/* Calendar Section */}
            <section className="mb-6">
              <div className="bg-white shadow-md rounded-md p-4">
                <h2 className="text-lg font-bold mb-4">Calendar</h2>
                <div className="grid grid-cols-7 gap-2">
                  {/* Calendar Days */}
                  <div className="col-span-1">
                    <div className="text-center font-bold">Mon</div>
                    <div className="bg-gray-100 h-20 rounded-md flex justify-center items-center text-gray-600">
                      Mathematics Class
                    </div>
                  </div>
                  {/* Add similar divs for other days */}
                </div>
              </div>
            </section>
    
            {/* Assignments Section */}
            <section className="mb-6">
              <div className="bg-white shadow-md rounded-md p-4">
                <h2 className="text-lg font-bold mb-4">Assignments</h2>
                <div>
                  <div className="flex justify-between items-center p-2 border-b">
                    <div>
                      <h3 className="font-semibold">Physics Class 1</h3>
                      <p>Submit before 18th Nov, 2024, 8:00 PM</p>
                    </div>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Upload</button>
                  </div>
                  {/* Add similar blocks for other assignments */}
                </div>
              </div>
            </section>
    
            {/* Courses Section */}
            <section>
              <div className="bg-white shadow-md rounded-md p-4">
                <h2 className="text-lg font-bold mb-4">Top Courses</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Physics Class 1</h3>
                      <p>Chapter 5 | 10 Classes</p>
                    </div>
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-md">80%</span>
                  </div>
                  </div>
                  </div>
                  </section>
                  </>    
  );
}
