export const TagsRow = ({
  tags,
  onClick,
  active,
}: {
  active?: string;
  tags: { label: string; value: string }[];
  onClick: (tag: string) => void;
}) => {
  return (
    <>
      {tags.map((tag) => (
        <button
          style={{
            borderColor: active === tag.value ? "red" : undefined,
          }}
          key={tag.value}
          onClick={() => onClick(tag.value)}
        >
          {tag.label}
        </button>
      ))}
    </>
  );
};
