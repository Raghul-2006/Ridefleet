import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Company',
      links: [
        { name: 'About Us', path: '#' },
        { name: 'Careers', path: '#' },
        { name: 'Press', path: '#' },
        { name: 'Contact', path: '#' },
      ],
    },
    {
      title: 'Rent',
      links: [
        { name: 'Browse Fleet', path: '/browse' },
        { name: 'Rental Policy', path: '#' },
        { name: 'Insurance', path: '#' },
        { name: 'FAQ', path: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', path: '#' },
        { name: 'Terms of Service', path: '#' },
        { name: 'Cookie Policy', path: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-white dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-900 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-brand-blue rounded-lg flex items-center justify-center">
                 <span className="icon-rounded text-white text-xl">directions_car</span>
              </div>
              <span className="text-xl font-black tracking-tight text-neutral-900 dark:text-neutral-50">
                Ride<span className="text-brand-blue">Fleet</span>
              </span>
            </Link>
            <p className="text-sm text-neutral-500 max-w-xs leading-relaxed">
              Premium vehicle rental platform providing seamless mobility solutions across India's major cities. Professional service, guaranteed quality.
            </p>
            <div className="flex gap-4">
              {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-400 hover:text-brand-blue hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all"
                >
                  <span className="icon-rounded text-xl">social_distance</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="col-span-1">
              <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-neutral-900 dark:text-neutral-50">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path} 
                      className="text-sm text-neutral-500 hover:text-brand-blue transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Column */}
          <div className="col-span-2 lg:col-span-1 lg:ml-auto">
             <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-neutral-900 dark:text-neutral-50">Region</h4>
             <p className="text-sm text-neutral-500 mb-4">India Operation Hubs</p>
             <div className="flex flex-wrap gap-2">
                {['Mumbai', 'Delhi', 'Bangalore', 'Chennai'].map(city => (
                  <span key={city} className="text-[10px] font-bold px-2 py-1 bg-neutral-100 dark:bg-neutral-900 rounded-md text-neutral-500">{city}</span>
                ))}
             </div>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-100 dark:border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-neutral-400">
            © {currentYear} RideFleet Mobility Services Pvt Ltd. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">Powered by FleetOS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
