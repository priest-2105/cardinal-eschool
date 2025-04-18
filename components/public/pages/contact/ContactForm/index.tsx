"use client";


import { useState } from 'react'
import cardinalConfig from '@/config'
import { FaFacebook, FaTwitter, FaTiktok, FaYoutube, FaWhatsapp } from 'react-icons/fa'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // console.log(formData)
    // Handle form submission
  }

  const socialIcons = [
    { icon: FaFacebook, link: cardinalConfig.socialInfo.facebook },
    { icon: FaTwitter, link: cardinalConfig.socialInfo.X },
    { icon: FaTiktok, link: cardinalConfig.socialInfo.tikTok },
    { icon: FaYoutube, link: cardinalConfig.socialInfo.youtube },
    { icon: FaWhatsapp, link: cardinalConfig.socialInfo.whatsapp },
  ]

  return (
      <div className="max-w-4xl mx-auto px-4 py-12 -mt-20 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-500 hover:shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1BC2C2] focus:border-transparent transition-all duration-200"
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1BC2C2] focus:border-transparent transition-all duration-200"
                  placeholder="Enter last name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1BC2C2] focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1BC2C2] focus:border-transparent transition-all duration-200"
                placeholder="Enter subject"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1BC2C2] focus:border-transparent transition-all duration-200"
                placeholder="Enter your message"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-8 py-3 bg-[#1BC2C2] text-white rounded-full font-semibold hover:bg-[#19a8a8] transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1BC2C2]"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>

        {/* Social Media Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-500 hover:shadow-2xl">
          <h2 className="text-2xl font-bold text-center mb-6">Connect With Us</h2>
          <div className="flex justify-center space-x-6">
            {socialIcons.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1BC2C2] hover:text-[#19a8a8] transform hover:scale-110 transition-all duration-200"
              >
                <item.icon className="w-8 h-8" />
              </a>
            ))}
          </div>
        </div>
      </div> 
  )
}
