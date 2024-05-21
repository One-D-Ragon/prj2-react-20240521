import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { faUserPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);

  // 컴포넌트가 마운트될 때
  useEffect(() => {
    axios.get("/api/board/list").then((res) => setBoardList(res.data));
  }, []);
  // [{id:5, title: "제목1", writer: "누구1"},
  // {id:5, title: "제목1", writer: "누구1"},
  // {id:5, title: "제목1", writer: "누구1"}]

  return (
    <Box>
      <Box>게시물 목록</Box>
      <Box>
        <Table>
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>TITLE</Th>
              <Th>
                <FontAwesomeIcon icon={faUserPen} />
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {boardList.map((board) => (
              <Tr key={board.id}>
                <Td>{board.id}</Td>
                <Td>{board.title}</Td>
                <Td>{board.writer}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
