import Image from 'next/image'
import {  CheckCircle2 } from 'lucide-react';  

export default function HeroSection() {
  const features = [
    { name: 'Accessibility' },
    { name: 'Flexibility' },
    { name: 'Personalization' },
    { name: 'Community' }
  ]

  return (
    <section className="bg-[#C9F4F4] min-h-screen relative overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 py-28 md:py-12 sm:py-12 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#242424] leading-tight">
              Connect, Learn, Thrive: Personalized Education without Borders
            </h1>
            
            <p className="text-lg text-gray-900 font-semibold max-w-2xl">
              Cardinal E-School is here for you with expert online learning, tailored to your needs.
            </p>

            <div className="flex flex-wrap gap-4">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full"
                >
                  <CheckCircle2 className="h-5 w-5 text-[#1BC2C2]" />
                  <span className="text-gray-700 font-medium">{feature.name}</span>
                </div>
              ))}
            </div>

            <button className="bg-[#1BC2C2] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#19a8a8] transition-colors">
              Start learning now
            </button>
          </div>

          {/* Right Column - Images */}
          <div className="relative lg:block">
            <div className="grid gap-2 items-end grid-cols-2">
              {/* Top Image */}
          
                <div className="relative ms-auto rounded-3xl ">
            
                <div className="absolute -bottom-0 -left-12 rounded-full p-2">        
                <Image
                  src="/assets/img/pages/homepage/stars.png"
                  alt="Star"  
                  width={30}
                  height={30}
                  className="object-cover"
                />
                </div>

                <Image
                  src="/assets/img/pages/homepage/Rectangle 1452.png"
                  alt="Student using tablet"
                  width={280}
                  height={100}
                  className="object-cover"
                />
                <div className="absolute -top-6 -right-6 rounded-full p-2">
                <Image
                  src="/assets/icons/checkmark-circle-02.png"
                  alt="Student using tablet"
                  width={80}
                  height={80}
                  className="object-cover"
                />
                </div>
                </div>

              {/* Top Right Image */}
              <div className="relative w-fit -mb-4 rounded-3xl">
                
              <div className="absolute -top-16 right-16 rounded-full p-2">        
                <Image
                  src="/assets/img/pages/homepage/Ellipse 1866.png"
                  alt="Star"  
                  width={30}
                  height={30}
                  className="object-cover ms-auto"
                />
                </div>
                
                <Image
                  src="/assets/img/pages/homepage/Rectangle 1454.png"
                  alt="Student learning"
                  width={280}
                  height={400}
                  className="object-cover"
                />
                <div className="absolute top-4 right-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-white/70" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Image */}
              <div className="relative rounded-3xl  ms-4  w-fit col-span-2 mt-2 ml-12">
                <Image
                  src="/assets/img/pages/homepage/Rectangle 1453.png"
                  alt="Student with megaphone"
                  width={400}
                  height={400}
                  className="object-cover"
                />

                <div className="absolute top-8 -right-16 rounded-full p-2">
                <Image
                  src="/assets/img/pages/homepage/stars (1).png"
                  alt="Student with megaphone"
                  width={30}
                  height={30}
                  className="object-cover"
                />
                </div>

                <div className="absolute -top-4 -right-4"> 
                <Image
                  src="/assets/img/pages/homepage/group199.png"
                  alt="Student using tablet circles"
                  width={180}
                  height={280}
                  className="object-cover"
                /> 
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

