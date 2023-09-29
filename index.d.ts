export enum CONVERT_TYPES {
  LF = 'LF',
  CRLF = 'CRLF'
}

export function convert(content: string, type: CONVERT_TYPES): string

export function convertFile(filepath: string, type: CONVERT_TYPES, encoding?: string): Promise<void>
