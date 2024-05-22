import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function MemberSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickName, setNickName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckedEmail, setIsCheckedEmail] = useState(false);
  const [isCheckedNickName, setIsCheckedNickName] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  function handleClick() {
    setIsLoading(true);
    axios
      .post("/api/member/signup", { email, password, nickName })
      .then((res) => {
        toast({
          status: "success",
          description: "회원 가입이 완료되었습니다.",
          position: "top",
        });
        // todo : 로그인 화면으로 이동
        navigate("/");
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast({
            status: "error",
            description: "입력값을 확인해 주세요.",
            position: "top",
          });
        } else {
          toast({
            status: "error",
            description: "회원 가입 중 문제가 발생하였습니다.",
            position: "top",
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleCheckEmail() {
    axios
      .get(`/api/member/check?email=${email}`)
      .then((res) => {
        toast({
          status: "warning",
          description: "사용할 수 없는 이메일입니다.",
          position: "top",
        });
      }) // 이미 있는 이메일
      .catch((err) => {
        if (err.response.status === 404) {
          // 사용할 수 있는 이메일
          toast({
            status: "info",
            description: "사용할 수 있는 이메일입니다.",
            position: "top",
          });
          /* 이메일 중복확인 되어야 가입버튼 활성화 */
          setIsCheckedEmail(true);
        }
      })
      .finally();
  }

  function handleCheckNickName() {
    axios
      .get(`/api/member/check?nickName=${nickName}`)
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

  // 암호 확인 인풋 추가
  const isCheckedPassword = password === passwordCheck;

  // 이메일, 암호, 별명이 입력되어야 가입 버튼 활성화
  let isDisabled = false;
  if (!isCheckedPassword) {
    isDisabled = true;
  }
  if (
    !(
      email.trim().length > 0 &&
      password.trim().length > 0 &&
      nickName.trim().length > 0
    )
  ) {
    isDisabled = true;
  }

  // 이메일, 별명 중복확인 되어야 가입버튼 활성화
  if (!isCheckedEmail) {
    isDisabled = true;
  }
  if (!isCheckedNickName) {
    isDisabled = true;
  }

  // 유효한 이메일을 입력했을 때만 가입버튼 활성화
  if (!isValidEmail) {
    isDisabled = true;
  }

  return (
    <Box>
      <Box>회원 가입</Box>
      <Box>
        <Box>
          <FormControl>
            <FormLabel>이메일</FormLabel>
            <InputGroup>
              <Input
                type={"email"}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsCheckedEmail(false);
                  setIsValidEmail(!e.target.validity.typeMismatch);
                  console.log(e.target.validity.typeMismatch);
                }}
              />
              <InputRightElement w={"75px"} mr={1}>
                {/* 올바른 이메일 형식을 작성했을 때만 중복확인 버튼 활성화 */}
                <Button
                  isDisabled={!isValidEmail || email.trim().length == 0}
                  onClick={handleCheckEmail}
                  size={"sm"}
                >
                  중복확인
                </Button>
              </InputRightElement>
            </InputGroup>
            {/* 이메일 중복확인 안되면 안내 메세지 출력 */}
            {isCheckedEmail || (
              <FormHelperText>이메일 중복확인을 해주세요.</FormHelperText>
            )}
            {/* 올바른 이메일 형식을 작성했을 때만 중복확인 버튼 활성화 */}
            {isValidEmail || (
              <FormHelperText>
                올바른 이메일 형식으로 작성해 주세요.
              </FormHelperText>
            )}
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>암호</FormLabel>
            <Input onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>암호확인</FormLabel>
            <Input onChange={(e) => setPasswordCheck(e.target.value)} />
            {/* 암호 확인 인풋 추가 */}
            {isCheckedPassword || (
              <FormHelperText>암호가 일치하지 않습니다.</FormHelperText>
            )}
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>별명</FormLabel>
            <InputGroup>
              <Input
                onChange={(e) => {
                  setNickName(e.target.value);
                  setIsCheckedNickName(false);
                }}
              />
              <InputRightElement w={"75px"} mr={1}>
                {/* 입력한 별명의 길이가 0이면 중복확인 버튼 비활성화 */}
                <Button
                  isDisabled={nickName.trim().length == 0}
                  onClick={handleCheckNickName}
                  size={"sm"}
                >
                  중복확인
                </Button>
              </InputRightElement>
            </InputGroup>
            {/* 별명 중복확인 안되면 안내 메세지 출력 */}
            {isCheckedNickName || (
              <FormHelperText>별명 중복확인을 해주세요.</FormHelperText>
            )}
          </FormControl>
        </Box>
        <Box>
          <Button
            isLoading={isLoading}
            colorScheme={"blue"}
            onClick={handleClick}
            isDisabled={isDisabled}
          >
            가입
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
