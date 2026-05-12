import { useState } from "react";
import { useTagsStore } from "../../components/stage/tags/tags";

export const AddTag = () => {
  const addTag = useTagsStore((t) => t.addTag);

  const [tagText, setTagText] = useState("");
  return (
    <label>
      <input
        type="text"
        placeholder="Add Tag"
        value={tagText}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag("stage-fixture", tagText);
            setTagText("");
          }
        }}
        onChange={(e) => {
          setTagText(e.target.value);
        }}
      />
      <button
        onClick={() => {
          addTag("stage-fixture", tagText);
          setTagText("");
        }}
      >
        add
      </button>
    </label>
  );
};
