export const ellipsisText = (text: string, length: number, ellipsis: string = '...'): string => {
	return text.slice(0, length) + ellipsis
}

export const ellipsisTextStartAndEnd = (text: string, start: number, end: number, ellipsis: string = '...'): string => {
	if (start > text.length || end > text.length) return text
	return text.slice(0, start) + ellipsis + text.slice(text.length - end, text.length)
}

export const ellipsisFilename = (filename: string, length: number) => {
	const extIndex = filename.lastIndexOf('.')
	const ext = filename.slice(extIndex, filename.length)
	return ellipsisText(filename, length) + ext
}

export const FilesizeUnit = (size: number): string => {
	switch (true) {
		/*kb*/
		case size > 1024 && size < 1024 * 1024:
			return (size / 1024).toFixed(2) + 'KB'
		/*mb*/
		case size > 1024 * 1024 && size < 1024 * 1024 * 1024:
			return (size / 1024 / 1024).toFixed(2) + 'MB'
		/*gb*/
		case size > 1024 * 1024 * 1024 && size < 1024 * 1024 * 1024 * 1024:
			return (size / 1024 / 1024 / 1024).toFixed(2) + 'GB'
		default:
			return size.toFixed(2) + 'B'
	}
}