import ChangeCell from '../table/cells/ChangeCell';

export default function ChangeCellExample() {
  return (
    <div className="p-4 space-y-2">
      <ChangeCell change={0.035} />
      <ChangeCell change={-0.028} />
    </div>
  );
}
