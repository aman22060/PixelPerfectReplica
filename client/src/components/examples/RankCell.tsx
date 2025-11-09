import RankCell from '../table/cells/RankCell';
import { useState } from 'react';

export default function RankCellExample() {
  const [isPinned, setIsPinned] = useState(false);

  return (
    <div className="p-4">
      <RankCell rank={1} isPinned={isPinned} onPin={() => setIsPinned(!isPinned)} />
    </div>
  );
}
