import asyncio
from google import genai
from google.genai import types

import logging

# 1) 로거 설정 (한 번만)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)

logger = logging.getLogger(__name__)


client = genai.Client()

MODEL = "gemini-2.0-flash-live-001"

CONFIG = {
	"system_instruction": types.Content(
		parts=[
			types.Part(
				text="You are a helpful assistant and answer in a friendly tone. Must respond in Korean.",
			)
		]
	),
	"response_modalities": ["AUDIO"],
 	"output_audio_transcription": {},
	"context_window_compression": types.ContextWindowCompressionConfig(sliding_window=types.SlidingWindow()),
 	"speech_config": types.SpeechConfig(
		language_code="ko-KR",  
		voice_config=types.VoiceConfig(
			prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name="Aoede")
        )
	),
}

class GeminiSession:
	def __init__(self):
		self.session = None
		self.audio_send_queue = asyncio.Queue()
		self.audio_recieve_queue = asyncio.Queue()
  
	async def put_audio_send_queue(self, audio_bytes):
		await self.audio_send_queue.put(audio_bytes)
  
	async def get_audio_recieve_queue(self):
		return await self.audio_recieve_queue.get()

	async def send_realtime(self):
		while True:
			audio_bytes = await self.audio_send_queue.get()
			await self.session.send_realtime_input(
				media=types.Blob(data=audio_bytes, mime_type="audio/pcm;rate=16000")
			)

	async def receive_audio(self):
		while True:
			async for response in self.session.receive():
				logger.info(f"Received response: {response.server_content.turn_complete}")
				if response.server_content.turn_complete:
					while not self.audio_recieve_queue.empty():                         # :contentReference[oaicite:0]{index=0}
						try:
							self.audio_recieve_queue.get_nowait()                       # :contentReference[oaicite:1]{index=1}
						except asyncio.QueueEmpty:
							break

				if response.data is not None:
					self.audio_recieve_queue.put_nowait(response.data)
	
	async def run(self):
		try:
			async with (
				client.aio.live.connect(model=MODEL, config=CONFIG) as session,
				asyncio.TaskGroup() as tg,
			):
				self.session = session
				tg.create_task(self.receive_audio())
				send_audio_task = tg.create_task(self.send_realtime())

		except asyncio.CancelledError:
			pass

		except ExceptionGroup as EG:
			pass


