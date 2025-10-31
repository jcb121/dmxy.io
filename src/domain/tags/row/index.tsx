export const TagsRow = ({
  tags,
  onClick,
  active,
}: {
  active?: string;
  tags: { label: string; value: string }[];
  onClick: (tag: string, shiftKey: boolean) => void;
}) => {
  return (
    <>
      {tags.map((tag) => (
        <button
          style={{
            borderColor: active?.includes(tag.value) ? "red" : undefined,
          }}
          key={tag.value}
          onClick={(e) => {
            onClick(tag.value, e.shiftKey);
          }}
        >
          {tag.label}
        </button>
      ))}
    </>
  );
};
