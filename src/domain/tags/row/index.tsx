import { ButtonRow } from "../../../components/buttons/button-row";

export const TagsRow = ({
  tags,
  active,
  setActive,
  "data-testid": testid,
}: {
  "data-testid"?: string;
  active?: string;
  tags: { label: string; value: string }[];
  setActive: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  const activeTags = active?.split(" ");
  return (
    <ButtonRow
      data-testid={testid}
      items={tags.map((t) => ({ ...t, active: activeTags?.includes(t.value) }))}
      onClick={(tag, e) => {
        if (e.shiftKey) {
          setActive((state) => {
            const selector = new Set(state?.split(" "));
            if (selector.has(tag.value)) {
              selector.delete(tag.value);
            } else {
              selector.add(tag.value);
            }
            return [...selector].join(" ");
          });
        } else {
          setActive(tag.value);
        }
      }}
    />
  );
};
