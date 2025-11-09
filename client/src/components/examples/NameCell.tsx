import NameCell from '../table/cells/NameCell';

export default function NameCellExample() {
  return (
    <div className="p-4">
      <NameCell
        icon="https://api.dicebear.com/7.x/shapes/svg?seed=BTC"
        symbol="BTC"
        name="Bitcoin"
      />
    </div>
  );
}
