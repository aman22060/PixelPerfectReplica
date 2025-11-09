import TagsCell from '../table/cells/TagsCell';

export default function TagsCellExample() {
  return (
    <div className="p-4">
      <TagsCell tags={['blue-chip', 'pow', 'layer-1', 'defi']} />
    </div>
  );
}
