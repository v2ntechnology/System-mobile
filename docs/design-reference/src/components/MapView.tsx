import React from 'react';
import { RouteFuelView } from './RouteFuelView';

interface Props {
  onNavigate: (view: string) => void;
}

export const MapView: React.FC<Props> = ({ onNavigate }) => {
  return <RouteFuelView onNavigate={onNavigate} />;
};
