import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function BoardWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  function handleSaveClick() {
    axios
      .post("/api/board/add", {
        /* 프로퍼티 명과 변수 이름이 같으면 변수명 생략 가능 */
        title,
        content,
        writer,
      })
      .then(() => {
        /* 새 글을 등록 성공시 알림창 */
        toast({
          description: "새 글이 등록되었습니다.",
          status: "success",
          position: "top",
        });
        /* 새 글을 등록하면 홈으로 이동시킴 */
        navigate("/");
      })
      .catch((e) => {
        const code = e.response.status;

        /* 새 글을 등록 실패시 코드가 400번일때 알림창 */
        if (code === 400) {
          toast({
            status: "error",
            description: "등록되지 않았습니다. 입력한 내용을 확인하세요.",
            position: "top",
          });
        }
      })
      .finally();
  }

  /* 리렌더링될 때마다 제목, 본문, 작성자가 비어있으면 저장 버튼이 비활성화됨*/
  let disableSaveButton = false;
  if (title.trim().length === 0) {
    disableSaveButton = true;
  }
  if (content.trim().length === 0) {
    disableSaveButton = true;
  }
  if (writer.trim().length === 0) {
    disableSaveButton = true;
  }

  return (
    <Box>
      <Box>글 작성 화면</Box>
      <Box>
        <Box>
          <FormControl>
            <FormLabel>제목</FormLabel>
            <Input onChange={(e) => setTitle(e.target.value)} />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>본문</FormLabel>
            <Textarea onChange={(e) => setContent(e.target.value)} />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>작성자</FormLabel>
            <Input onChange={(e) => setWriter(e.target.value)} />
          </FormControl>
        </Box>
        <Box>
          <Button
            isDisabled={disableSaveButton}
            colorScheme={"blue"}
            onClick={handleSaveClick}
          >
            저장
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
