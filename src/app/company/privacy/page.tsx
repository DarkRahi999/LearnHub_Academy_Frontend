import React from 'react';

const PrivacyPage = () => {
  return (
    // <div className="min-h-screen py-12">
    //   <div className="container mx-auto px-4 max-w-4xl">
    //     <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-red-700">Privacy Policy</h1>

    //     <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
    //       <p className="text-gray-600 mb-6">
    //         Your privacy is important to us. It is LearnHub Academy&apos;s policy to respect your privacy regarding any information we may collect from you across our website.
    //       </p>

    //       <h2 className="text-2xl font-semibold mb-4 text-red-600">1. Information We Collect</h2>
    //       <h3 className="text-xl font-medium mb-2">Personal Information</h3>
    //       <p className="text-gray-600 mb-4">
    //         We may collect personal information such as your name, email address, phone number, and other details when you register for an account or subscribe to our newsletter.
    //       </p>

    //       <h3 className="text-xl font-medium mb-2">Usage Data</h3>
    //       <p className="text-gray-600 mb-6">
    //         We may also collect information on how the Service is accessed and used (&quot;Usage Data&quot;). This Usage Data may include information such as your computer&apos;s Internet Protocol address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
    //       </p>

    //       <h2 className="text-2xl font-semibold mb-4 text-red-600">2. How We Use Your Information</h2>
    //       <p className="text-gray-600 mb-6">
    //         We use the collected data for various purposes:
    //       </p>
    //       <ul className="list-disc list-inside text-gray-600 mb-6 ml-4">
    //         <li>To provide and maintain our Service</li>
    //         <li>To notify you about changes to our Service</li>
    //         <li>To allow you to participate in interactive features of our Service</li>
    //         <li>To provide customer support</li>
    //         <li>To gather analysis or valuable information so that we can improve our Service</li>
    //         <li>To monitor the usage of our Service</li>
    //         <li>To detect, prevent and address technical issues</li>
    //       </ul>

    //       <h2 className="text-2xl font-semibold mb-4 text-red-600">3. Cookies</h2>
    //       <p className="text-gray-600 mb-6">
    //         We use cookies and similar tracking technologies to track the activity on our Service and we hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
    //       </p>

    //       <h2 className="text-2xl font-semibold mb-4 text-red-600">4. Service Providers</h2>
    //       <p className="text-gray-600 mb-6">
    //         We may employ third party companies and individuals to facilitate our Service, to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used.
    //       </p>

    //       <h2 className="text-2xl font-semibold mb-4 text-red-600">5. Security</h2>
    //       <p className="text-gray-600 mb-6">
    //         The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.
    //       </p>

    //       <h2 className="text-2xl font-semibold mb-4 text-red-600">6. Links to Other Sites</h2>
    //       <p className="text-gray-600 mb-6">
    //         Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party&apos;s site. We strongly advise you to review the Privacy Policy of every site you visit.
    //       </p>

    //       <h2 className="text-2xl font-semibold mb-4 text-red-600">7. Changes to This Privacy Policy</h2>
    //       <p className="text-gray-600">
    //         We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
    //       </p>
    //     </div>
    //   </div>
    // </div>
    <div className="max-w-[600px] mx-auto p-2 sm:p-5 font-sans">
      {/* | Header | */}
      <div className="text-center pb-5 border-b-2 border-indigo-600">
        <h1 className="text-indigo-600 text-2xl font-bold m-0">LearnHub Academy</h1>
        <p className="text-gray-500 text-xs mt-1">Your Learning Platform</p>
      </div>

      {/* | Content | */}
      <div className="py-3">
        <h2 className="text-gray-800 text-xl font-bold">New Notice Posted</h2>
        <p className="mt-3">Hello
          {/* {user.firstName} */}

        </p>

        <div className="bg-gray-50 p-4 rounded-lg my-6">
          <h3 className="text-gray-800 text-lg font-bold mb-2">
            {/* {notice.subHeading} */}
            sub heading
          </h3>
          <p className="text-gray-500 leading-relaxed">
            {/* {notice.description}  */}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque doloremque voluptas est tenetur temporibus ipsa cumque alias dicta iusto quis aliquam et ratione accusamus saepe, asperiores corporis beatae libero ad?</p>

          <p className="text-gray-500 text-xs mt-2">
            Posted by:
            {/* {notice.createdBy.firstName || "fname"} {notice.createdBy.lastName || 'lname'} on{' '}
        {new Date(notice.createdAt).toLocaleDateString() || "12.6"} */}
          </p>
        </div>

        <p className="mt-4">
          Please{' '}
          <a
            href={`${process.env.FRONTEND_URL || 'http://localhost:3000'}/notices`}
            className="text-indigo-600 font-bold no-underline hover:underline"
          >
            log in to your account
          </a>{' '}
          to view the full notice.
        </p>

        <p className="mt-4">Thank you for using LearnHub Academy!</p>
      </div>

      {/* | Footer | */}
      <div className="pt-5 pb-5 border-t border-gray-200 text-center text-gray-400 text-sm">
        <p>© 2025 LearnHub Academy. All rights reserved.</p>
        <p className="text-xs mt-1">
          <a
            href={`${process.env.FRONTEND_URL || 'http://localhost:3000'}/profile/update`}
            className="text-indigo-600 no-underline hover:underline"
          >
            Manage your notification preferences
          </a>
        </p>
      </div>
    </div>

  );
};

export default PrivacyPage;