import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MediCoreLanding = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: 'fa-user-injured',
      title: 'Patient Management',
      description: 'Comprehensive patient records, medical history, and treatment tracking in one secure location.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: 'fa-calendar-check',
      title: 'Appointment Scheduling',
      description: 'Smart scheduling system with automated reminders and conflict prevention.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: 'fa-users',
      title: 'Staff Management',
      description: 'Manage doctors, nurses, and staff schedules with role-based access control.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: 'fa-file-invoice-dollar',
      title: 'Billing & Payments',
      description: 'Automated billing, insurance claims, and secure payment processing.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: 'fa-chart-line',
      title: 'Reports & Analytics',
      description: 'Real-time insights and comprehensive reports for data-driven decisions.',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: 'fa-prescription-bottle-medical',
      title: 'Pharmacy Integration',
      description: 'Seamless prescription management and inventory tracking for hospital pharmacies.',
      color: 'from-teal-500 to-teal-600'
    }
  ];

  const benefits = [
    {
      icon: 'fa-shield-alt',
      title: '99.9% Reliability',
      description: 'Enterprise-grade infrastructure ensuring your hospital never stops operating.'
    },
    {
      icon: 'fa-lock',
      title: 'Bank-Level Security',
      description: 'HIPAA compliant with end-to-end encryption protecting sensitive patient data.'
    },
    {
      icon: 'fa-cloud',
      title: 'Cloud Access Anywhere',
      description: 'Access your system from any device, anywhere, anytime with secure cloud technology.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Hospitals Trust Us', icon: 'fa-hospital' },
    { number: '1M+', label: 'Patients Managed', icon: 'fa-user-injured' },
    { number: '50K+', label: 'Healthcare Professionals', icon: 'fa-user-md' },
    { number: '99.9%', label: 'Uptime Guarantee', icon: 'fa-check-circle' }
  ];

  const testimonials = [
    {
      author: 'Dr. Maria Johnson',
      role: 'Chief Medical Officer',
      hospital: 'St. Mary\'s Hospital',
      avatar: 'DM',
      text: 'MediCore has transformed how we manage our hospital. The intuitive interface and comprehensive features have reduced our administrative time by 40%.',
      rating: 5
    },
    {
      author: 'Sarah Chen',
      role: 'Hospital Administrator',
      hospital: 'City General Hospital',
      avatar: 'SC',
      text: 'The appointment scheduling and patient management features are game-changers. Our patient satisfaction scores have increased significantly since implementation.',
      rating: 5
    },
    {
      author: 'Dr. Robert Patel',
      role: 'Practice Director',
      hospital: 'Wellness Medical Center',
      avatar: 'RP',
      text: 'Outstanding support team and reliable system. MediCore handles everything from billing to analytics seamlessly. Highly recommended for any healthcare facility.',
      rating: 5
    },
    {
      author: 'Dr. Emily Rodriguez',
      role: 'Head of Emergency',
      hospital: 'Memorial Hospital',
      avatar: 'ER',
      text: 'The real-time updates and mobile accessibility have been crucial for our emergency department. We can access patient records instantly from anywhere.',
      rating: 5
    }
  ];

  const services = [
    {
      title: 'Electronic Health Records',
      description: 'Complete digital health records with seamless data sharing between departments.',
      icon: 'fa-file-medical',
      image: '🏥'
    },
    {
      title: 'Telemedicine Integration',
      description: 'Built-in video consultation capabilities for remote patient care.',
      icon: 'fa-video',
      image: '👨‍⚕️'
    },
    {
      title: 'Lab Management',
      description: 'Streamlined lab order processing and result delivery system.',
      icon: 'fa-flask',
      image: '🔬'
    },
    {
      title: 'Inventory Control',
      description: 'Real-time tracking of medical supplies and equipment.',
      icon: 'fa-boxes',
      image: '📦'
    }
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
        
        * { font-family: 'Poppins', sans-serif; }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-fadeInUp { animation: fadeInUp 0.8s; }
        .animate-fadeIn { animation: fadeIn 1s; }
        .animate-pulse { animation: pulse 2s infinite; }
        
        .hero-illustration::before {
          content: '';
          position: absolute;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: rotate 20s linear infinite;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
      
      <div className="font-sans text-gray-800">
        {/* Navigation */}
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white/98 shadow-md'}`}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
              <i className="fas fa-hospital"></i>
              <span>MediCore</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('home')} className="font-medium text-gray-800 hover:text-blue-600 transition">Home</button>
              <button onClick={() => scrollToSection('features')} className="font-medium text-gray-800 hover:text-blue-600 transition">Features</button>
              <button onClick={() => scrollToSection('services')} className="font-medium text-gray-800 hover:text-blue-600 transition">Services</button>
              <button onClick={() => scrollToSection('about')} className="font-medium text-gray-800 hover:text-blue-600 transition">About</button>
              <button onClick={() => scrollToSection('testimonials')} className="font-medium text-gray-800 hover:text-blue-600 transition">Testimonials</button>
              <button onClick={() => scrollToSection('contact')} className="font-medium text-gray-800 hover:text-blue-600 transition">Contact</button>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <Link
                onClick={() => window.location.href = '/login'}
                className="px-6 py-2 rounded-full font-medium text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                onClick={() => window.location.href = '/register'}
                className="px-6 py-2 rounded-full font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition"
              >
                Register
              </Link>
            </div>
            
            <button className="md:hidden text-2xl text-blue-600">
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="home" className="pt-24 pb-16 px-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeInUp">
              <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <i className="fas fa-award mr-2"></i>Trusted by 500+ Healthcare Facilities
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-4 leading-tight">
                Streamline Hospital Operations with <span className="gradient-text">MediCore</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Manage patients, staff, appointments, and billing in one secure, intelligent platform designed for modern healthcare.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  className="px-8 py-4 rounded-full font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-xl hover:-translate-y-1 transition flex items-center justify-center gap-2"
                  onClick={() => window.location.href = '/login'}
                >
                  <i className="fas fa-rocket"></i>
                  Get Started Free
                </button>
                <button className="px-8 py-4 rounded-full font-medium text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition flex items-center justify-center gap-2">
                  <i className="fas fa-calendar"></i>
                  Book a Demo
                </button>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <i className="fas fa-check-circle text-green-500"></i>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-check-circle text-green-500"></i>
                  <span>14-day free trial</span>
                </div>
              </div>
            </div>
            
            <div className="animate-fadeIn relative">
              <div className="relative w-full h-96 md:h-[500px] bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl">
                <div className="hero-illustration absolute inset-0"></div>
                <div className="z-10 text-center">
                  <div className="text-9xl mb-4">👨‍⚕️</div>
                  <div className="text-white text-2xl font-semibold">Healthcare Excellence</div>
                </div>
              </div>
              {/* Floating doctor/patient cards */}
              <div className="absolute -top-4 -left-4 bg-white p-4 rounded-2xl shadow-xl animate-pulse">
                <div className="text-4xl mb-2">👩‍⚕️</div>
                <div className="text-xs font-semibold text-gray-700">50+ Doctors</div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-xl animate-pulse" style={{animationDelay: '1s'}}>
                <div className="text-4xl mb-2">🏥</div>
                <div className="text-xs font-semibold text-gray-700">1M+ Patients</div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <i className={`fas ${stat.icon} text-4xl mb-3 opacity-80`}></i>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-blue-900 mb-4">Powerful Features for Modern Healthcare</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Everything you need to manage your healthcare facility efficiently, all in one comprehensive platform
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300 border border-gray-100">
                  <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition`}>
                    <i className={`fas ${feature.icon} text-3xl text-white`}></i>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-3 text-center">{feature.title}</h3>
                  <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section with Images */}
        <section id="services" className="py-20 px-6 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-blue-900 mb-4">Comprehensive Healthcare Solutions</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Advanced tools designed to enhance every aspect of hospital management
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">
                  <div className="flex">
                    <div className="w-1/3 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-6xl">
                      {service.image}
                    </div>
                    <div className="w-2/3 p-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <i className={`fas ${service.icon} text-blue-600 text-xl`}></i>
                      </div>
                      <h3 className="text-xl font-semibold text-blue-900 mb-3">{service.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Doctor & Patient Showcase */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-blue-900 mb-6">Built for Healthcare Professionals</h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  MediCore empowers doctors, nurses, and administrative staff with intuitive tools that simplify daily operations and enhance patient care delivery.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                    <div className="text-4xl">👨‍⚕️</div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">For Doctors</h4>
                      <p className="text-gray-600 text-sm">Quick access to patient histories, lab results, and treatment plans</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl">
                    <div className="text-4xl">👩‍⚕️</div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">For Nurses</h4>
                      <p className="text-gray-600 text-sm">Streamlined patient monitoring and medication administration tracking</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                    <div className="text-4xl">🧑‍💼</div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">For Administrators</h4>
                      <p className="text-gray-600 text-sm">Comprehensive analytics and reporting for informed decision-making</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-8 flex flex-col items-center justify-center text-white h-64 shadow-xl">
                  <div className="text-7xl mb-4">👨‍⚕️</div>
                  <div className="text-xl font-semibold">Expert Doctors</div>
                </div>
                <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-8 flex flex-col items-center justify-center text-white h-64 shadow-xl">
                  <div className="text-7xl mb-4">🤱</div>
                  <div className="text-xl font-semibold">Caring Nurses</div>
                </div>
                <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-8 flex flex-col items-center justify-center text-white h-64 shadow-xl">
                  <div className="text-7xl mb-4">🧑‍🦽</div>
                  <div className="text-xl font-semibold">Patient Care</div>
                </div>
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-8 flex flex-col items-center justify-center text-white h-64 shadow-xl">
                  <div className="text-7xl mb-4">👶</div>
                  <div className="text-xl font-semibold">Family Support</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section id="about" className="py-20 px-6 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-12 text-white shadow-2xl">
                <div className="text-8xl mb-6 text-center">🏥</div>
                <h3 className="text-3xl font-bold mb-4 text-center">Healthcare Innovation</h3>
                <p className="text-blue-100 text-center leading-relaxed">
                  Transforming hospital management with cutting-edge technology and patient-centered design
                </p>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">⭐</div>
                  <div>
                    <div className="text-2xl font-bold text-blue-900">4.9/5</div>
                    <div className="text-sm text-gray-600">User Rating</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-4xl font-bold text-blue-900 mb-6">Why Healthcare Providers Choose MediCore</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                MediCore revolutionizes hospital management by bringing all essential operations into one intuitive platform. Our system improves efficiency, enhances patient satisfaction, and reduces administrative burden, allowing healthcare professionals to focus on what matters most—patient care.
              </p>
              
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-lg hover:translate-x-2 transition duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className={`fas ${benefit.icon} text-white text-xl`}></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">{benefit.title}</h4>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-blue-900 mb-4">What Healthcare Professionals Say</h2>
              <p className="text-gray-600 text-lg">
                Trusted by thousands of healthcare providers worldwide
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900">{testimonial.author}</h4>
                      <p className="text-gray-600 text-xs">{testimonial.role}</p>
                      <p className="text-gray-500 text-xs">{testimonial.hospital}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <i key={i} className="fas fa-star text-yellow-400"></i>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed italic">"{testimonial.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="text-6xl mb-6">🚀</div>
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Healthcare Facility?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join hundreds of hospitals and clinics already using MediCore to deliver better patient care
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 rounded-full font-medium bg-white text-blue-600 hover:shadow-xl hover:-translate-y-1 transition">
                Start Free Trial
              </button>
              <button className="px-8 py-4 rounded-full font-medium border-2 border-white text-white hover:bg-white hover:text-blue-600 transition">
                Schedule a Demo
              </button>
            </div>
            <p className="mt-6 text-blue-100 text-sm">No credit card required • 14-day free trial • Cancel anytime</p>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="bg-blue-900 text-white py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 text-2xl font-bold mb-4">
                  <i className="fas fa-hospital"></i>
                  <span>MediCore</span>
                </div>
                <p className="text-blue-200 leading-relaxed mb-4">
                  Empowering healthcare facilities with cutting-edge management solutions for better patient outcomes.
                </p>
                <div className="flex gap-3">
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-blue-600 transition">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-blue-600 transition">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-blue-600 transition">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-blue-600 transition">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-blue-200 hover:text-white transition">About Us</a></li>
                  <li><a href="#" className="text-blue-200 hover:text-white transition">Careers</a></li>
                  <li><a href="#" className="text-blue-200 hover:text-white transition">Blog</a></li>
                  <li><a href="#" className="text-blue-200 hover:text-white transition">Press Kit</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-blue-200 hover:text-white transition">Contact Us</a></li>
                  <li><a href="#" className="text-blue-200 hover:text-white transition">Help Center</a></li>
                  <li><a href="#" className="text-blue-200 hover:text-white transition">Documentation</a></li>
                  <li><a href="#" className="text-blue-200 hover:text-white transition">System Status</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-blue-200 hover:text-white transition">Privacy Policy</a></li>
                  <li><a href="#" className="text-blue-200 hover:text-white transition">Terms of Service</a></li>
                  <li><a href="#" className="text-blue-200 hover:text-white transition">Security</a></li>
                  <li><a href="#" className="text-blue-200 hover:text-white transition">HIPAA Compliance</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-blue-200 text-center">&copy; 2025 MediCore. All rights reserved. Built with care for healthcare.</p>
                <div className="flex items-center gap-6 text-blue-200 text-sm">
                  <span className="flex items-center gap-2">
                    <i className="fas fa-shield-alt"></i>
                    HIPAA Compliant
                  </span>
                  <span className="flex items-center gap-2">
                    <i className="fas fa-lock"></i>
                    SSL Secured
                  </span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default MediCoreLanding;