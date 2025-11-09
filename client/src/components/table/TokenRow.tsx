import { memo } from 'react';
import type { Token } from '@shared/schema';
import RankCell from './cells/RankCell';
import NameCell from './cells/NameCell';
import PriceCell from './cells/PriceCell';
import ChangeCell from './cells/ChangeCell';
import VolumeCell from './cells/VolumeCell';
import MarketCapCell from './cells/MarketCapCell';
import TagsCell from './cells/TagsCell';
import ActionCell from './cells/ActionCell';

interface TokenRowProps {
  token: Token;
  isPinned: boolean;
  onPin: () => void;
  onClick: () => void;
  density: 'compact' | 'comfortable';
  priceFlash?: 'gain' | 'loss' | null;
  style?: React.CSSProperties;
}

const TokenRow = memo(function TokenRow({
  token,
  isPinned,
  onPin,
  onClick,
  density,
  priceFlash,
  style,
}: TokenRowProps) {
  const height = density === 'compact' ? 'h-12' : 'h-16';
  
  return (
    <div
      className={`${height} flex items-center gap-4 px-4 border-b border-border hover-elevate cursor-pointer`}
      onClick={onClick}
      style={style}
      data-testid={`row-token-${token.id}`}
    >
      <div className="w-12">
        <RankCell rank={token.rank} isPinned={isPinned} onPin={onPin} />
      </div>
      <div className="flex-1 min-w-[180px]">
        <NameCell icon={token.icon} symbol={token.symbol} name={token.name} />
      </div>
      <div className="w-32 text-right">
        <PriceCell price={token.price} flash={priceFlash} />
      </div>
      <div className="w-24">
        <ChangeCell change={token.change24h} />
      </div>
      <div className="w-24">
        <ChangeCell change={token.change7d} />
      </div>
      <div className="w-28 text-right">
        <VolumeCell volume={token.volume24h} />
      </div>
      <div className="w-32 text-right">
        <MarketCapCell marketCap={token.marketCap} />
      </div>
      <div className="w-32">
        <TagsCell tags={token.tags} />
      </div>
      <div className="w-12">
        <ActionCell tokenId={token.id} />
      </div>
    </div>
  );
});

export default TokenRow;
