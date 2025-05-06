import asyncio
from google import genai
from google.genai import types

client = genai.Client()

MODEL = "gemini-2.0-flash-live-001"

CONFIG = {
	"system_instruction": types.Content(
		parts=[
			types.Part(
				text="You are a helpful assistant and answer in a friendly tone."
			)
		]
	),
	"response_modalities": ["TEXT"],
}

class GeminiSession:
	def __init__(self):
		self.session = None

		self.send_queue = None
		self.audio_in_queue = None
		self.out_queue = None
  
  
	async def put_audio_in_queue(self, audio_bytes):
		await self.audio_in_queue.put(audio_bytes)

	async def send_realtime(self):
		while True:
			audio_bytes = await self.send_queue.get()
			await self.session.send_realtime_input(
				media=types.Blob(data=audio_bytes, mime_type="audio/pcm;rate=16000")
			)

	async def receive_audio(self):
		async for turn in self.session.receive():
			print("Received turn")
			for response in turn:
				if response.text:
					print(response.text, end="", flush=True)
				elif getattr(response, "data", None) is not None:
					print(f"Received audio: {len(response.data)} bytes")
				else:
					print("Unknown response type")

	async def run(self):
		try:
			async with (
				client.aio.live.connect(model=MODEL, config=CONFIG) as session,
				asyncio.TaskGroup() as tg,
			):
				self.session = session

				self.audio_in_queue = asyncio.Queue()
				self.out_queue = asyncio.Queue(maxsize=5)
	
				tg.create_task(self.receive_audio())
				tg.create_task(self.send_realtime())

				await send_audio_task
				raise asyncio.CancelledError("User requested exit")

		except asyncio.CancelledError:
			pass

		except ExceptionGroup as EG:
			pass


