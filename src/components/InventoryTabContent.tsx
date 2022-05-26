import React from "react";
import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";
import { ITEM_DETAILS } from "features/game/types/images";
import { InventoryItemName } from "features/game/types/game";

import { SEEDS, CropName } from "features/game/types/crops";

import timer from "assets/icons/timer.png";
import lightning from "assets/icons/lightning.png";

import { secondsToMidString } from "lib/utils/time";
import classNames from "classnames";
import { useShowScrollbar } from "lib/utils/hooks/useShowScrollbar";
import { useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { Inventory, TabItems } from "./InventoryItems";
import { getCropTime } from "features/game/events/plant";
import { getKeys } from "features/game/types/craftables";
import { useMakeDefaultInventoryItem } from "components/hooks/useGetDefaultInventoryItem";
import { useHasBoostForItem } from "./hooks/useHasBoostForItem";

const ITEM_CARD_MIN_HEIGHT = "148px";

interface Props {
  tabItems: TabItems;
  selectedItem?: InventoryItemName;
  setDefaultSelectedItem: (item: InventoryItemName) => void;
  inventory: Inventory;
  inventoryItems: InventoryItemName[];
  onClick: (item: InventoryItemName) => void;
  isFarming?: boolean;
}

const TAB_CONTENT_HEIGHT = 384;

const isSeed = (selectedItem: InventoryItemName) => selectedItem in SEEDS();

export const InventoryTabContent = ({
  tabItems,
  selectedItem,
  setDefaultSelectedItem,
  inventory,
  inventoryItems,
  onClick,
  isFarming,
}: Props) => {
  const { ref: itemContainerRef, showScrollbar } =
    useShowScrollbar(TAB_CONTENT_HEIGHT);
  const [scrollIntoView] = useScrollIntoView();
  const inventoryCategories = getKeys(tabItems) as InventoryItemName[];

  const inventoryMap = inventoryItems.reduce((acc, curr) => {
    const category = inventoryCategories.find(
      (category) => curr in tabItems[category].items
    );

    if (category) {
      const currentItems = acc[category] || [];

      acc[category] = [...currentItems, curr];
    }

    return acc;
  }, {} as Record<string, InventoryItemName[]>);

  useMakeDefaultInventoryItem({
    setDefaultSelectedItem,
    inventoryMap,
    inventoryCategories,
    isFarming,
  });

  const isTimeBoosted = useHasBoostForItem({ selectedItem, inventory });

  const findIfItemsExistForCategory = (category: string) => {
    return getKeys(inventoryMap).includes(category);
  };

  const getCropHarvestTime = (seedName = "") => {
    const crop = seedName.split(" ")[0] as CropName;

    return secondsToMidString(getCropTime(crop, inventory));
  };

  const handleItemClick = (item: InventoryItemName) => {
    onClick(item);

    if (item && ITEM_DETAILS[item].section) {
      scrollIntoView(ITEM_DETAILS[item].section);
    }
  };

  const inventoryIsEmpty = Object.values(inventoryMap).every(
    (value) => value.length === 0
  );

  return (
    <div className="flex flex-col">
      {!inventoryIsEmpty && (
        <OuterPanel className="flex-1 mb-3">
          {selectedItem && (
            <div
              style={{ minHeight: ITEM_CARD_MIN_HEIGHT }}
              className="flex flex-col justify-evenly items-center p-2"
            >
              <span className="text-center text-shadow">{selectedItem}</span>
              <img
                src={ITEM_DETAILS[selectedItem].image}
                className="h-12"
                alt={selectedItem}
              />
              <span className="text-xs text-shadow text-center mt-2 w-80">
                {ITEM_DETAILS[selectedItem].description}
              </span>
              {isSeed(selectedItem) && (
                <div className="w-full pt-1">
                  <div className="flex justify-center items-end">
                    <img src={timer} className="h-5 me-2" />
                    {isTimeBoosted && (
                      <img src={lightning} className="h-6 me-2" />
                    )}
                    <span className="text-xs text-shadow text-center mt-2 ">
                      {getCropHarvestTime(selectedItem)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </OuterPanel>
      )}
      <div
        ref={itemContainerRef}
        style={{ maxHeight: TAB_CONTENT_HEIGHT }}
        className={classNames("overflow-y-auto", {
          scrollable: showScrollbar,
        })}
      >
        {inventoryCategories.map((category) => (
          <div className="flex flex-col pl-2" key={category}>
            {<p className="mb-2 underline">{category}</p>}
            {findIfItemsExistForCategory(category) ? (
              <div className="flex mb-2 flex-wrap -ml-1.5">
                {inventoryMap[category].map((item) => (
                  <Box
                    count={inventory[item]}
                    isSelected={selectedItem === item}
                    key={item}
                    onClick={() => handleItemClick(item)}
                    image={ITEM_DETAILS[item].image}
                  />
                ))}
              </div>
            ) : (
              <p className="text-white text-xs text-shadow mb-2 pl-2.5">
                {`No ${category} in inventory`}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
