import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Twitter } from 'lucide-react';
import type { TokenDetail } from '@shared/schema';
import { formatCurrency } from '@/utils/format';
import ChangeCell from '../table/cells/ChangeCell';

interface TokenDetailModalProps {
  token: TokenDetail | null;
  open: boolean;
  onClose: () => void;
}

export default function TokenDetailModal({ token, open, onClose }: TokenDetailModalProps) {
  if (!token) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl" data-testid="modal-token-detail">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={token.icon} alt={token.symbol} />
              <AvatarFallback>{token.symbol.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">{token.name}</span>
                <span className="text-lg text-muted-foreground">{token.symbol}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                {token.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Price</p>
              <p className="text-2xl font-bold font-mono">{formatCurrency(token.price)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Market Cap</p>
              <p className="text-2xl font-bold font-mono">{formatCurrency(token.marketCap)}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">24h Change</p>
              <ChangeCell change={token.change24h} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">7d Change</p>
              <ChangeCell change={token.change7d} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">24h Volume</p>
              <p className="font-mono text-sm">{formatCurrency(token.volume24h)}</p>
            </div>
          </div>

          <div className="bg-muted rounded-md p-6 flex items-center justify-center h-48">
            <p className="text-muted-foreground">Price chart placeholder</p>
          </div>

          {token.description && (
            <div>
              <h3 className="font-semibold mb-2">About {token.name}</h3>
              <p className="text-sm text-muted-foreground">
                {token.description}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            {token.website && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open(token.website, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Website
              </Button>
            )}
            {token.twitter && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open(`https://twitter.com/${token.twitter}`, '_blank')}
              >
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
