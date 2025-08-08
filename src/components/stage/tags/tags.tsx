import { useRef, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import styles from "./styles.module.scss";

const useTagsStore = create(
  persist<{
    tags: Record<string, Array<string> | undefined>;
    addTag: (cat: string, tag: string) => void;
  }>(
    (set) => {
      return {
        tags: {},
        addTag: (category: string, tag: string) =>
          set((state) => {
            const tags = new Set(state.tags[category]);
            tags.add(tag);
            return {
              ...state,
              tags: {
                ...state.tags,
                [category]: [...tags],
              },
            };
          }),
      };
    },
    {
      // @ts-expect-error error for some reason...
      partialize: (state) => {
        return {
          tags: state.tags,
        };
      },
      name: "tag-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

export const Tags = ({
  selector,
  tags,
  updateTags,
  onClick,
}: {
  selector: string;
  tags?: string[];
  updateTags: (tags: string[]) => void;
  onClick?: (tag: string) => void;
}) => {
  const allTags = useTagsStore((a) => a.tags[selector]) || [];
  const addTag = useTagsStore((a) => a.addTag);

  return (
    <TagSelect
      onClick={onClick}
      tags={tags}
      allTags={allTags}
      updateTags={updateTags}
      addTag={(tag) => addTag(selector, tag)}
    />
  );
};

export const TagSelect = ({
  tags = [],
  allTags,
  updateTags,
  addTag,
  onClick,
}: {
  allTags: string[];
  tags?: string[];
  updateTags: (tags: string[]) => void;
  addTag?: (tag: string) => void;
  onClick?: (tag: string) => void;
}) => {
  const [value, setValue] = useState("");
  const id = useRef(crypto.randomUUID());

  return (
    <div className={styles.tags}>
      {tags?.map((tag) => (
        <button
          key={tag}
          className={styles.tag}
          onClick={() => {
            onClick && onClick(tag);
            updateTags(tags.filter((t) => t !== tag));
          }}
        >
          {tag}
        </button>
      ))}

      <input
        className={styles.input}
        list={id.current}
        value={value}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const newTags = value.split(" ");

            addTag &&
              newTags.forEach((tag) => {
                addTag(tag);
              });
            updateTags([...(tags || []), ...newTags]);
            setValue("");
          }
        }}
        onChange={(e) => {
          // @ts-expect-error this is a weird
          if (typeof e.nativeEvent.data === "undefined") {
            setValue("");
            updateTags([...(tags || []), e.target.value]);
          } else {
            setValue(e.target.value);
          }
        }}
      />
      <datalist id={id.current}>
        {[...allTags].map((tag) => (
          <option key={tag} value={tag} />
        ))}
      </datalist>
    </div>
  );
};
