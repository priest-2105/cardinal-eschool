import Link from 'next/link'
import cardinalConfig from '@/config'

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#C9F4F4]">
      {/* Hero Section */}
      <div className="relative h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-gray-900">
          <img 
            src="/assets/img/pages/refund-policy/refund.jpg" 
            alt="Refund Policy" 
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white transform transition-all duration-700 hover:scale-105">
            Refund Policy
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
                At Cardinal E-School, we strive to ensure the best learning experience for all our students. If you are not satisfied with our services, we offer a refund policy under the conditions outlined below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility for Refund</h2>
              <p className="text-gray-700">
                Refunds may be issued under the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Request for a refund is made within 7 days of purchase.</li>
                <li>The course or service has not been accessed beyond 10% of its content.</li>
                <li>Technical issues that prevent access to the course, which cannot be resolved by our support team.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Non-Refundable Items</h2>
              <p className="text-gray-700">
                Refunds will not be granted for:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Partially completed courses beyond the 10% threshold.</li>
                <li>Completed courses or services that have already been delivered.</li>
                <li>Subscription-based services after the renewal date.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Refund Process</h2>
              <p className="text-gray-700">
                To request a refund, please contact our support team with the following details:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Your full name and email address used for registration.</li>
                <li>Transaction ID or proof of purchase.</li>
                <li>A brief reason for requesting the refund.</li>
              </ul>
              <p className="text-gray-700">
                Refunds will be processed within 7-10 business days upon approval.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions regarding our refund policy, please contact us at:
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">Email:</span> {cardinalConfig.contactInfo.email}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Phone:</span> {cardinalConfig.contactInfo.phone}
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
