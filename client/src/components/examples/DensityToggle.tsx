import DensityToggle from '../toolbar/DensityToggle';
import { useState } from 'react';

export default function DensityToggleExample() {
  const [density, setDensity] = useState<'compact' | 'comfortable'>('comfortable');

  return (
    <div className="p-4">
      <DensityToggle
        density={density}
        onToggle={() => setDensity(density === 'compact' ? 'comfortable' : 'compact')}
      />
      <p className="mt-2 text-sm text-muted-foreground">Density: {density}</p>
    </div>
  );
}
