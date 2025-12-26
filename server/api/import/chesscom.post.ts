// server/api/import/chesscom.post.ts
import { Chess } from "chess.js";
import { z } from "zod";

const BodySchema = z.object({
  url: z.url(),
});

export default eventHandler(async (event) => {
  const body = await readValidatedBody(event, b => BodySchema.parse(b));

  // 1. URL 파싱 (Game ID 및 Move 번호 추출)
  // 예: https://www.chess.com/analysis/game/live/147187327790?move=66
  const urlObj = new URL(body.url);
  const pathSegments = urlObj.pathname.split("/");
  // "live" 뒤에 오는 숫자가 ID일 확률이 높음, 혹은 경로의 마지막 숫자
  const gameId = pathSegments.find(s => /^\d+$/.test(s));
  const moveParam = urlObj.searchParams.get("move"); // "66"

  if (!gameId) {
    throw createError({ statusCode: 400, message: "URL에서 게임 ID를 찾을 수 없습니다." });
  }

  // 2. Chess.com 비공식 엔드포인트 호출
  // 라이브 게임: callback/live/game/{id}, 데일리 게임: callback/daily/game/{id}
  // 우선 live로 시도해보고 실패하면 daily로 시도하는 로직이 이상적이나, 보통 live 게임임.
  const apiUrl = `https://www.chess.com/callback/live/game/${gameId}`;

  try {
    const response = await $fetch<any>(apiUrl);

    if (!response || !response.game || !response.game.pgn) {
      throw new Error("PGN 데이터를 찾을 수 없습니다.");
    }

    const pgn = response.game.pgn;
    const players = response.game.players; // { white: {...}, black: {...} }

    // 3. PGN 파싱 및 특정 Move 이동
    const chess = new Chess();
    chess.loadPgn(pgn);

    let fen = chess.fen(); // 기본은 게임 종료 시점
    let description = `White: ${players.white.username} (${players.white.rating})\nBlack: ${players.black.username} (${players.black.rating})`;

    // 특정 수가 지정되어 있다면 그 시점으로 이동
    if (moveParam) {
      const targetMove = Number.parseInt(moveParam, 10);

      // chess.js로 처음부터 다시 수를 둠
      const history = chess.history({ verbose: true });
      const replayChess = new Chess();

      // moveParam은 "Ply"(반 수)가 아니라 "Move"(수)일 수 있음.
      // Chess.com URL의 ?move=66은 보통 Ply(반 수)를 의미합니다. (백1수=1, 흑1수=2)
      // 만약 전체 수(Full move)라면 * 2를 고려해야 함.
      // *Chess.com 분석 보드는 Ply(반 수) 기준입니다.*
      for (let i = 0; i < targetMove && i < history.length; i++) {
        const move = history[i];
        if (move) {
          replayChess.move(move);
        }
      }
      fen = replayChess.fen();
      description += `\n\nPosition at move ${Math.ceil(targetMove / 2)}`;
    }

    // 4. 결과 반환
    return {
      title: `${players.white.username} vs ${players.black.username}`,
      description,
      pgn,
      fen,
      source: "chess.com",
    };
  }
  catch (error) {
    console.error("Chess.com import error:", error);
    throw createError({
      statusCode: 500,
      message: "Chess.com에서 게임을 가져오는데 실패했습니다. 올바른 링크인지 확인해주세요.",
    });
  }
});
