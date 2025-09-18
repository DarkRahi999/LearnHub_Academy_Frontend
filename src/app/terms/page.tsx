import React from 'react';

const TermsPage = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-red-700">Terms and Conditions</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <p className="text-gray-600 mb-6">
            Welcome to LearnHub Academy. These terms and conditions outline the rules and regulations for the use of LearnHub Academy&apos;s Website.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 text-red-600">1. Introduction</h2>
          <p className="text-gray-600 mb-6">
            By accessing this website we assume you accept these terms and conditions. Do not continue to use LearnHub Academy if you do not agree to take all of the terms and conditions stated on this page.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 text-red-600">2. Intellectual Property Rights</h2>
          <p className="text-gray-600 mb-6">
            Other than the content you own, under these Terms, LearnHub Academy and/or its licensors own all the intellectual property rights and materials contained in this Website.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 text-red-600">3. Restrictions</h2>
          <p className="text-gray-600 mb-6">
            You are specifically restricted from all of the following:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 ml-4">
            <li>Publishing any Website material in any other media</li>
            <li>Selling, sublicensing and/or otherwise commercializing any Website material</li>
            <li>Publicly performing and/or showing any Website material</li>
            <li>Using this Website in any way that is or may be damaging to this Website</li>
            <li>Using this Website in any way that impacts user access to this Website</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mb-4 text-red-600">4. Your Content</h2>
          <p className="text-gray-600 mb-6">
            In these Website Standard Terms and Conditions, &quot;Your Content&quot; shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant LearnHub Academy a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 text-red-600">5. No Warranties</h2>
          <p className="text-gray-600 mb-6">
            This Website is provided &quot;as is,&quot; with all faults, and LearnHub Academy expresses no representations or warranties, of any kind related to this Website or the materials contained on this Website.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 text-red-600">6. Limitation of Liability</h2>
          <p className="text-gray-600 mb-6">
            In no event shall LearnHub Academy, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 text-red-600">7. Variation of Terms</h2>
          <p className="text-gray-600 mb-6">
            LearnHub Academy is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review these Terms on a regular basis.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 text-red-600">8. Assignment</h2>
          <p className="text-gray-600 mb-6">
            LearnHub Academy is allowed to assign, transfer, and subcontract its rights and/or obligations under these Terms without any notification. However, you are not allowed to assign, transfer, or subcontract any of your rights and/or obligations under these Terms.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 text-red-600">9. Entire Agreement</h2>
          <p className="text-gray-600">
            These Terms constitute the entire agreement between LearnHub Academy and you in relation to your use of this Website, and supersede all prior agreements and understandings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;