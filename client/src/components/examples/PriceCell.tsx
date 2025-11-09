import PriceCell from '../table/cells/PriceCell';

export default function PriceCellExample() {
  return (
    <div className="p-4 space-y-2">
      <PriceCell price={67432.15} />
      <PriceCell price={0.000123} flash="gain" />
      <PriceCell price={3.45} flash="loss" />
    </div>
  );
}
