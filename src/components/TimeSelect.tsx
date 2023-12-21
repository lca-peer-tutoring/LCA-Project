import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

export default function TimeSelect() {
  const [selectedKeys, setSelectedKeys] = React.useState(
    new Set(["Select a Time"])
  );

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" className="capitalize">
          {selectedValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Single selection example"
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <DropdownItem key="8:00">8:00</DropdownItem>
        <DropdownItem key="9:00">9:00</DropdownItem>
        <DropdownItem key="10:00">10:00</DropdownItem>
        <DropdownItem key="11:00">11:00</DropdownItem>
        <DropdownItem key="12:00">12:00</DropdownItem>
        <DropdownItem key="1:00">1:00</DropdownItem>
        <DropdownItem key="2:00">2:00</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
