import Link from 'next/link'
import cardinalConfig from '@/config'

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-[#C9F4F4]">
      {/* Hero Section */}
      <div className="relative h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-gray-900">
          <img 
            src="/assets/img/pages/terms/pexels-rdne-7821937.jpg" 
            alt="Terms and Conditions" 
            className="w-full h-full object-cover bg-bottom opacity-50"
          />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white transform transition-all duration-700 hover:scale-105">
            Terms and Conditions
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-12 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-500 hover:shadow-2xl">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700">
                Welcome to Cardinal E-School. These terms and conditions outline the rules and regulations for the use of our website and services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing this website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Responsibilities</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>You must be at least 18 years old to use our services, or have parental consent.</li>
                <li>You agree to provide accurate and current information when registering an account.</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Payment and Subscription</h2>
              <p className="text-gray-700">
                Our services may require payments for access to premium content. You agree to comply with the payment terms specified on our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Intellectual Property</h2>
              <p className="text-gray-700">
                All content provided on Cardinal E-School is the intellectual property of our platform and may not be copied, modified, or distributed without permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Termination</h2>
              <p className="text-gray-700">
                We reserve the right to terminate or suspend your account if you violate these terms or engage in any activities that harm the integrity of our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-700">
                Cardinal E-School shall not be held responsible for any indirect, incidental, or consequential damages arising from the use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Information</h2>
              <p className="text-gray-700">
                If you have any questions about these terms, please contact us at:
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">Email:</span> {cardinalConfig.contactInfo.email}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Phone:</span> {cardinalConfig.contactInfo.phone}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Address:</span> {cardinalConfig.contactInfo.address}
                </p>
              </div>
            </section>
          </div>

          <div className="mt-12 text-center">
            <Link 
              href={cardinalConfig.routes.home}
              className="inline-block px-6 py-3 bg-[#1BC2C2] text-white rounded-full font-semibold hover:bg-[#19a8a8] transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1BC2C2]"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
