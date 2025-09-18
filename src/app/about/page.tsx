import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-red-700">About LearnHub Academy</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="md:w-1/2">
              <h2 className="text-2xl font-semibold mb-4 text-red-600">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                At LearnHub Academy, our mission is to provide high-quality education and learning resources to students of all ages. We believe that education should be accessible, engaging, and tailored to individual needs.
              </p>
              <p className="text-gray-600">
                We strive to create an environment where students can thrive academically and personally, fostering a love for learning that extends beyond the classroom.
              </p>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-2xl font-semibold mb-4 text-red-600">Our Vision</h2>
              <p className="text-gray-600 mb-4">
                Our vision is to become a leading educational institution that empowers students to reach their full potential. We aim to bridge the gap between traditional education and modern learning techniques.
              </p>
              <p className="text-gray-600">
                Through innovative teaching methods and cutting-edge technology, we prepare our students for the challenges of the future.
              </p>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-red-600">Why Choose LearnHub Academy?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-xl font-medium mb-2 text-red-700">Expert Instructors</h3>
                <p className="text-gray-600">
                  Our team consists of experienced educators and industry professionals dedicated to your success.
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-xl font-medium mb-2 text-red-700">Comprehensive Curriculum</h3>
                <p className="text-gray-600">
                  We offer a wide range of courses designed to meet the needs of students at every level.
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-xl font-medium mb-2 text-red-700">Flexible Learning</h3>
                <p className="text-gray-600">
                  Our programs are designed to accommodate different learning styles and schedules.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-red-600">Our History</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2010, LearnHub Academy began as a small tutoring center with a big dream: to revolutionize education. Over the years, we have grown into a comprehensive educational institution serving thousands of students.
            </p>
            <p className="text-gray-600">
              Today, we continue to innovate and expand our offerings while staying true to our core values of excellence, integrity, and student-centered learning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;