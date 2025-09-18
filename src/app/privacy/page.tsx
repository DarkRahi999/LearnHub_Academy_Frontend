import React from 'react';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-red-700">Privacy Policy</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <p className="text-gray-600 mb-6">
            Your privacy is important to us. It is LearnHub Academy&apos;s policy to respect your privacy regarding any information we may collect from you across our website.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 text-red-600">1. Information We Collect</h2>
          <h3 className="text-xl font-medium mb-2">Personal Information</h3>
          <p className="text-gray-600 mb-4">
            We may collect personal information such as your name, email address, phone number, and other details when you register for an account or subscribe to our newsletter.
          </p>
          
          <h3 className="text-xl font-medium mb-2">Usage Data</h3>
          <p className="text-gray-600 mb-6">
            We may also collect information on how the Service is accessed and used (&quot;Usage Data&quot;). This Usage Data may include information such as your computer&apos;s Internet Protocol address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 text-red-600">2. How We Use Your Information</h2>
          <p className="text-gray-600 mb-6">
            We use the collected data for various purposes:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 ml-4">
            <li>To provide and maintain our Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To allow you to participate in interactive features of our Service</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our Service</li>
            <li>To monitor the usage of our Service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mb-4 text-red-600">3. Cookies</h2>
          <p className="text-gray-600 mb-6">
            We use cookies and similar tracking technologies to track the activity on our Service and we hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 text-red-600">4. Service Providers</h2>
          <p className="text-gray-600 mb-6">
            We may employ third party companies and individuals to facilitate our Service, to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 text-red-600">5. Security</h2>
          <p className="text-gray-600 mb-6">
            The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 text-red-600">6. Links to Other Sites</h2>
          <p className="text-gray-600 mb-6">
            Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party&apos;s site. We strongly advise you to review the Privacy Policy of every site you visit.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 text-red-600">7. Changes to This Privacy Policy</h2>
          <p className="text-gray-600">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;