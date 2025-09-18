import React from 'react';

const CareersPage = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-red-700">Join Our Team</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <p className="text-gray-600 mb-8 text-center">
            At LearnHub Academy, we&apos;re always looking for passionate educators and talented professionals to join our growing team.
          </p>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-red-600">Why Work With Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-red-200 rounded-lg p-4">
                <h3 className="text-xl font-medium mb-2 text-red-700">Impactful Work</h3>
                <p className="text-gray-600">
                  Make a real difference in student&apos;s lives and contribute to their educational journey.
                </p>
              </div>
              <div className="border border-red-200 rounded-lg p-4">
                <h3 className="text-xl font-medium mb-2 text-red-700">Professional Growth</h3>
                <p className="text-gray-600">
                  Access to continuous learning opportunities and career development programs.
                </p>
              </div>
              <div className="border border-red-200 rounded-lg p-4">
                <h3 className="text-xl font-medium mb-2 text-red-700">Collaborative Environment</h3>
                <p className="text-gray-600">
                  Work with a diverse team of dedicated professionals in a supportive environment.
                </p>
              </div>
              <div className="border border-red-200 rounded-lg p-4">
                <h3 className="text-xl font-medium mb-2 text-red-700">Competitive Benefits</h3>
                <p className="text-gray-600">
                  Comprehensive benefits package including health insurance and retirement plans.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-red-600">Current Openings</h2>
            
            <div className="space-y-6">
              <div className="border border-red-100 rounded-lg p-6">
                <h3 className="text-xl font-medium mb-2 text-red-700">Mathematics Instructor</h3>
                <p className="text-gray-600 mb-4">
                  We&apos;re looking for an experienced Mathematics Instructor to teach high school level courses.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">Full-time</span>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">Experience Required</span>
                </div>
                <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors">
                  Apply Now
                </button>
              </div>
              
              <div className="border border-red-100 rounded-lg p-6">
                <h3 className="text-xl font-medium mb-2 text-red-700">Content Developer</h3>
                <p className="text-gray-600 mb-4">
                  Join our content team to create engaging educational materials for online courses.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">Part-time</span>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">Remote Available</span>
                </div>
                <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors">
                  Apply Now
                </button>
              </div>
              
              <div className="border border-red-100 rounded-lg p-6">
                <h3 className="text-xl font-medium mb-2 text-red-700">Student Counselor</h3>
                <p className="text-gray-600 mb-4">
                  Provide academic and personal guidance to students in our learning programs.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">Full-time</span>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">Counseling Degree Required</span>
                </div>
                <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors">
                  Apply Now
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-red-600">How to Apply</h2>
            <p className="text-gray-600 mb-4">
              To apply for any of our positions, please send your resume and a cover letter to careers@learnhubacademy.com with the position title in the subject line.
            </p>
            <p className="text-gray-600">
              We review applications on a rolling basis and will contact qualified candidates for interviews.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareersPage;