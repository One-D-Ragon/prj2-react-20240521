import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export function MemberEdit() {
  const [member, setMember] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [isCheckedNickName, setIsCheckedNickName] = useState(true);
  const [oldNickName, setOldNickName] = useState("");
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    axios
      .get(`/api/member/${id}`)
      .then((res) => {
        const member1 = res.data;
        setMember({ ...member1, password: "" });
        setOldNickName(member1.nickName);
      })
      .catch(() => {
        toast({
          status: "warning",
          description: "회원 정보 조회 중 문제가 발생하였습니다.",
          position: "top",
        });
        navigate("/");
      });
  }, []);

  function handleClickSave() {
    axios
      .put("/api/member/modify", { ...member, oldPassword })
      .then((res) => {})
      .catch(() => {})
      .finally(() => {});
  }

  if (member === null) {
    return <Spinner />;
  }

  let isDisableNickNameCheckButton = false;
  // 기존 별명과 같으면 중복확인 버튼 비활성화
  if (member.nickName === oldNickName) {
    isDisableNickNameCheckButton = true;
  }
  // 별명이 없으면 중복확인 버튼 비활성화
  if (member.nickName.length == 0) {
    isDisableNickNameCheckButton = true;
  }

  let isDisableSaveButton = false;
  /* 암호와 암호확인이 일치하지 않으면 저장 버튼이 비활성화 */
  if (member.password !== passwordCheck) {
    isDisableSaveButton = true;
  }
  if (member.nickName.trim().length === 0) {
    isDisableSaveButton = true;
  }

  /* 중복 확인이 안됐으면 저장버튼 비활성화 */
  if (!isCheckedNickName) {
    isDisableSaveButton = true;
  }
  /* 중복확인이 끝났으면 중복확인 버튼 비활성화 */
  if (isCheckedNickName) {
    isDisableNickNameCheckButton = true;
  }

  function handleCheckNickName() {
    axios
      .get(`/api/member/check?nickName=${member.nickName}`)
      .then((res) => {
        toast({
          status: "warning",
          description: "사용할 수 없는 닉네임입니다.",
          position: "top",
        });
      }) // 이미 있는 이메일
      .catch((err) => {
        if (err.response.status === 404) {
          // 사용할 수 있는 닉네임
          toast({
            status: "info",
            description: "사용할 수 있는 닉네임입니다.",
            position: "top",
          });
          /* 별명 중복확인 되어야 가입버튼 활성화 */
          setIsCheckedNickName(true);
        }
      })
      .finally();
  }

  return (
    <Box>
      <Box>회원 정보 수정</Box>
      <Box>
        <Box>
          <FormControl>
            <FormLabel>이메일</FormLabel>
            <Input readOnly value={member.email} />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>암호</FormLabel>
            <Input
              onChange={(e) =>
                setMember({ ...member, password: e.target.value })
              }
              placeholder={"암호를 변경하려면 입력하세요."}
            />
            <FormHelperText>
              입력하지 않으면 기존 암호를 변경하지 않습니다.
            </FormHelperText>
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>암호 확인</FormLabel>
            <Input onChange={(e) => setPasswordCheck(e.target.value)} />
            {member.password === passwordCheck || (
              <FormHelperText>암호가 일치하지 않습니다.</FormHelperText>
            )}
          </FormControl>
        </Box>
        <Box>
          <FormControl>별명</FormControl>
          <InputGroup>
            <Input
              onChange={(e) => {
                const newNickName = e.target.value.trim();
                setMember({ ...member, nickName: newNickName });
                setIsCheckedNickName(newNickName === oldNickName);
              }}
              value={member.nickName}
            />
            <InputRightElement w={"75px"} mr={1}>
              <Button
                isDisabled={isDisableNickNameCheckButton}
                size={"sm"}
                onClick={handleCheckNickName}
              >
                중복확인
              </Button>
            </InputRightElement>
          </InputGroup>
        </Box>
        <Box>
          <Button
            isDisabled={isDisableSaveButton}
            onClick={onOpen}
            colorScheme={"blue"}
          >
            저장
          </Button>
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>기존 암호 확인</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>기존 암호</FormLabel>
              <Input onChange={(e) => setOldPassword(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>취소</Button>
            <Button colorScheme={"blue"} onClick={handleClickSave}>
              확인
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
