import { useEffect } from "react";
import { Venue } from "../../context/venues";
import styles from "./styles.module.scss";
import { useProfiles } from "../../context/profiles";
import { Scene } from "../../context/scenes";
// import { GenericLight } from "../generic-light";
import { useZones } from "../../context/zones";

export const HotSpots = ({
  venue,
  scene,
  setScene,
}: {
  setScene: React.Dispatch<React.SetStateAction<Scene>>;
  venue: Venue;
  scene: Scene;
}) => {
  const allProfiles = useProfiles((state) => state.profiles);
  const { zones, activeZone, setZones } = useZones((state) => state);
  const setActiveZone = useZones((state) => state.setActiveZone);

  useEffect(() => {
    setZones(venue);
  }, [venue, setZones]);

  return (
    <div className={styles.tags}>
      {zones.map((tag) => (
        <div
          key={tag}
          onClick={() => {
            setActiveZone(tag);
          }}
          className={styles.tag}
          style={
            activeZone === tag
              ? {
                  border: "1px solid red",
                }
              : {}
          }
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            const profileId = e.dataTransfer.getData("profileId");
            const profile = allProfiles.find((f) => f.id === profileId);

            if (!profile) return;

            const profileIds =
              (tag !== undefined &&
                (scene.profiles[tag] as string[] | undefined)) ||
              [];

            setScene({
              ...scene,
              // fixtureGroups: [...fixtureGroups],
              profiles: {
                ...scene.profiles,
                [tag || 0]: [...profileIds, profile.id],
              },
            });
          }}
        >
          <div className={styles.inner}>{tag}</div>
          {/* <GenericLight
            profiles={
              scene.profiles[tag]?.reduce((profiles, profileId) => {
                const foundProfile = allProfiles.find(
                  (p) => p.id === profileId
                );
                if (foundProfile) return [...profiles, foundProfile];
                return profiles;
              }, [] as GenericProfile[]) || []
            }
          /> */}

          {scene.profiles[tag]?.map((profileId) => {
            const profile = allProfiles.find((p) => p.id === profileId);

            if (!profile) return null;

            return (
              <button
                key={profileId}
                className={styles.button}
                onClick={() => {
                  if (scene.profiles[tag]) {
                    const newProfiles =
                      scene.profiles[tag]?.filter((p) => p != profile.id) || [];

                    setScene((scene) => ({
                      ...scene,
                      profiles: {
                        ...scene.profiles,
                        [tag]:
                          newProfiles.length === 0 ? undefined : newProfiles,
                      },
                    }));
                  }
                }}
              >
                {profile.name}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};
