import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

export default function SubjectSelector() {
  const [selectedKeys, setSelectedKeys] = React.useState(
    new Set(["Select a Subject"])
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
        <DropdownItem key="Physics">Physics</DropdownItem>
        <DropdownItem key="Computer_Science">Computer Science</DropdownItem>
        <DropdownItem key="Math">Math</DropdownItem>
        <DropdownItem key="Chemistry">Chemistry</DropdownItem>
        <DropdownItem key="Biology">Biology</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
