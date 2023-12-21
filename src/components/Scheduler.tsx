import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
} from "@nextui-org/react";
import "./HomePage.css";
import SubjectSelector from "./SubjectSelector";
import TimeSelect from "./TimeSelect";

export default function Scheduler() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button color="primary" variant="flat" onPress={onOpen}>
        New Session
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Schedule a Session
              </ModalHeader>
              <ModalBody>
                <SubjectSelector />
                <TimeSelect />
                <Textarea
                  label="Comments"
                  labelPlacement="outside"
                  placeholder="Enter your description"
                  className="max-w-s"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Schedule
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
