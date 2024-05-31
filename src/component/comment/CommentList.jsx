import { useEffect, useState } from "react";
import axios from "axios";
import {Box, Card, CardBody, Stack, StackDivider} from "@chakra-ui/react";
import { CommentItem } from "./CommentItem.jsx";

export function CommentList({ boardId, isProcessing, setIsProcessing }) {
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    if (!isProcessing) {
      axios
        .get(`/api/comment/list/${boardId}`)
        .then((res) => {
          setCommentList(res.data);
        })
        .catch((err) => console.log(err))
        .finally(() => {});
    }
  }, [isProcessing]); // isProcessing이 변경될 때 트리거시킴
  // useEffect의 두번째 인자는 dependency로 인자로 받은 값의 상태가 바뀌었을 때 다시 트리거 한다
  // 따라서 첫번째 인자값의 실행 상태가 두번째 인자에 들어가면 무한 반복이 될 수 있다? (강의 다시 참고)
  if (commentList.length === 0) {
    return <Box>댓글이 없습니다. 첫 댓글을 작성해보세요.</Box>;
  }
  return (
    <Card>
      <CardBody>
        <Stack divider={<StackDivider />} spacing={=4}>
          {commentList.map((comment) => (
            <CommentItem
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
              comment={comment}
              key={comment.id}
            />
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}
