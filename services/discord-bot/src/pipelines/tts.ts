import type { PipelineType } from '@huggingface/transformers'
import type { Buffer } from 'node:buffer'

import { env } from 'node:process'
import { useLogg } from '@guiiai/logg'
import { pipeline } from '@huggingface/transformers'
import { generateTranscription } from '@xsai/generate-transcription'
import { createOpenAI } from '@xsai/providers'
import wavefile from 'wavefile'

import { pcmToWav } from '../utils/audio'

export class WhisperLargeV3Pipeline {
  static task: PipelineType = 'automatic-speech-recognition'
  static model = 'Xenova/whisper-medium.en'
  static instance = null

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = await pipeline(this.task, this.model, { progress_callback })
    }

    return this.instance
  }
}

export function textFromResult(result: Array<{ text: string }> | { text: string }) {
  if (Array.isArray(result)) {
    const arrayResult = result as { text: string }[]
    if (arrayResult.length === 0) {
      return ''
    }

    return result[0].text
  }
  else {
    if ('text' in result) {
      return result.text
    }
    else {
      return ''
    }
  }
}

export async function transcribe(pcmBuffer: Buffer) {
  const log = useLogg('Memory:Transcribe').useGlobalConfig()

  const pcmConvertedWav = pcmToWav(pcmBuffer, 48000, 2)
  log.withFields({ from: pcmBuffer.byteLength, to: pcmConvertedWav.byteLength }).log('Audio data received')

  const transcriber = await WhisperLargeV3Pipeline.getInstance() as (audio: Float32Array | Float64Array) => Promise<Array<{ text: string }> | { text: string }>
  log.log('Transcribing audio')

  const wav = new wavefile.WaveFile(pcmConvertedWav)
  wav.toBitDepth('32f') // Pipeline expects input as a Float32Array
  wav.toSampleRate(16000) // Whisper expects audio with a sampling rate of 16000
  const audioData = wav.getSamples()

  const result = await transcriber(audioData)
  const text = textFromResult(result)
  if (!text) {
    log.log('No transcription result')
    return ''
  }

  log.withField('result', text).log('Transcription result')
  return text
}

export async function openaiTranscribe(wavBuffer: Buffer) {
  const log = useLogg('Remote:Transcribe').useGlobalConfig()

  log.log('Transcribing audio...')

  const wavFile = new Blob([wavBuffer], { type: 'audio/wav' })
  const openai = createOpenAI({
    baseURL: env.OPENAI_STT_API_BASE_URL,
    apiKey: env.OPENAI_STT_API_KEY,
  })

  try {
    const result = await generateTranscription({
      ...openai.transcription('whisper-1'),
      file: wavFile,
    })

    log.withField('result', result.text).log('Transcription result')
    return result.text
  }
  catch (err) {
    log.withError(err).error('Failed to transcribe audio')
  }

  return ''
}
