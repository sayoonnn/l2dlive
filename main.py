# server.py
import asyncio
import json

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from google import genai
from google.genai.types import (
	Content,
	LiveConnectConfig,
	HttpOptions,
	Modality,
	Part,
)

from gemini_client import GeminiSession

app = FastAPI()

@app.websocket("/ws/proxy")
async def websocket_proxy(ws: WebSocket):
	await ws.accept()
 
	session = GeminiSession()
	run_task = asyncio.create_task(session.run())
 
	send_task = asyncio.create_task(_forward_ws_to_session(ws, session))
	recv_task = asyncio.create_task(_forward_session_to_ws(ws, session))
 
	try:
		await asyncio.wait(
			[send_task, recv_task],
			return_when=asyncio.FIRST_EXCEPTION
		)
	finally:
		run_task.cancel()
		send_task.cancel()
		recv_task.cancel()

async def _forward_ws_to_session(ws: WebSocket, session: GeminiSession):
	try:
		while True:
			data = await ws.receive_bytes()
			await session.put_audio_send_queue(data)
	except WebSocketDisconnect:
		pass

async def _forward_session_to_ws(ws: WebSocket, session: GeminiSession):
	try:
		while True:
			audio_chunk = await session.get_audio_recieve_queue()
			await ws.send_bytes(audio_chunk)
	except WebSocketDisconnect:
		pass
