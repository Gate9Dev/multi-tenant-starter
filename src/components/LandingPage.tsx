import React from 'react';
import { ArrowRight, Building2, Shield, Users } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="bg-white">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              Multi-Tenant Platform
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-blue-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Secure, scalable, and customizable solutions for your organization
            </p>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Feature
              icon={<Building2 className="h-8 w-8" />}
              title="Multi-Tenant Architecture"
              description="Dedicated spaces for each organization with complete data isolation"
            />
            <Feature
              icon={<Shield className="h-8 w-8" />}
              title="Enterprise Security"
              description="Advanced security measures to protect your sensitive data"
            />
            <Feature
              icon={<Users className="h-8 w-8" />}
              title="Team Collaboration"
              description="Built for teams to work together seamlessly"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function Feature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="relative p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-base text-gray-500">{description}</p>
      <div className="mt-4 flex items-center text-blue-600 hover:text-blue-700">
        Learn more <ArrowRight className="ml-2 h-4 w-4" />
      </div>
    </div>
  );
}