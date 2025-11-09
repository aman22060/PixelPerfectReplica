import SearchBox from '../toolbar/SearchBox';
import { useState } from 'react';

export default function SearchBoxExample() {
  const [value, setValue] = useState('');

  return (
    <div className="p-4">
      <SearchBox value={value} onChange={setValue} />
      <p className="mt-2 text-sm text-muted-foreground">Search value: {value || '(empty)'}</p>
    </div>
  );
}
