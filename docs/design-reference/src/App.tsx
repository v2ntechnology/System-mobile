import React, { useState } from 'react';
import { DashboardView } from './components/DashboardView';
import { LoadDetailsView } from './components/LoadDetailsView';
import { VehiclesView } from './components/VehiclesView';
import { MapView } from './components/MapView';
import { RewardsView } from './components/RewardsView';
import { ProfileView } from './components/ProfileView';
import { FuelStationsView } from './components/FuelStationsView';
import { BottomNav } from './components/BottomNav';
import { AnimatePresence } from 'motion/react';

export default function App() {
  // 'dashboard' | 'details' | 'vehicles' | 'map' | 'rewards' | 'profile' | 'fuel_stations'
  const [currentView, setCurrentView] = useState<string>('dashboard');

  return (
    <div className="h-[100dvh] bg-gray-100 flex justify-center w-full">
      <div className="w-full max-w-md bg-[#F8F9FA] shadow-2xl relative overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto no-scrollbar relative bg-[#F8F9FA]">
          <AnimatePresence mode="wait">
            {currentView === 'dashboard' && <DashboardView key="dashboard" onNavigate={setCurrentView} />}
            {currentView === 'details' && <LoadDetailsView key="details" onNavigate={setCurrentView} />}
            {currentView === 'vehicles' && <VehiclesView key="vehicles" onNavigate={setCurrentView} />}
            {currentView === 'map' && <MapView key="map" onNavigate={setCurrentView} />}
            {currentView === 'rewards' && <RewardsView key="rewards" onNavigate={setCurrentView} />}
            {currentView === 'profile' && <ProfileView key="profile" onNavigate={setCurrentView} />}
            {currentView === 'fuel_stations' && <FuelStationsView key="fuel_stations" onNavigate={setCurrentView} />}
          </AnimatePresence>
        </div>
        
        {/* Persistent Bottom Nav - Hide on specific detail screens */}
        {['details', 'fuel_stations'].includes(currentView) === false && (
          <BottomNav active={currentView} onNavigate={setCurrentView} />
        )}
      </div>
    </div>
  );
}

