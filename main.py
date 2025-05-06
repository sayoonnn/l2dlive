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
	await session.run()

	try:
		while True:
			data = await ws.receive_bytes()
			await session.put_audio_in_queue(data)

	except WebSocketDisconnect:
		print("Client disconnected")
